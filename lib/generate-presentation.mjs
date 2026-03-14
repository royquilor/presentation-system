/**
 * Shared helpers for generating presentation-format markdown.
 *
 * Used by:
 *   - scripts/convert-confluence-to-presentations.mjs (Confluence → presentation)
 *   - scripts/pdf-to-presentation.mjs (PDF → presentation)
 */

export function cleanBody(body) {
  return body
    .replace(
      /\[data-colorid=[^\]]*\]\{[^}]*\}\s*html\[data-color-mode=dark\]\s*\[data-colorid=[^\]]*\]\{[^}]*\}/g,
      '',
    )
    .replace(/\[data-colorid=[^\]]*\]\{[^}]*\}/g, '')
    .replace(
      /!\[.*?\]\(https:\/\/datacomgroup\.atlassian\.net\/wiki\/plugins\/servlet\/confluence\/placeholder\/error[^)]*\)/g,
      '',
    )
    .replace(
      /!\[.*?\]\(https:\/\/datacomgroup\.atlassian\.net\/wiki\/download\/thumbnails[^)]*\)/g,
      '',
    )
    .replace(/\\u[A-Fa-f0-9]{4}/g, '')
    .replace(/`\d+`/g, '')
    .replace(/\\\./g, '.')
    .replace(/\\-/g, '-')
    .replace(/\\(\d)/g, '$1')
    .replace(/\u200B/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function slugify(text) {
  return text
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function formatDate(isoDate) {
  if (!isoDate) return '2026'
  try {
    const d = new Date(isoDate)
    return d.toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return '2026'
  }
}

export function splitSections(body) {
  const sections = []
  const lines = body.split('\n')
  let currentHeading = ''
  let currentContent = []

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)/)
    if (headingMatch) {
      if (currentHeading || currentContent.length > 0) {
        sections.push({
          heading: currentHeading,
          content: currentContent.join('\n').trim(),
        })
      }
      currentHeading = headingMatch[1].replace(/^[\\\s]*/, '').trim()
      currentContent = []
    } else {
      currentContent.push(line)
    }
  }
  if (currentHeading || currentContent.length > 0) {
    sections.push({
      heading: currentHeading,
      content: currentContent.join('\n').trim(),
    })
  }
  return sections
}

export function extractBullets(text) {
  const bullets = []
  for (const line of text.split('\n')) {
    const m = line.match(/^\*\s+(.+)/)
    if (!m) {
      const d = line.match(/^-\s+(.+)/)
      if (d) {
        let item = d[1].replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim()
        if (item.length > 10 && item.length < 300) bullets.push(item)
        continue
      }
      continue
    }
    let item = m[1].replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim()
    if (item.length > 10 && item.length < 300) bullets.push(item)
  }
  return bullets
}

export function extractNumberedItems(text) {
  const items = []
  for (const line of text.split('\n')) {
    const m = line.match(/^\d+\.\s+(.+)/)
    if (m) {
      let item = m[1].replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim()
      if (item.length > 5 && item.length < 300) items.push(item)
    }
  }
  return items
}

export function extractParagraphs(text) {
  return text
    .split('\n\n')
    .map((p) => p.trim())
    .filter(
      (p) =>
        p.length > 30 &&
        !p.startsWith('*') &&
        !p.startsWith('-') &&
        !p.startsWith('#') &&
        !p.startsWith('|') &&
        !p.startsWith('!') &&
        !p.startsWith('[data-') &&
        !p.match(/^https?:\/\//) &&
        !p.match(/^\*\*[A-Z].*\*\*$/),
    )
    .map((p) =>
      p
        .replace(/\*\*/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\n/g, ' ')
        .trim(),
    )
}

export function truncate(text, max) {
  if (!text || text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '...'
}

export function cleanObsTitle(text) {
  return text
    .replace(/^\.\s*/, '')
    .replace(/^[\d.\\]+\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function buildObservations(keyPoints, maxObs = 8) {
  const obs = []
  const seen = new Set()
  const points = keyPoints.slice(0, maxObs + 2)

  for (const raw of points) {
    if (obs.length >= maxObs) break
    let text = cleanObsTitle(raw)
    if (text.length < 15) continue

    const sig = text.slice(0, 50).toLowerCase()
    if (seen.has(sig)) continue
    seen.add(sig)

    let title = text
    let body = ''

    const colonIdx = text.indexOf(': ')
    if (colonIdx > 0 && colonIdx < 80) {
      title = text.slice(0, colonIdx)
      body = text.slice(colonIdx + 2)
    } else if (text.length > 80) {
      const splitAt = text.indexOf('. ', 20)
      if (splitAt > 0 && splitAt < 120) {
        title = text.slice(0, splitAt + 1)
        body = text.slice(splitAt + 2)
      } else {
        title = text.slice(0, 80).replace(/\s+\S*$/, '')
        body = text
      }
    }

    obs.push({ number: obs.length + 1, title, body })
  }

  if (obs.length === 0) {
    obs.push({
      number: 1,
      title: 'Document overview',
      body: 'Key details are outlined in the source document.',
    })
  }

  return obs
}

export function generatePresentation({
  title,
  subtitle,
  author,
  date,
  source,
  context,
  problem,
  observations,
  proposal,
  proposalBullets,
  risks,
  nextSteps,
  closerQuote,
  closerBody,
}) {
  let md = `# ${title}\n> ${subtitle}\n\n`
  md += `**Author:** ${author}\n`
  md += `**Date:** ${date}\n`
  if (source) md += `**Source:** ${source}\n`
  md += `\n---\n\n`

  md += `## 🎯 Context\n\n${context}\n\n---\n\n`
  md += `## 🔍 Problem\n\n${problem}\n\n---\n\n`

  md += `## 📋 Observations\n\n`
  for (const obs of observations) {
    md += `**${obs.number}. ${obs.title}**\n`
    if (obs.body) md += `${obs.body}\n`
    md += `\n`
  }
  md += `---\n\n`

  md += `## 💡 Proposal\n\n${proposal}\n\n`
  if (proposalBullets && proposalBullets.length > 0) {
    for (const b of proposalBullets) {
      md += `- ${b}\n`
    }
    md += `\n`
  }
  md += `---\n\n`

  md += `## ⚠️ Risks\n\n`
  for (const r of risks) {
    md += `- **${r.title}:** ${r.body}\n`
  }
  md += `\n---\n\n`

  md += `## ✅ Next Steps\n\n`
  for (let i = 0; i < nextSteps.length; i++) {
    md += `${i + 1}. **${nextSteps[i].label}** — ${nextSteps[i].desc}\n`
  }
  md += `\n---\n\n`

  md += `## 🔑 Close\n\n`
  md += `> ${closerQuote}\n\n`
  md += `${closerBody}\n`
  if (source) md += `${source}\n`

  return md
}

export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { metadata: {}, body: content }
  const metadata = {}
  match[1].split('\n').forEach((line) => {
    const idx = line.indexOf(':')
    if (idx > 0) {
      const key = line.slice(0, idx).trim()
      const val = line
        .slice(idx + 1)
        .trim()
        .replace(/^"(.*)"$/, '$1')
      metadata[key] = val
    }
  })
  return { metadata, body: match[2] }
}
