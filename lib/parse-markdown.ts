import type { Report } from "@/content/types";

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
  const observations: { number: number; title: string; body: string; note: string }[] = [];
  let proposalHeading = "";
  let proposalBody: string[] = [];
  let proposalBullets: string[] = [];
  let proposalSummary = "";
  const risks: { title: string; body: string }[] = [];
  const nextSteps: { step: number; label: string; description: string }[] = [];
  let closerObservation = "";
  let closerBody: string[] = [];
  let closerUrl = "";

  type Section =
    | "none"
    | "context"
    | "problem"
    | "observations"
    | "proposal"
    | "risks"
    | "nextsteps"
    | "closer";

  let currentSection: Section = "none";
  let obsIndex = -1;
  let riskIndex = -1;
  let stepIndex = -1;
  let inProposalBullets = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

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

    // Section headers
    if (/^## 🎯/.test(trimmed) || /^## .*[Cc]ontext/.test(trimmed)) {
      currentSection = "context";
      continue;
    }
    if (/^## 🔍/.test(trimmed) || /^## .*[Pp]roblem/.test(trimmed)) {
      currentSection = "problem";
      continue;
    }
    if (/^## 📋/.test(trimmed) || /^## .*[Oo]bservation/.test(trimmed)) {
      currentSection = "observations";
      obsIndex = -1;
      continue;
    }
    if (/^## 💡/.test(trimmed) || /^## .*[Pp]roposal/.test(trimmed)) {
      currentSection = "proposal";
      inProposalBullets = false;
      continue;
    }
    if (/^## ⚠️/.test(trimmed) || /^## .*[Rr]isk/.test(trimmed)) {
      currentSection = "risks";
      riskIndex = -1;
      continue;
    }
    if (/^## ✅/.test(trimmed) || /^## .*[Nn]ext.?[Ss]tep/.test(trimmed)) {
      currentSection = "nextsteps";
      stepIndex = -1;
      continue;
    }
    if (/^## 🔑/.test(trimmed) || /^## .*[Cc]los/.test(trimmed)) {
      currentSection = "closer";
      continue;
    }

    if (!trimmed) continue;

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

  return {
    title: title || "Untitled Presentation",
    subtitle: subtitle || "",
    date: date || "2026",
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
      body: contextBody.join(" ").trim(),
    },
    problem: {
      heading: problemHeading || "Problem",
      body: problemBody.join(" ").trim(),
    },
    observations:
      observations.length > 0
        ? observations
        : [{ number: 1, title: "No observations found", body: "", note: "" }],
    proposal: {
      heading: proposalHeading || "Proposal",
      body: proposalBody.join(" ").trim(),
      bullets: proposalBullets,
      summary: proposalSummary,
    },
    risks: risks.length > 0 ? risks : [{ title: "No risks identified", body: "" }],
    nextSteps:
      nextSteps.length > 0
        ? nextSteps
        : [{ step: 1, label: "Review document", description: "" }],
    closer: {
      observation: closerObservation || title,
      body: closerBody.join(" ").trim(),
      reportUrl: closerUrl || source || "#",
    },
  };
}

function stripBold(s: string): string {
  return s.replace(/\*\*/g, "");
}

function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*/g, "")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\d+\.\s+/, "")
    .trim();
}
