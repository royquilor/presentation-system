import type { Report, FlexSection, SlideStyle, SlideBackground, SlideMedia } from "@/content/types";

type StyleDirective =
  | { key: "background"; value: SlideBackground }
  | { key: "textColor" | "labelColor"; value: string }
  | { key: "mediaPosition"; value: string };

function parseStyleComment(line: string): StyleDirective | null {
  const match = line.match(/^<!--\s*(bg|text|label|media-position):\s*(.+?)\s*-->$/);
  if (!match) return null;
  const [, directive, raw] = match;
  const val = raw.trim();

  if (directive === "bg") {
    if (val.startsWith("solid ")) {
      return { key: "background", value: { type: "solid", color: val.slice(6).trim() } };
    }
    if (val.startsWith("gradient ")) {
      const parts = val.slice(9).trim().split(/\s+/);
      return { key: "background", value: { type: "gradient", from: parts[0], to: parts[1], direction: parts[2] || "135deg" } };
    }
    if (val.startsWith("image ")) {
      const parts = val.slice(6).trim().split(/\s+/);
      return { key: "background", value: { type: "image", src: parts[0], overlay: parts[1] } };
    }
  }
  if (directive === "text") return { key: "textColor", value: val };
  if (directive === "label") return { key: "labelColor", value: val };
  if (directive === "media-position") return { key: "mediaPosition", value: val };
  return null;
}

function parseImageLine(line: string): SlideMedia | null {
  const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (!match) return null;
  return { src: match[2], alt: match[1] || undefined };
}

function mergeStyle(existing: SlideStyle | undefined, key: string, value: unknown): SlideStyle {
  return { ...(existing || {}), [key]: value };
}

export function parseMarkdownToReport(md: string): Report {
  const lines = md.split("\n");
  let title = "";
  let subtitle = "";
  let date = "";
  let source = "";
  let authorName = "";
  let authorUrl = "";
  let contextHeading = "";
  let contextBody: string[] = [];
  let problemHeading = "";
  let problemBody: string[] = [];
  const observations: { number: number; title: string; body: string; note: string; style?: SlideStyle }[] = [];
  let proposalHeading = "";
  let proposalBody: string[] = [];
  let proposalBullets: string[] = [];
  let proposalSummary = "";
  const risks: { title: string; body: string }[] = [];
  const nextSteps: { step: number; label: string; description: string }[] = [];
  let closerObservation = "";
  let closerBody: string[] = [];
  let closerUrl = "";
  const flexSections: FlexSection[] = [];
  let currentFlex: FlexSection | null = null;
  let flexItemIndex = -1;

  const sectionStyles: Partial<Record<string, SlideStyle>> = {};

  type Section =
    | "none"
    | "context"
    | "problem"
    | "observations"
    | "proposal"
    | "risks"
    | "nextsteps"
    | "closer"
    | "flex";

  let currentSection: Section = "none";
  let obsIndex = -1;
  let riskIndex = -1;
  let stepIndex = -1;
  let inProposalBullets = false;
  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockLines: string[] = [];

  function pushCodeBlock(block: string) {
    switch (currentSection) {
      case "context":
        contextBody.push(block);
        break;
      case "problem":
        problemBody.push(block);
        break;
      case "proposal":
        proposalBody.push(block);
        break;
      case "closer":
        closerBody.push(block);
        break;
      case "observations":
        if (obsIndex >= 0) {
          observations[obsIndex].body = observations[obsIndex].body
            ? observations[obsIndex].body + "\n" + block
            : block;
        }
        break;
      case "flex":
        if (currentFlex) {
          if (flexItemIndex >= 0) {
            const item = currentFlex.items[flexItemIndex];
            item.body = item.body ? item.body + "\n" + block : block;
          } else {
            currentFlex.body = currentFlex.body
              ? currentFlex.body + "\n" + block
              : block;
          }
        }
        break;
      case "risks":
        if (riskIndex >= 0) {
          risks[riskIndex].body += (risks[riskIndex].body ? "\n" : "") + block;
        }
        break;
      case "nextsteps":
        if (stepIndex >= 0) {
          nextSteps[stepIndex].description +=
            (nextSteps[stepIndex].description ? "\n" : "") + block;
        }
        break;
    }
  }

  function finalizeFlex() {
    if (currentFlex) {
      flexSections.push(currentFlex);
      currentFlex = null;
      flexItemIndex = -1;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code fence handling — must be first to prevent code content from being parsed as sections
    if (trimmed.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
        codeBlockLines = [];
      } else {
        inCodeBlock = false;
        const block = "```" + codeBlockLang + "\n" + codeBlockLines.join("\n") + "\n```";
        pushCodeBlock(block);
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    if (trimmed === "---") continue;

    // Title
    if (/^# /.test(trimmed) && !title) {
      title = trimmed.replace(/^# /, "");
      continue;
    }

    // Subtitle (blockquote after title)
    if (/^> /.test(trimmed) && title && !subtitle && currentSection === "none") {
      subtitle = trimmed.replace(/^> /, "");
      continue;
    }

    // Date
    if (/^\*\*Date:\*\*/.test(trimmed)) {
      date = trimmed.replace(/^\*\*Date:\*\*\s*/, "");
      continue;
    }
    // Source
    if (/^\*\*Source:\*\*/.test(trimmed)) {
      source = trimmed.replace(/^\*\*Source:\*\*\s*/, "");
      continue;
    }
    // Author (supports markdown link: [Name](url))
    if (/^\*\*Author:\*\*/.test(trimmed)) {
      const raw = trimmed.replace(/^\*\*Author:\*\*\s*/, "");
      const linkMatch = raw.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        authorName = linkMatch[1];
        authorUrl = linkMatch[2];
      } else {
        authorName = raw;
      }
      continue;
    }

    // Section headers — known types first
    // Emoji regexes require the expected keyword after the emoji to prevent
    // false matches (e.g. "## ✅ Verification" must NOT match nextsteps).
    if (/^## 🎯\s*[Cc]ontext/.test(trimmed) || /^## .*[Cc]ontext/.test(trimmed)) {
      finalizeFlex();
      currentSection = "context";
      continue;
    }
    if (/^## 🔍\s*[Pp]roblem/.test(trimmed) || /^## .*[Pp]roblem/.test(trimmed)) {
      finalizeFlex();
      currentSection = "problem";
      continue;
    }
    if (/^## 📋\s*[Oo]bserv/.test(trimmed) || /^## .*[Oo]bservation/.test(trimmed)) {
      finalizeFlex();
      currentSection = "observations";
      if (observations.length === 0) obsIndex = -1;
      continue;
    }
    if (/^## 💡\s*[Pp]roposal/.test(trimmed) || /^## .*[Pp]roposal/.test(trimmed)) {
      finalizeFlex();
      currentSection = "proposal";
      inProposalBullets = false;
      continue;
    }
    if (/^## ⚠️\s*[Rr]isk/.test(trimmed) || /^## .*[Rr]isk/.test(trimmed)) {
      finalizeFlex();
      currentSection = "risks";
      if (risks.length === 0) riskIndex = -1;
      continue;
    }
    if (/^## ✅\s*[Nn]ext/.test(trimmed) || /^## .*[Nn]ext.?[Ss]tep/.test(trimmed)) {
      finalizeFlex();
      currentSection = "nextsteps";
      if (nextSteps.length === 0) stepIndex = -1;
      continue;
    }
    if (/^## 🔑\s*[Cc]los/.test(trimmed) || /^## .*[Cc]los/.test(trimmed)) {
      finalizeFlex();
      currentSection = "closer";
      continue;
    }

    // Catch-all: any other ## heading becomes a flex section
    const flexMatch = trimmed.match(/^## (.+)/);
    if (flexMatch) {
      finalizeFlex();
      const rawHeading = flexMatch[1].trim();
      const emojiMatch = rawHeading.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\uFE0F?\s*(.*)/u);
      currentFlex = {
        emoji: emojiMatch ? emojiMatch[1] : "",
        heading: emojiMatch ? emojiMatch[2].trim() : rawHeading,
        body: "",
        items: [],
      };
      flexItemIndex = -1;
      currentSection = "flex";
      continue;
    }

    if (!trimmed) continue;

    // Style comment directives: <!-- bg: ... -->, <!-- text: ... -->, <!-- label: ... -->
    const styleDirective = parseStyleComment(trimmed);
    if (styleDirective) {
      if (styleDirective.key === "mediaPosition") {
        const pos = styleDirective.value as SlideMedia["position"];
        const applyPos = (s?: SlideStyle) => {
          if (s?.media) s.media.position = pos;
        };
        if (currentSection === "flex" && currentFlex) {
          applyPos(flexItemIndex >= 0 ? currentFlex.items[flexItemIndex].style : currentFlex.style);
        } else if (currentSection === "observations" && obsIndex >= 0) {
          applyPos(observations[obsIndex].style);
        } else {
          applyPos(sectionStyles[currentSection]);
        }
      } else {
        if (currentSection === "flex" && currentFlex) {
          if (flexItemIndex >= 0) {
            currentFlex.items[flexItemIndex].style = mergeStyle(currentFlex.items[flexItemIndex].style, styleDirective.key, styleDirective.value);
          } else {
            currentFlex.style = mergeStyle(currentFlex.style, styleDirective.key, styleDirective.value);
          }
        } else if (currentSection === "observations" && obsIndex >= 0) {
          observations[obsIndex].style = mergeStyle(observations[obsIndex].style, styleDirective.key, styleDirective.value);
        } else {
          sectionStyles[currentSection] = mergeStyle(sectionStyles[currentSection], styleDirective.key, styleDirective.value);
        }
      }
      continue;
    }

    // Image syntax: ![alt](src)
    const imageMedia = parseImageLine(trimmed);
    if (imageMedia) {
      if (currentSection === "flex" && currentFlex) {
        if (flexItemIndex >= 0) {
          currentFlex.items[flexItemIndex].style = mergeStyle(currentFlex.items[flexItemIndex].style, "media", imageMedia);
        } else {
          currentFlex.style = mergeStyle(currentFlex.style, "media", imageMedia);
        }
      } else if (currentSection === "observations" && obsIndex >= 0) {
        observations[obsIndex].style = mergeStyle(observations[obsIndex].style, "media", imageMedia);
      } else {
        sectionStyles[currentSection] = mergeStyle(sectionStyles[currentSection], "media", imageMedia);
      }
      continue;
    }

    switch (currentSection) {
      case "context":
        if (!contextHeading && trimmed.length > 0) {
          contextHeading = stripBold(trimmed);
        } else {
          contextBody.push(stripMarkdown(trimmed));
        }
        break;

      case "problem":
        if (!problemHeading && trimmed.length > 0) {
          problemHeading = stripBold(trimmed);
        } else {
          problemBody.push(stripMarkdown(trimmed));
        }
        break;

      case "observations":
        if (/^\*\*\d+\./.test(trimmed)) {
          obsIndex++;
          const obsTitle = trimmed
            .replace(/^\*\*\d+\.\s*/, "")
            .replace(/\*\*$/, "")
            .replace(/\*\*/g, "");
          observations.push({
            number: obsIndex + 1,
            title: obsTitle,
            body: "",
            note: "",
          });
        } else if (obsIndex >= 0) {
          const text = stripMarkdown(trimmed);
          if (!observations[obsIndex].body) {
            observations[obsIndex].body = text;
          } else {
            observations[obsIndex].body += "\n" + text;
          }
        }
        break;

      case "proposal":
        if (!proposalHeading && trimmed.length > 0 && !trimmed.startsWith("-") && !trimmed.startsWith("*")) {
          proposalHeading = stripBold(trimmed);
        } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          inProposalBullets = true;
          proposalBullets.push(stripMarkdown(trimmed.replace(/^[-*]\s+/, "")));
        } else if (trimmed.startsWith("*") && trimmed.endsWith("*")) {
          proposalSummary = trimmed.replace(/^\*+/, "").replace(/\*+$/, "");
        } else if (inProposalBullets && !trimmed.startsWith("-") && !trimmed.startsWith("*")) {
          inProposalBullets = false;
          proposalSummary = stripMarkdown(trimmed);
        } else {
          proposalBody.push(stripMarkdown(trimmed));
        }
        break;

      case "risks":
        if (/^\*\*/.test(trimmed) || /^- \*\*/.test(trimmed)) {
          riskIndex++;
          const rTitle = trimmed
            .replace(/^- /, "")
            .replace(/^\*\*/, "")
            .replace(/\*\*.*$/, "")
            .replace(/:$/, "");
          const rBody = trimmed
            .replace(/^.*?\*\*[^*]*\*\*:?\s*/, "")
            .replace(/^\*\*[^*]+\*\*\s*/, "");
          risks.push({ title: rTitle, body: stripMarkdown(rBody || "") });
        } else if (riskIndex >= 0 && trimmed) {
          risks[riskIndex].body += (risks[riskIndex].body ? " " : "") + stripMarkdown(trimmed);
        }
        break;

      case "nextsteps":
        if (/^\d+\.\s+\*\*/.test(trimmed)) {
          stepIndex++;
          const stepMatch = trimmed.match(/^\d+\.\s+\*\*([^*]+)\*\*\s*[—–-]?\s*(.*)/);
          if (stepMatch) {
            nextSteps.push({
              step: stepIndex + 1,
              label: stepMatch[1].trim(),
              description: stripMarkdown(stepMatch[2] || ""),
            });
          }
        } else if (stepIndex >= 0 && trimmed) {
          nextSteps[stepIndex].description +=
            (nextSteps[stepIndex].description ? " " : "") + stripMarkdown(trimmed);
        }
        break;

      case "flex":
        if (currentFlex) {
          if (/^\*\*\d+\./.test(trimmed)) {
            flexItemIndex++;
            const itemTitle = trimmed
              .replace(/^\*\*\d+\.\s*/, "")
              .replace(/\*\*$/, "")
              .replace(/\*\*/g, "");
            currentFlex.items.push({
              number: flexItemIndex + 1,
              title: itemTitle,
              body: "",
            });
          } else if (flexItemIndex >= 0) {
            const text = stripMarkdown(trimmed);
            const item = currentFlex.items[flexItemIndex];
            item.body = item.body ? item.body + "\n" + text : text;
          } else {
            const text = stripMarkdown(trimmed);
            currentFlex.body = currentFlex.body ? currentFlex.body + "\n" + text : text;
          }
        }
        break;

      case "closer":
        if (/^> /.test(trimmed)) {
          closerObservation = trimmed.replace(/^> /, "");
        } else if (/^http/.test(trimmed)) {
          closerUrl = trimmed;
        } else {
          closerBody.push(stripMarkdown(trimmed));
        }
        break;
    }
  }

  finalizeFlex();

  // Apply section-level observation style to all observations without their own style
  if (sectionStyles.observations) {
    for (const obs of observations) {
      if (!obs.style) obs.style = sectionStyles.observations;
    }
  }

  return {
    title: title || "Untitled Presentation",
    subtitle: subtitle || "",
    date: date || "2026",
    titleStyle: sectionStyles.none,
    author: {
      name: authorName || "Datacom",
      avatarUrl: authorUrl,
      initials: (authorName || "D")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    },
    context: {
      heading: contextHeading || "Context",
      body: contextBody.join("\n").trim(),
      style: sectionStyles.context,
    },
    problem: {
      heading: problemHeading || "Problem",
      body: problemBody.join("\n").trim(),
      style: sectionStyles.problem,
    },
    observations:
      observations.length > 0
        ? observations
        : [{ number: 1, title: "No observations found", body: "", note: "" }],
    proposal: {
      heading: proposalHeading || "Proposal",
      body: proposalBody.join("\n").trim(),
      bullets: proposalBullets,
      summary: proposalSummary,
      style: sectionStyles.proposal,
    },
    risks: risks.length > 0 ? risks : [{ title: "No risks identified", body: "" }],
    risksStyle: sectionStyles.risks,
    nextSteps:
      nextSteps.length > 0
        ? nextSteps
        : [{ step: 1, label: "Review document", description: "" }],
    nextStepsStyle: sectionStyles.nextsteps,
    flexSections: flexSections.length > 0 ? flexSections : undefined,
    closer: {
      observation: closerObservation || title,
      body: closerBody.join("\n").trim(),
      reportUrl: closerUrl || source || "#",
      style: sectionStyles.closer,
    },
  };
}

function stripBold(s: string): string {
  return s.replace(/\*\*/g, "");
}

function stripMarkdown(s: string): string {
  return s
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/^\d+\.\s+/, "")
    .trim();
}
