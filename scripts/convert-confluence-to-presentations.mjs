import fs from "fs";
import path from "path";
import {
  parseFrontmatter,
  cleanBody,
  slugify,
  formatDate,
  splitSections,
  extractBullets,
  extractNumberedItems,
  extractParagraphs,
  truncate,
  buildObservations,
  generatePresentation,
} from "../lib/generate-presentation.mjs";

const SOURCE_DIR =
  "/Users/ben/Desktop/cursor-jira-confluence-sync/cursor-jira-sync/workspace/confluence-gittsp/Group IT Transition to ServiceNow - Project";
const OUTPUT_DIR = path.join(
  import.meta.dirname,
  "..",
  "content",
  "servicenow-presentations"
);

// --- remaining functions below are script-specific converters ---

function categoriseFile(filename) {
  const lower = filename.toLowerCase();
  if (/status (report|update)/i.test(lower)) return "status";
  if (/steering committee/i.test(lower)) return "steering";
  if (/meeting notes/i.test(lower)) return "meeting";
  if (/template/i.test(lower)) return "template";
  return "document";
}

// cleanObsTitle, buildObservations imported from lib/generate-presentation.mjs

function convertStatusReport(metadata, body, sections) {
  const title = metadata.title || "Status Report";
  const dateStr = formatDate(metadata.updated);
  const author = metadata.author || "Datacom Group IT";
  const url = metadata.url || "";

  const allBullets = [];
  const allParagraphs = [];
  for (const s of sections) {
    allBullets.push(...extractBullets(s.content));
    allParagraphs.push(...extractParagraphs(s.content));
  }

  let healthStatus = "GREEN";
  const healthMatch = body.match(/(GREEN|AMBER|RED)/i);
  if (healthMatch) healthStatus = healthMatch[1].toUpperCase();

  const contextLine = `Weekly status update for the Group IT Transition to ServiceNow project. Project health is rated ${healthStatus}. This report covers key accomplishments, in-progress work, and upcoming focus areas for the project team.`;

  const problemLine =
    allParagraphs.find(
      (p) =>
        p.toLowerCase().includes("risk") ||
        p.toLowerCase().includes("block") ||
        p.toLowerCase().includes("issue") ||
        p.toLowerCase().includes("pain point")
    ) ||
    "Transitioning Datacom's Corporate Group IT from legacy Cherwell to ServiceNow requires coordinated effort across discovery, configuration, change management, and stakeholder alignment to meet delivery milestones.";

  const keyPoints =
    allBullets.length >= 3
      ? allBullets
      : allParagraphs.length >= 3
        ? allParagraphs
        : [
            "Discovery and planning activities continue across workstreams.",
            "Stakeholder engagement is progressing through scheduled sessions.",
            "Change management and communications planning is underway.",
          ];

  const obs = buildObservations(keyPoints);

  return generatePresentation({
    title,
    subtitle: `Project status update — ${dateStr}`,
    author,
    date: dateStr,
    source: url,
    context: contextLine,
    problem: problemLine,
    observations: obs,
    proposal:
      "Continue delivery on current sprint priorities, address identified blockers, and maintain stakeholder alignment through regular communication.",
    proposalBullets: keyPoints.slice(0, 4).map((b) => (b.length > 100 ? b.slice(0, 100) + "..." : b)),
    risks: [
      {
        title: "Scope clarity",
        body: "Emerging requirements from newly identified teams may expand project scope beyond current planning.",
      },
      {
        title: "Stakeholder availability",
        body: "Key stakeholders and SMEs have limited availability for discovery and validation sessions.",
      },
    ],
    nextSteps: [
      { label: "Sprint delivery", desc: "Complete current sprint commitments on schedule." },
      { label: "Steering committee", desc: "Present status and seek decisions at next steering committee." },
      { label: "Risk management", desc: "Monitor and escalate key risks through governance channels." },
    ],
    closerQuote: `Project remains on track at ${healthStatus} — focused on delivery milestones and stakeholder alignment.`,
    closerBody: "Continued progress depends on sustained collaboration across project workstreams, resolver groups, and leadership sponsors.",
  });
}

function convertSteeringMinutes(metadata, body, sections) {
  const title = metadata.title || "Steering Committee Minutes";
  const dateStr = formatDate(metadata.updated);
  const author = metadata.author || "Datacom Group IT";
  const url = metadata.url || "";

  const allBullets = [];
  const allParagraphs = [];
  for (const s of sections) {
    allBullets.push(...extractBullets(s.content));
    allParagraphs.push(...extractParagraphs(s.content));
  }

  const discussionTopics = sections.filter(
    (s) =>
      s.heading.toLowerCase().includes("discussion") ||
      s.heading.toLowerCase().includes("item") ||
      s.content.includes("Item 1") ||
      s.content.includes("Item 2")
  );

  const actionSection = sections.find(
    (s) =>
      s.heading.toLowerCase().includes("action") ||
      s.content.toLowerCase().includes("action items")
  );

  const keyPoints = [];
  for (const topic of discussionTopics) {
    const paras = extractParagraphs(topic.content);
    const bullets = extractBullets(topic.content);
    keyPoints.push(...paras.slice(0, 3), ...bullets.slice(0, 3));
  }
  if (keyPoints.length < 3) {
    keyPoints.push(...allParagraphs.slice(0, 5), ...allBullets.slice(0, 5));
  }

  const uniquePoints = [...new Set(keyPoints)].slice(0, 8);
  const obs = buildObservations(
    uniquePoints.length >= 3
      ? uniquePoints
      : [
          "Steering committee reviewed project status and progress across workstreams.",
          "Key decisions were made on platform direction and process standardisation.",
          "Action items assigned to project leads for follow-up before next meeting.",
        ]
  );

  const actionBullets = actionSection ? extractBullets(actionSection.content) : [];

  const decisionParas = allParagraphs.filter(
    (p) =>
      p.toLowerCase().includes("decision") ||
      p.toLowerCase().includes("agreed") ||
      p.toLowerCase().includes("approved")
  );

  return generatePresentation({
    title,
    subtitle: `Steering committee meeting — ${dateStr}`,
    author,
    date: dateStr,
    source: url,
    context: `Steering committee meeting for the Group IT Transition to ServiceNow project. This session reviewed project status, discussed key topics requiring governance decisions, and assigned action items to project leads.`,
    problem:
      decisionParas[0] ||
      "The ServiceNow transition requires ongoing governance decisions to maintain alignment across workstreams, manage dependencies with the FSD programme, and ensure timely delivery of project milestones.",
    observations: obs,
    proposal:
      decisionParas.length > 1
        ? decisionParas[1]
        : "Maintain current project cadence, execute on agreed actions, and bring outstanding decisions to the next steering committee for resolution.",
    proposalBullets: actionBullets.slice(0, 4).map((b) => (b.length > 120 ? b.slice(0, 120) + "..." : b)),
    risks: [
      {
        title: "Decision velocity",
        body: "Delays in governance decisions can cascade across dependent workstreams and impact delivery timelines.",
      },
      {
        title: "Cross-programme dependencies",
        body: "Alignment with the FSD programme requires coordinated scheduling and shared resource availability.",
      },
    ],
    nextSteps: [
      { label: "Action follow-up", desc: "Complete assigned actions before the next steering committee." },
      { label: "Workstream updates", desc: "Provide progress updates on sprint deliverables." },
      { label: "Escalations", desc: "Raise any blockers or emerging risks through governance." },
    ],
    closerQuote: "Governance alignment is key to maintaining delivery momentum across the ServiceNow transition.",
    closerBody:
      "The steering committee provides the decision-making forum to unblock workstreams and maintain strategic alignment for the project.",
  });
}

function convertDocument(metadata, body, sections) {
  const title = metadata.title || "Untitled Document";
  const dateStr = formatDate(metadata.updated);
  const author = metadata.author || "Datacom Group IT";
  const url = metadata.url || "";

  const allBullets = [];
  const allParagraphs = [];
  const allNumbered = [];
  for (const s of sections) {
    allBullets.push(...extractBullets(s.content));
    allParagraphs.push(...extractParagraphs(s.content));
    allNumbered.push(...extractNumberedItems(s.content));
  }

  const contextSections = sections.filter(
    (s) =>
      /purpose|overview|executive|summary|background|introduction|objective|definition/i.test(s.heading) ||
      /purpose|overview|executive|summary|background|objective/i.test(s.content.slice(0, 200))
  );
  const contextParas = contextSections.length > 0
    ? extractParagraphs(contextSections[0].content)
    : allParagraphs;
  const contextText = contextParas.slice(0, 2).join(" ");

  const problemSections = sections.filter(
    (s) =>
      /problem|challenge|issue|why|current state|gap|pain|strategic|driver/i.test(s.heading) ||
      /changing|problem|challenge|why.*matter/i.test(s.content.slice(0, 200))
  );

  let problemText;
  if (problemSections.length > 0) {
    problemText = extractParagraphs(problemSections[0].content).slice(0, 2).join(" ");
  } else {
    const usedContextText = contextText;
    const candidateProblem = allParagraphs.find(
      (p) =>
        !usedContextText.includes(p) &&
        (p.toLowerCase().includes("challenge") ||
          p.toLowerCase().includes("problem") ||
          p.toLowerCase().includes("issue") ||
          p.toLowerCase().includes("risk") ||
          p.toLowerCase().includes("gap") ||
          p.toLowerCase().includes("current") ||
          p.toLowerCase().includes("legacy") ||
          p.toLowerCase().includes("cherwell"))
    );
    problemText = candidateProblem ||
      allParagraphs.find((p) => !usedContextText.includes(p) && p.length > 40) ||
      `This document outlines key aspects of the ${title} for the Group IT ServiceNow transition, addressing requirements, approach, and expected outcomes.`;
  }

  const skipHeadingPattern =
    /purpose|overview|executive|summary|background|contents|abbreviation|related|governance|documentation links|links to existing/i;
  const observationSections = sections.filter(
    (s) => !skipHeadingPattern.test(s.heading) && s.content.length > 50
  );

  const keyPoints = [];
  for (const s of observationSections) {
    const bullets = extractBullets(s.content);
    const paras = extractParagraphs(s.content);
    const heading = s.heading
      .replace(/^[\d.\\]+\s*/, "")
      .replace(/\*\*/g, "")
      .replace(/^#+\s*/, "")
      .trim();
    if (heading && s.content.length > 50) {
      const shortContent = paras[0] || bullets[0] || s.content.slice(0, 200).replace(/\n/g, " ");
      if (shortContent && shortContent.length > 20) {
        keyPoints.push(`${heading}: ${shortContent}`);
      } else if (bullets.length > 0) {
        keyPoints.push(`${heading}: ${bullets.slice(0, 2).join(". ")}`);
      }
    }
  }
  for (const s of observationSections) {
    const bullets = extractBullets(s.content);
    if (keyPoints.length < 6) {
      for (const b of bullets) {
        if (!keyPoints.some((kp) => kp.includes(b)) && b.length > 20) {
          keyPoints.push(b);
        }
        if (keyPoints.length >= 8) break;
      }
    }
  }
  if (keyPoints.length < 3) {
    keyPoints.push(...allBullets.filter((b) => b.length > 20).slice(0, 6));
  }
  if (keyPoints.length < 3) {
    keyPoints.push(...allParagraphs.slice(0, 6));
  }

  const uniquePoints = [...new Set(keyPoints)].filter((p) => p.length > 20).slice(0, 8);
  const obs = buildObservations(
    uniquePoints.length >= 3
      ? uniquePoints
      : [
          `${title} establishes the framework for this area of the ServiceNow transition.`,
          "Key stakeholders and process owners have been identified for engagement.",
          "Implementation approach aligns with ServiceNow best practices and FSD programme standards.",
        ]
  );

  const proposalSections = sections.filter(
    (s) =>
      /approach|proposal|recommendation|plan|strategy|next|delivery|implementation|phased/i.test(
        s.heading
      )
  );
  const proposalText =
    proposalSections.length > 0
      ? extractParagraphs(proposalSections[0].content).slice(0, 2).join(" ") ||
        extractBullets(proposalSections[0].content).slice(0, 3).join(". ") + "."
      : `Proceed with the ${title.toLowerCase()} as outlined, following ServiceNow best practices and aligning with the broader FSD programme governance.`;

  const proposalBullets =
    proposalSections.length > 0
      ? extractBullets(proposalSections[0].content).slice(0, 4)
      : allBullets.slice(0, 4);

  const riskSections = sections.filter(
    (s) => /risk|issue|depend|concern|constraint|out of scope/i.test(s.heading)
  );
  const riskBullets =
    riskSections.length > 0 ? extractBullets(riskSections[0].content) : [];

  const risks =
    riskBullets.length >= 2
      ? riskBullets.slice(0, 4).map((r) => {
          const colonIdx = r.indexOf(":");
          if (colonIdx > 0 && colonIdx < 60)
            return { title: r.slice(0, colonIdx).trim(), body: r.slice(colonIdx + 1).trim() };
          return {
            title: r.slice(0, 50).replace(/\s+\S*$/, ""),
            body: r,
          };
        })
      : [
          {
            title: "Resource availability",
            body: "Key SMEs and stakeholders have competing priorities that may impact engagement timelines.",
          },
          {
            title: "FSD programme alignment",
            body: "Dependencies on the FSD programme delivery schedule may affect project milestones.",
          },
        ];

  const nextStepSections = sections.filter(
    (s) => /next step|action|timeline|milestone|deadline/i.test(s.heading)
  );
  const nsBullets =
    nextStepSections.length > 0
      ? [
          ...extractBullets(nextStepSections[0].content),
          ...extractNumberedItems(nextStepSections[0].content),
        ]
      : allNumbered.length > 0
        ? allNumbered
        : [];

  const nextSteps =
    nsBullets.length >= 2
      ? nsBullets.slice(0, 5).map((s, i) => ({
          label: `Step ${i + 1}`,
          desc: s.length > 120 ? s.slice(0, 120) + "..." : s,
        }))
      : [
          { label: "Review and validate", desc: "Confirm document contents with key stakeholders." },
          {
            label: "Align with workstreams",
            desc: "Ensure alignment across project delivery streams.",
          },
          { label: "Progress to next phase", desc: "Advance to the next project milestone." },
        ];

  return generatePresentation({
    title,
    subtitle: `Group IT Transition to ServiceNow — ${title}`,
    author,
    date: dateStr,
    source: url,
    context: truncate(contextText, 400) || `${title} is a key artefact supporting the Group IT Transition to ServiceNow project. It provides direction, requirements, and governance for this area of the transition.`,
    problem: truncate(problemText, 400),
    observations: obs,
    proposal: truncate(proposalText, 300),
    proposalBullets: proposalBullets.map((b) => truncate(b, 120)),
    risks,
    nextSteps,
    closerQuote: `${title} — advancing the Group IT ServiceNow transition with clear direction and governance.`,
    closerBody: "This document supports Datacom's strategic move from Cherwell to ServiceNow, enabling modern service management capabilities for Corporate Group IT.",
  });
}

// truncate, generatePresentation imported from lib/generate-presentation.mjs

function processFile(filepath, filename) {
  const content = fs.readFileSync(filepath, "utf-8");
  const maxInputSize = 80000;
  const trimmedContent =
    content.length > maxInputSize ? content.slice(0, maxInputSize) : content;

  const { metadata, body: rawBody } = parseFrontmatter(trimmedContent);
  const body = cleanBody(rawBody);
  const sections = splitSections(body);
  const category = categoriseFile(filename);

  let result;
  switch (category) {
    case "status":
      result = convertStatusReport(metadata, body, sections);
      break;
    case "steering":
      result = convertSteeringMinutes(metadata, body, sections);
      break;
    case "template":
    case "meeting":
      result = convertDocument(metadata, body, sections);
      break;
    default:
      result = convertDocument(metadata, body, sections);
  }

  return result;
}

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (entry.name.endsWith(".md")) {
      results.push({ filepath: fullPath, filename: entry.name });
    }
  }
  return results;
}

const files = walkDir(SOURCE_DIR);

console.log(`Found ${files.length} markdown files to convert\n`);

let success = 0;
let failed = 0;

for (const { filepath, filename } of files) {
  const slug = slugify(filename);
  const outputPath = path.join(OUTPUT_DIR, `gittsp-${slug}.md`);

  try {
    const presentation = processFile(filepath, filename);
    fs.writeFileSync(outputPath, presentation, "utf-8");
    console.log(`  ✓ ${filename} → gittsp-${slug}.md`);
    success++;
  } catch (err) {
    console.error(`  ✗ ${filename}: ${err.message}`);
    failed++;
  }
}

console.log(`\nDone: ${success} converted, ${failed} failed`);
console.log(`Output: ${OUTPUT_DIR}`);
