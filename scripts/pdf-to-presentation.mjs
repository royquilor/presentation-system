#!/usr/bin/env node
/**
 * Converts a PDF file (local or URL) into presentation-format markdown
 * compatible with the Datacom presentation system's parseMarkdownToReport().
 *
 * Usage:
 *   node scripts/pdf-to-presentation.mjs --url "https://example.com/report.pdf"
 *   node scripts/pdf-to-presentation.mjs --file ./downloads/report.pdf
 *   node scripts/pdf-to-presentation.mjs --url "..." --output content/external-reports/
 *   node scripts/pdf-to-presentation.mjs --file report.pdf --author "Anthropic" --date "March 2026"
 */

import fs from 'fs'
import path from 'path'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import {
  slugify,
  formatDate,
  splitSections,
  extractBullets,
  extractNumberedItems,
  extractParagraphs,
  truncate,
  buildObservations,
  generatePresentation,
} from '../lib/generate-presentation.mjs'

// ── CLI ──────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2)
function getFlag(name) {
  const i = argv.indexOf(name)
  return i !== -1 && argv[i + 1] ? argv[i + 1] : null
}

const urlFlag = getFlag('--url')
const fileFlag = getFlag('--file')
const outputDir = getFlag('--output') || path.join(import.meta.dirname, '..', 'content', 'presentations')
const authorOverride = getFlag('--author')
const dateOverride = getFlag('--date')

if (!urlFlag && !fileFlag) {
  console.error('Usage: node scripts/pdf-to-presentation.mjs --url <url> | --file <path> [--output <dir>] [--author <name>] [--date <date>]')
  process.exit(1)
}

// ── PDF loading ──────────────────────────────────────────────────────────────

async function loadPdfBytes() {
  if (fileFlag) {
    const resolved = path.resolve(fileFlag)
    if (!fs.existsSync(resolved)) {
      console.error(`File not found: ${resolved}`)
      process.exit(1)
    }
    return new Uint8Array(fs.readFileSync(resolved))
  }

  console.log(`Downloading PDF from ${urlFlag}...`)
  const resp = await fetch(urlFlag)
  if (!resp.ok) {
    console.error(`Failed to download: ${resp.status} ${resp.statusText}`)
    process.exit(1)
  }
  return new Uint8Array(await resp.arrayBuffer())
}

// ── PDF text extraction ──────────────────────────────────────────────────────

async function extractText(pdfBytes) {
  const doc = await getDocument({ data: pdfBytes, useSystemFonts: true }).promise
  const pages = []

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => item.str)
      .join(' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
    if (pageText) pages.push(pageText)
  }

  return pages
}

// ── Text cleaning ────────────────────────────────────────────────────────────

function cleanPdfText(pages) {
  return pages
    .map((page) =>
      page
        // Remove standalone page numbers
        .replace(/^\d{1,3}$/, '')
        // Remove trailing page numbers at end of page text
        .replace(/\s+\d{1,3}\s*$/, '')
        // Fix hyphenated line breaks
        .replace(/(\w)-\s+(\w)/g, '$1$2')
        .trim(),
    )
    .filter((p) => p.length > 20)
}

// ── Section detection ────────────────────────────────────────────────────────

/**
 * Detect structural sections from PDF text. PDFs don't have markdown headings,
 * so we use heuristics: numbered trends, bold-like patterns, page boundaries,
 * and keyword matching.
 */
function detectSections(pages) {
  const sections = []
  let currentHeading = ''
  let currentContent = []

  for (const page of pages) {
    // Try to detect section headings: "Trend N", "Chapter N", or short
    // capitalized sentences at the start of a page
    const trendMatch = page.match(/^(Trend \d+)\s+(.+?)(?:\s{2,}|$)/)
    const headingPatterns = [
      /^(Foreword[:\s].{0,80})/,
      /^(Executive Summary[:\s].{0,80})/,
      /^(Introduction[:\s].{0,80})/,
      /^(Conclusion[:\s].{0,80})/,
      /^(Priorities for.{0,80})/,
      /^(Foundation trends[:\s].{0,80})/i,
      /^(Capability trends[:\s].{0,80})/i,
      /^(Impact trends[:\s].{0,80})/i,
      /^(Summary[:\s].{0,80})/,
      /^(Recommendations?[:\s].{0,80})/,
      /^(Key Findings?[:\s].{0,80})/,
    ]

    let detectedHeading = null

    if (trendMatch) {
      detectedHeading = `${trendMatch[1]} ${trendMatch[2].split(/\.\s/)[0]}`
    } else {
      for (const pat of headingPatterns) {
        const m = page.match(pat)
        if (m) {
          detectedHeading = m[1].trim()
          break
        }
      }
    }

    if (detectedHeading) {
      if (currentHeading || currentContent.length > 0) {
        sections.push({
          heading: currentHeading,
          content: currentContent.join('\n\n').trim(),
        })
      }
      currentHeading = detectedHeading
      const rest = page.replace(detectedHeading, '').trim()
      currentContent = rest ? [rest] : []
    } else {
      currentContent.push(page)
    }
  }

  if (currentHeading || currentContent.length > 0) {
    sections.push({
      heading: currentHeading,
      content: currentContent.join('\n\n').trim(),
    })
  }

  return sections
}

/**
 * Extract paragraphs from PDF text. Unlike markdown, PDF text is often one
 * continuous string per page, so we split on sentence boundaries when there
 * are no double-newlines.
 */
function extractPdfParagraphs(text) {
  // First try the standard markdown-style extraction
  const mdParas = extractParagraphs(text)
  if (mdParas.length >= 2) return mdParas

  // Fall back to sentence-based splitting for dense PDF text
  return text
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40 && s.length < 500)
    .map((s) =>
      s
        .replace(/\*\*/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim(),
    )
}

// ── Content mapping ──────────────────────────────────────────────────────────

function extractTitleAndSubtitle(pages) {
  const firstPage = pages[0] || ''

  // Strategy: the first page often has "Title Subtitle Contents..."
  // Try splitting on known structural words
  const contentsBoundary = firstPage.search(/\bContents\b|\bTable of Contents\b/i)
  const usable = contentsBoundary > 0 ? firstPage.slice(0, contentsBoundary).trim() : firstPage.slice(0, 300)

  // Split on double-space or sentence boundaries
  const parts = usable.split(/\s{2,}/).filter((p) => p.length > 3)

  let title = parts[0] || 'Untitled'
  let subtitle = parts.slice(1).join(' — ').trim()

  // If title still contains subtitle-like text ("How..." pattern), split it
  const howMatch = title.match(/^(.+?)\s+(How\s.+)$/i)
  const forMatch = title.match(/^(.+?)\s+(A\s.+|For\s.+|An?\s.+)$/i)
  if (howMatch) {
    title = howMatch[1].trim()
    subtitle = howMatch[2].trim()
  } else if (forMatch && !subtitle) {
    title = forMatch[1].trim()
    subtitle = forMatch[2].trim()
  }

  return { title: title.slice(0, 120), subtitle: subtitle.slice(0, 200) }
}

function mapToPresentation(pages, sections) {
  const { title, subtitle } = extractTitleAndSubtitle(pages)
  const fullText = pages.join('\n\n')

  // Classify sections by purpose
  const contextSections = sections.filter(
    (s) => /foreword|introduction|executive|overview|context|background/i.test(s.heading),
  )
  const problemSections = sections.filter(
    (s) =>
      /problem|challenge|issue|why|gap|current state|changes dramatically|tectonic/i.test(s.heading) ||
      /problem|challenge/i.test(s.content.slice(0, 200)),
  )
  const riskSections = sections.filter(
    (s) => /risk|security|threat|dual.?use|concern/i.test(s.heading),
  )
  const proposalSections = sections.filter(
    (s) => /priorit|recommend|proposal|conclusion|year ahead|next step|action/i.test(s.heading),
  )

  // Everything else becomes observation material
  const skipPattern = /foreword|introduction|executive|overview|context|background|priorit|recommend|conclusion|year ahead|contents/i
  const observationSections = sections.filter(
    (s) => !skipPattern.test(s.heading) && s.content.length > 100,
  )

  // Build context
  const contextParas = contextSections.length > 0
    ? extractPdfParagraphs(contextSections[0].content)
    : extractPdfParagraphs(sections[0]?.content || fullText.slice(0, 2000))
  const contextText = truncate(contextParas.slice(0, 3).join(' '), 500)
    || `This document provides analysis and insights on ${title}.`

  // Build problem
  let problemText
  if (problemSections.length > 0) {
    const pParas = extractPdfParagraphs(problemSections[0].content)
    problemText = truncate(pParas.slice(0, 2).join(' '), 500)
  }
  if (!problemText) {
    // Scan all sections for problem-like content, skip TOC-like text
    for (const s of sections) {
      if (/Contents|Table of Contents/i.test(s.heading)) continue
      const paras = extractPdfParagraphs(s.content)
      const candidate = paras.find(
        (p) =>
          /challenge|problem|issue|gap|current|changing|shift|transform/i.test(p) &&
          !/^Contents\b/.test(p) &&
          !/Trend \d+:/i.test(p),
      )
      if (candidate) { problemText = truncate(candidate, 500); break }
    }
  }
  if (!problemText) {
    problemText = `${title} addresses key challenges and opportunities in its domain.`
  }

  // Build observations from section headings + key content
  const keyPoints = []
  for (const s of observationSections) {
    const paras = extractParagraphs(s.content)
    const bullets = extractBullets(s.content)
    const numbered = extractNumberedItems(s.content)
    const heading = s.heading.replace(/^[\d.\\]+\s*/, '').trim()

    if (heading && s.content.length > 100) {
      // For Trend-style headings, extract just the trend name as the title
      const trendClean = heading.replace(/^Trend \d+\s+/, '')
      const shortTitle = truncate(trendClean, 80) || heading
      const shortContent = paras[0] || bullets[0] || numbered[0] || s.content.slice(0, 200).replace(/\n/g, ' ')
      keyPoints.push(`${shortTitle}: ${shortContent}`)
    }
  }
  // Fill with bullets/paragraphs if not enough
  if (keyPoints.length < 3) {
    const allParas = extractParagraphs(fullText)
    for (const p of allParas) {
      if (!keyPoints.some((kp) => kp.includes(p.slice(0, 50))) && p.length > 40) {
        keyPoints.push(p)
      }
      if (keyPoints.length >= 8) break
    }
  }
  // Truncate key points for cleaner observation titles/bodies
  const uniquePoints = [...new Set(keyPoints)]
    .filter((p) => p.length > 20)
    .slice(0, 8)
    .map((p) => truncate(p, 300))
  const observations = buildObservations(uniquePoints)

  // Build proposal
  let proposalText
  let proposalBullets = []
  if (proposalSections.length > 0) {
    const pSection = proposalSections[0]
    const pParas = extractPdfParagraphs(pSection.content)
    proposalText = truncate(pParas.slice(0, 2).join(' '), 400)
    proposalBullets = [
      ...extractBullets(pSection.content),
      ...extractNumberedItems(pSection.content),
    ].slice(0, 5).map((b) => truncate(b, 120))
  }
  if (!proposalText) {
    proposalText = `Review and apply the insights from ${title} to inform strategic decisions.`
  }

  // Build risks
  let risks = []
  if (riskSections.length > 0) {
    const rBullets = [
      ...extractBullets(riskSections[0].content),
      ...extractNumberedItems(riskSections[0].content),
    ]
    if (rBullets.length >= 2) {
      risks = rBullets.slice(0, 4).map((r) => {
        const colonIdx = r.indexOf(':')
        if (colonIdx > 0 && colonIdx < 60) {
          return { title: r.slice(0, colonIdx).trim(), body: truncate(r.slice(colonIdx + 1).trim(), 200) }
        }
        return { title: truncate(r, 50), body: truncate(r, 200) }
      })
    } else {
      const rParas = extractPdfParagraphs(riskSections[0].content)
      risks = rParas.slice(0, 3).map((p, i) => {
        const sentEnd = p.indexOf('. ')
        if (sentEnd > 10 && sentEnd < 60) {
          return { title: p.slice(0, sentEnd), body: truncate(p.slice(sentEnd + 2), 200) }
        }
        return { title: `Risk ${i + 1}`, body: truncate(p, 200) }
      })
    }
  }
  if (risks.length === 0) {
    risks = [
      { title: 'Adoption pace', body: 'Organizations that delay adoption may fall behind early movers.' },
      { title: 'Implementation complexity', body: 'Applying these insights requires careful planning and change management.' },
    ]
  }

  // Build next steps — look through all proposal sections
  let nextSteps = []
  for (const pSec of proposalSections) {
    const numbered = extractNumberedItems(pSec.content)
    if (numbered.length > 0) {
      nextSteps = numbered.slice(0, 5).map((s, i) => {
        const colonIdx = s.indexOf(':')
        const dashIdx = s.indexOf(' — ')
        const splitIdx = colonIdx > 5 && colonIdx < 60 ? colonIdx : dashIdx > 5 && dashIdx < 60 ? dashIdx : -1
        if (splitIdx > 0) {
          return { label: s.slice(0, splitIdx).trim(), desc: truncate(s.slice(splitIdx + (dashIdx === splitIdx ? 3 : 1)).trim(), 120) }
        }
        return { label: `Step ${i + 1}`, desc: truncate(s, 120) }
      })
      break
    }
  }
  // Also try extracting from the text as "1. keyword" patterns
  if (nextSteps.length === 0) {
    for (const pSec of proposalSections) {
      const sentences = extractPdfParagraphs(pSec.content)
      const actionable = sentences.filter((s) => /\b(master|scale|extend|embed|adopt|implement|plan|review|build|invest)\b/i.test(s))
      if (actionable.length >= 2) {
        nextSteps = actionable.slice(0, 4).map((s, i) => ({
          label: `Priority ${i + 1}`,
          desc: truncate(s, 120),
        }))
        break
      }
    }
  }
  if (nextSteps.length === 0) {
    nextSteps = [
      { label: 'Review findings', desc: 'Assess the key observations against your current strategy.' },
      { label: 'Identify actions', desc: 'Determine which recommendations are most relevant to your context.' },
      { label: 'Plan implementation', desc: 'Develop a roadmap to apply the insights from this report.' },
    ]
  }

  const closerQuote = truncate(
    extractParagraphs(fullText.slice(-2000)).pop()
      || `${title} — essential reading for informed decision-making.`,
    200,
  )

  return {
    title,
    subtitle: subtitle || `Key insights from ${title}`,
    author: authorOverride || 'Datacom',
    date: dateOverride || formatDate(new Date().toISOString()),
    source: urlFlag || '',
    context: contextText,
    problem: problemText,
    observations,
    proposal: proposalText,
    proposalBullets,
    risks,
    nextSteps,
    closerQuote,
    closerBody: `For the full analysis, refer to the original document.`,
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const pdfBytes = await loadPdfBytes()
  console.log(`Extracting text from PDF (${(pdfBytes.length / 1024).toFixed(0)} KB)...`)

  const rawPages = await extractText(pdfBytes)
  console.log(`  ${rawPages.length} pages extracted`)

  const pages = cleanPdfText(rawPages)
  const sections = detectSections(pages)
  console.log(`  ${sections.length} sections detected`)

  for (const s of sections) {
    console.log(`    ${s.heading || '(untitled)'}  (${s.content.length} chars)`)
  }

  const mapped = mapToPresentation(pages, sections)
  const markdown = generatePresentation(mapped)

  fs.mkdirSync(outputDir, { recursive: true })
  const slug = slugify(mapped.title || 'untitled')
  const outputPath = path.join(outputDir, `${slug}.md`)
  fs.writeFileSync(outputPath, markdown, 'utf-8')

  console.log(`\nPresentation saved: ${outputPath}`)
  console.log(`  Title: ${mapped.title}`)
  console.log(`  Observations: ${mapped.observations.length}`)
  console.log(`  Slug: ${slug}`)
}

main().catch((err) => {
  console.error('Error:', err.message || err)
  process.exit(1)
})
