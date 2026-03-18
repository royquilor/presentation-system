"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Report, SlideStyle, SlideBackground, SlideMedia } from "@/content/types";
import { StudyModeProvider, useStudyMode, KEYBOARD_SHORTCUTS } from "@/components/study-mode-context";
import { CommentsPanel } from "@/components/comments-panel";

class SlideErrorBoundary extends React.Component<
  { children: React.ReactNode; slideId: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; slideId: string }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`Slide "${this.props.slideId}" render error:`, error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-red-500 text-sm font-medium">This slide failed to render.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-xs text-foreground/50 underline hover:text-foreground/70"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

type Section = {
  id: string;
  label: string;
  content: React.ReactNode;
  style?: SlideStyle;
};

function getBackgroundCSS(bg?: SlideBackground): React.CSSProperties {
  if (!bg) return {};
  switch (bg.type) {
    case "solid":
      return { backgroundColor: bg.color };
    case "gradient":
      return {
        background: `linear-gradient(${bg.direction ?? "135deg"}, ${bg.from}, ${bg.to})`,
      };
    case "image":
      return {
        backgroundImage: `${bg.overlay ? `linear-gradient(${bg.overlay}, ${bg.overlay}),` : ""}url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
  }
}

function MediaElement({ media, centered }: { media: SlideMedia; centered?: boolean }) {
  if (centered || media.position === "center") {
    return (
      <div className="flex-1 flex items-center justify-center w-full my-4 md:my-6 min-h-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          alt={media.alt || ""}
          className={`max-w-full max-h-[50vh] object-contain ${media.rounded !== false ? "rounded-lg" : ""}`}
          style={media.width ? { width: media.width } : undefined}
        />
      </div>
    );
  }
  return (
    <div className="mt-6 md:mt-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.src}
        alt={media.alt || ""}
        className={`max-w-full max-h-[40vh] object-contain ${media.rounded !== false ? "rounded-lg" : ""}`}
        style={media.width ? { width: media.width } : undefined}
      />
    </div>
  );
}

const SECTION_WRAPPER = "max-w-2xl w-full";
const SECTION_LABEL =
  "text-sm font-semibold uppercase tracking-widest text-foreground/40 mb-4 text-balance";
const SECTION_HEADING =
  "text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 md:mb-8 leading-tight text-balance";
const SECTION_BODY_BASE =
  "text-foreground/60 text-base md:text-lg leading-relaxed text-balance";

type ContentSegment =
  | { type: "text"; content: string }
  | { type: "code"; content: string; language: string };

function splitIntoSegments(text: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  const lines = text.split("\n");
  let textBuf: string[] = [];
  let inCode = false;
  let codeLang = "";
  let codeBuf: string[] = [];

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      if (!inCode) {
        if (textBuf.length > 0) {
          segments.push({ type: "text", content: textBuf.join("\n") });
          textBuf = [];
        }
        inCode = true;
        codeLang = line.trimStart().slice(3).trim();
        codeBuf = [];
      } else {
        segments.push({ type: "code", content: codeBuf.join("\n"), language: codeLang });
        inCode = false;
        codeLang = "";
        codeBuf = [];
      }
    } else if (inCode) {
      codeBuf.push(line);
    } else {
      textBuf.push(line);
    }
  }

  if (textBuf.length > 0) {
    segments.push({ type: "text", content: textBuf.join("\n") });
  }

  return segments;
}

function autoLinkURLs(text: string, key: number, dimNonBold: boolean): React.ReactNode {
  const urlRegex = /(https?:\/\/[^\s<>)"',]+)/g;
  const urlParts = text.split(urlRegex);
  if (urlParts.length === 1) {
    if (dimNonBold && text.trim()) return <span key={key} className="opacity-30 transition-opacity duration-300">{text}</span>;
    return <span key={key}>{text}</span>;
  }
  return (
    <span key={key}>
      {urlParts.map((seg, j) => {
        if (urlRegex.test(seg)) {
          urlRegex.lastIndex = 0;
          return (
            <a key={j} href={seg} target="_blank" rel="noopener noreferrer"
              className="underline decoration-foreground/30 hover:decoration-foreground/60 transition-colors break-all">
              {seg}
            </a>
          );
        }
        if (dimNonBold && seg.trim()) return <span key={j} className="opacity-30 transition-opacity duration-300">{seg}</span>;
        return seg;
      })}
    </span>
  );
}

function renderInlineMarkup(text: string, dimNonBold = false): React.ReactNode {
  const regex = /(\*\*[^*]+\*\*|==[^=]+=={1,2}|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);
  if (parts.length === 1) {
    return autoLinkURLs(text, 0, dimNonBold);
  }
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("==") && part.endsWith("=="))
      return <mark key={i} className="study-highlight rounded px-0.5">{part.slice(2, -2)}</mark>;
    if (part.startsWith("[") && part.includes("](")) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        return (
          <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer"
            className="underline decoration-foreground/30 hover:decoration-foreground/60 transition-colors">
            {match[1]}
          </a>
        );
      }
    }
    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="px-1.5 py-0.5 rounded bg-foreground/[0.06] font-mono text-[0.85em]">{part.slice(1, -1)}</code>;
    return autoLinkURLs(part, i, dimNonBold);
  });
}

function CodeBlock({ code, language, style }: { code: string; language?: string; style?: React.CSSProperties }) {
  const lines = code.split("\n");
  const gutterWidth = String(lines.length).length;
  return (
    <div className="rounded-lg bg-foreground/[0.04] border border-foreground/10 overflow-clip my-4 text-left" style={style}>
      {language && (
        <div className="px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-foreground/40 border-b border-foreground/10">
          {language}
        </div>
      )}
      <pre className="overflow-x-auto overflow-y-auto max-h-[60vh] p-4 text-[13px] leading-relaxed m-0 scrollbar-thin">
        <code className="font-mono text-foreground/70">
          {lines.map((line, i) => (
            <span key={i} className="block">
              <span
                className="inline-block text-right mr-4 text-foreground/20 select-none text-xs"
                style={{ width: `${Math.max(gutterWidth, 2)}ch` }}
              >
                {i + 1}
              </span>
              {line || " "}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function BodyText({ text, className, style, dimNonBold = false }: { text: string; className?: string; style?: React.CSSProperties; dimNonBold?: boolean }) {
  const segments = splitIntoSegments(text);
  const hasOnlyOneTextSegment = segments.length === 1 && segments[0].type === "text";
  const textLines = hasOnlyOneTextSegment ? segments[0].content.split("\n").filter((l) => l.trim()) : [];

  if (hasOnlyOneTextSegment && textLines.length <= 1) {
    return <p className={className || SECTION_BODY_BASE} style={style}>{renderInlineMarkup(textLines[0] || text, dimNonBold)}</p>;
  }

  return (
    <div className={`space-y-5 ${className || SECTION_BODY_BASE}`} style={style}>
      {segments.map((seg, i) =>
        seg.type === "code" ? (
          <CodeBlock key={i} code={seg.content} language={seg.language} style={style} />
        ) : (
          seg.content.split("\n").filter((l) => l.trim()).map((line, j) => (
            <p key={`${i}-${j}`}>{renderInlineMarkup(line, dimNonBold)}</p>
          ))
        )
      )}
    </div>
  );
}

function SectionContainer({ children, textColor }: { children: React.ReactNode; textColor?: string }) {
  return <div className={SECTION_WRAPPER} style={textColor ? { color: textColor } : undefined}>{children}</div>;
}

function textStyle(s?: SlideStyle, opacity = "99"): React.CSSProperties | undefined {
  return s?.textColor ? { color: `${s.textColor}${opacity}` } : undefined;
}

function labelStyle(s?: SlideStyle): React.CSSProperties | undefined {
  return s?.labelColor ? { color: s.labelColor } : s?.textColor ? { color: `${s.textColor}66` } : undefined;
}

function SectionSlide({
  label,
  heading,
  body,
  bodyClassName,
  style,
  media,
  dimNonBold,
  children,
}: {
  label?: string;
  heading: string;
  body?: string;
  bodyClassName?: string;
  style?: SlideStyle;
  media?: SlideMedia;
  dimNonBold?: boolean;
  children?: React.ReactNode;
}) {
  const isCentered = media?.position === "center";
  return (
    <SectionContainer textColor={style?.textColor}>
      {label && <p className={SECTION_LABEL} style={labelStyle(style)}>{label}</p>}
      <h2 className={SECTION_HEADING} style={textStyle(style, "")}>{heading}</h2>
      {isCentered && media && <MediaElement media={media} centered />}
      {body && <BodyText text={body} className={bodyClassName} style={textStyle(style)} dimNonBold={dimNonBold} />}
      {children}
      {media && !isCentered && <MediaElement media={media} />}
    </SectionContainer>
  );
}

function buildSections(report: Report, dimNonBold = false): Section[] {
  const sections: Section[] = [];

  const ts = report.titleStyle;
  sections.push({
    id: "intro",
    label: "Title",
    style: ts,
    content: (
      <SectionContainer textColor={ts?.textColor}>
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <svg className="h-5 w-auto text-foreground" style={textStyle(ts, "")} viewBox="0 0 121.962 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Datacom">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.0564 0.21891L0.43748 1.26032V22.8676L0 23.583H7.54483C12.7502 23.583 17.1677 18.9856 17.1677 11.2315C17.1677 5.6055 14.5522 0.49189 9.11959 0.21891L0.0564 0.21891ZM4.24219 2.4082H6.73036C10.3114 2.4082 12.9508 4.74701 12.9508 11.1983C12.9508 19.2262 9.90551 20.7542 6.40053 20.7542H4.24219V2.4082ZM41.587 2.35066H46.1771L46.888 2.89927L47.6194 0.222656H32.1136L31.6172 2.92542L32.8297 2.35065H37.2053V22.793L36.8798 23.5543H41.9321L41.587 22.793L41.587 2.35066ZM76.6064 19.7684C75.464 21.2433 74.0738 21.9424 72.499 21.9424C68.5891 21.9424 66.4572 18.2253 66.4572 12.3595C66.4572 7.31446 68.1593 2.06125 72.3726 2.06125C74.0234 2.06125 75.6451 3.1612 76.5876 5.01526H76.9431L76.9379 1.45944C75.464 0.3612 74.0234 0 72.3469 0C66.8135 0 62.2422 3.88385 62.2422 12.8396C62.2422 19.872 66.3547 24 71.7898 24C73.4885 24 75.2922 23.9892 76.8149 22.9252L76.8209 19.5711L76.6064 19.7684ZM97.1166 11.8145C97.0918 6.49545 94.9582 0 87.7219 0C81.4006 0 77.7188 5.12527 77.7188 11.9513C77.7188 19.7396 81.5014 24 87.1126 24C93.3322 24 97.1413 18.5063 97.1166 11.8145M87.5674 2.06055C91.374 2.06055 92.8966 6.73526 92.8966 11.1624C92.8966 16.8579 91.1458 21.9417 87.235 21.9417C83.4284 21.9417 81.9297 17.4065 81.9297 12.9462C81.9297 5.25972 84.0351 2.06056 87.5674 2.06056M109.926 16.8298L103.459 0.210938H99.9405L100.257 0.920777L98.7536 22.5209L98.4922 23.5442H101.206L102.22 8.96052L108.284 23.5442H109.762L115.728 9.07948L116.882 23.5442H121.963L121.688 22.5642L119.767 0.813608L119.944 0.210947H116.531L109.926 16.8298ZM28.3078 16.5741L30.4824 23.5443H35.4151L34.829 22.9219L27.3466 0.222656H23.1025L23.575 1.55967L16.636 22.8922L16.2344 23.5443H19.2703L21.4149 16.575L28.3078 16.5741ZM22.2031 13.8787L24.8494 5.63086L27.5238 13.8787H22.2031ZM55.668 16.5741L57.8418 23.5443H62.7745L62.1901 22.9219L54.7085 0.222656H50.4619L50.9344 1.55967L43.997 22.8922L43.5938 23.5443H46.6305L48.7743 16.575L55.668 16.5741ZM49.5703 13.8787L52.2183 5.63086L54.8919 13.8787H49.5703Z" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-none text-balance" style={textStyle(ts, "")}>
          {report.title}
        </h1>
        {report.subtitle && (
          <p className="text-xl md:text-2xl text-foreground/60 mt-6 leading-snug text-balance" style={textStyle(ts)}>
            {report.subtitle}
          </p>
        )}
        <p className="text-sm font-medium text-foreground/40 mt-8" style={textStyle(ts, "66")}>
          {report.author.avatarUrl ? (
            <a href={report.author.avatarUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-foreground/0 hover:decoration-foreground/40 transition-all duration-200">{report.author.name}</a>
          ) : (
            report.author.name
          )}
          {" — "}{report.date}
        </p>
        {ts?.media && <MediaElement media={ts.media} />}
      </SectionContainer>
    ),
  });

  if (report.context.body) {
    sections.push({
      id: "context",
      label: "Context",
      style: report.context.style,
      content: <SectionSlide label="Context" heading={report.context.heading} body={report.context.body} style={report.context.style} media={report.context.style?.media} dimNonBold={dimNonBold} />,
    });
  }

  if (report.problem.body) {
    sections.push({
      id: "problem",
      label: "Problem",
      style: report.problem.style,
      content: <SectionSlide label="Problem" heading={report.problem.heading} body={report.problem.body} style={report.problem.style} media={report.problem.style?.media} dimNonBold={dimNonBold} />,
    });
  }

  let obsDisplayNum = 0;
  for (let oi = 0; oi < report.observations.length; oi++) {
    const obs = report.observations[oi];
    if (!obs.title || obs.title === "No observations found") continue;
    obsDisplayNum++;
    const os = obs.style;
    sections.push({
      id: `observation-${oi + 1}`,
      label: `Observation ${obsDisplayNum}`,
      style: os,
      content: (
        <SectionSlide label={`Observation ${obsDisplayNum}`} heading={obs.title} body={obs.body} bodyClassName={`${SECTION_BODY_BASE} mb-4 md:mb-5`} style={os} media={os?.media} dimNonBold={dimNonBold}>
          {obs.note && (
            <p className="text-foreground/40 text-sm md:text-base leading-relaxed text-balance" style={textStyle(os, "66")}>
              {obs.note}
            </p>
          )}
        </SectionSlide>
      ),
    });
  }

  if (report.flexSections) {
    for (let fi = 0; fi < report.flexSections.length; fi++) {
      const flex = report.flexSections[fi];
      const label = [flex.emoji, flex.heading].filter(Boolean).join(" ");
      const slugBase = flex.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      if (flex.items.length > 0) {
        for (const item of flex.items) {
          const is = item.style || flex.style;
          sections.push({
            id: `${slugBase}-f${fi}-${item.number}`,
            label: `${label} ${item.number}`,
            style: is,
            content: <SectionSlide label={label} heading={item.title} body={item.body} bodyClassName={`${SECTION_BODY_BASE} mb-4 md:mb-5`} style={is} media={is?.media} dimNonBold={dimNonBold} />,
          });
        }
      } else if (flex.body) {
        sections.push({
          id: `${slugBase}-f${fi}` || `flex-${sections.length}`,
          label,
          style: flex.style,
          content: <SectionSlide label={label} heading={flex.heading} body={flex.body} style={flex.style} media={flex.style?.media} dimNonBold={dimNonBold} />,
        });
      }
    }
  }

  if (report.proposal.body || report.proposal.bullets.length > 0) {
    const prs = report.proposal.style;
    sections.push({
      id: "proposal",
      label: "Proposal",
      style: prs,
      content: (
        <SectionSlide label="Proposal" heading={report.proposal.heading} body={report.proposal.body} bodyClassName={`${SECTION_BODY_BASE} mb-4 md:mb-6`} style={prs} media={prs?.media} dimNonBold={dimNonBold}>
          {report.proposal.bullets.length > 0 && (
            <ul className="list-disc list-inside space-y-4 md:space-y-5 text-foreground/60 text-base md:text-lg mb-6 md:mb-8 text-balance" style={textStyle(prs)}>
              {report.proposal.bullets.map((bullet, i) => (
                <li key={i} className="text-balance">{bullet}</li>
              ))}
            </ul>
          )}
          {report.proposal.summary && (
            <p className="text-foreground/40 text-sm md:text-base text-balance" style={textStyle(prs, "66")}>
              {report.proposal.summary}
            </p>
          )}
        </SectionSlide>
      ),
    });
  }

  if (report.risks.length > 0 && report.risks[0].title !== "No risks identified") {
    const rs = report.risksStyle;
    sections.push({
      id: "risks",
      label: "Risks",
      style: rs,
      content: (
        <SectionSlide label="Risks" heading="What could go wrong" style={rs} media={rs?.media} dimNonBold={dimNonBold}>
          <div className="space-y-5 md:space-y-6">
            {report.risks.map((risk, i) => (
              <div key={i}>
                <p className="text-foreground/80 font-medium mb-1 text-base md:text-lg text-balance" style={textStyle(rs, "cc")}>
                  {risk.title}
                </p>
                <p className="text-foreground/60 text-base leading-relaxed text-balance" style={textStyle(rs)}>
                  {risk.body}
                </p>
              </div>
            ))}
          </div>
        </SectionSlide>
      ),
    });
  }

  if (report.nextSteps.length > 0 && report.nextSteps[0].label !== "Review document") {
    const ns = report.nextStepsStyle;
    sections.push({
      id: "next-steps",
      label: "Next Steps",
      style: ns,
      content: (
        <SectionSlide label="Next Steps" heading="What to do first" style={ns} media={ns?.media} dimNonBold={dimNonBold}>
          <ol className="space-y-4 md:space-y-5 text-foreground/60 text-base md:text-lg text-balance" style={textStyle(ns)}>
            {report.nextSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-balance">
                <span className="font-semibold text-foreground/30 shrink-0" style={textStyle(ns, "4d")}>
                  {step.step}.
                </span>
                <span className="text-balance">
                  <span className="text-foreground/80" style={textStyle(ns, "cc")}>{step.label}</span>
                  {step.description && ` — ${step.description}`}
                </span>
              </li>
            ))}
          </ol>
        </SectionSlide>
      ),
    });
  }

  {
    const cls = report.closer.style;
    sections.push({
      id: "close",
      label: "Close",
      style: cls,
      content: (
        <SectionSlide heading={report.closer.observation} body={report.closer.body} bodyClassName={`${SECTION_BODY_BASE} mb-6 md:mb-8`} style={cls} media={cls?.media} dimNonBold={dimNonBold}>
          {report.closer.reportUrl && report.closer.reportUrl !== "#" && (
            <a
              href={report.closer.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors duration-200 group"
              style={textStyle(cls, "80")}
            >
              <span className="border-b border-foreground/20 group-hover:border-foreground/60 transition-colors duration-200 text-balance">
                Full report
              </span>
              <span className="text-foreground/30 group-hover:text-foreground/60 transition-colors duration-200">
                ↗
              </span>
            </a>
          )}
        </SectionSlide>
      ),
    });
  }

  return sections;
}

function StudyModeToolbar({ slug, hasQuiz }: { slug: string; hasQuiz: boolean }) {
  const { state, toggle, toggleFocus, toggleComments } = useStudyMode();

  return (
    <>
      {/* Study mode toggle — always visible */}
      <button
        onClick={toggle}
        className={`fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 backdrop-blur ${
          state.enabled
            ? "bg-foreground/15 text-foreground shadow-lg"
            : "bg-foreground/[0.06] text-foreground/50 hover:bg-foreground/[0.1] hover:text-foreground/70"
        }`}
        aria-label="Toggle study mode"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <span className="hidden sm:inline">Study</span>
        <kbd className="hidden sm:inline text-[10px] ml-1 px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/40 font-mono">{KEYBOARD_SHORTCUTS.STUDY_MODE.toUpperCase()}</kbd>
      </button>

      {/* Sub-toolbar — appears in study mode */}
      {state.enabled && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full bg-foreground/[0.08] backdrop-blur-lg px-2 py-1.5 shadow-lg border border-foreground/10">
          <ToolbarButton active={state.focusMode} onClick={toggleFocus} label="Focus" shortcut={KEYBOARD_SHORTCUTS.FOCUS.toUpperCase()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </ToolbarButton>
          <ToolbarButton active={state.showComments} onClick={toggleComments} label="Notes" shortcut={KEYBOARD_SHORTCUTS.NOTES.toUpperCase()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </ToolbarButton>
          {hasQuiz && (
            <a
              href={`/p/${slug}/quiz`}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/[0.08] transition-colors"
              aria-label="Open quiz"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              <span>Quiz</span>
              <kbd className="text-[9px] ml-0.5 px-1 py-0.5 rounded bg-foreground/10 text-foreground/30 font-mono">{KEYBOARD_SHORTCUTS.QUIZ.toUpperCase()}</kbd>
            </a>
          )}
        </div>
      )}
    </>
  );
}

function ToolbarButton({ active, onClick, label, shortcut, children }: {
  active: boolean; onClick: () => void; label: string; shortcut: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-foreground/15 text-foreground"
          : "text-foreground/60 hover:text-foreground hover:bg-foreground/[0.08]"
      }`}
      aria-label={label}
    >
      {children}
      <span>{label}</span>
      <kbd className="text-[9px] ml-0.5 px-1 py-0.5 rounded bg-foreground/10 text-foreground/30 font-mono">{shortcut}</kbd>
    </button>
  );
}

function PresentationInner({ report, slug, hasQuiz }: { report: Report; slug: string; hasQuiz: boolean }) {
  const { state } = useStudyMode();
  const dimNonBold = state.enabled && state.focusMode;
  const sections = useMemo(() => buildSections(report, dimNonBold), [report, dimNonBold]);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isProgrammaticScrollRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isProgrammaticScrollRef.current) setActiveIndex(i);
        },
        { root: container, threshold: 0.5 }
      );
      observer.observe(ref);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections.length]);

  const scrollTo = (index: number, behavior: ScrollBehavior = "smooth") => {
    const section = sectionRefs.current[index];
    if (!section) return;
    isProgrammaticScrollRef.current = true;
    section.scrollIntoView({ behavior: behavior === "smooth" ? "smooth" : "instant", block: "start" });
    setTimeout(() => { isProgrammaticScrollRef.current = false; }, 100);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;

      if (e.key.toLowerCase() === KEYBOARD_SHORTCUTS.QUIZ && !e.metaKey && !e.ctrlKey && hasQuiz) {
        window.location.href = `/p/${slug}/quiz`;
        return;
      }

      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) return;
      if (e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        setActiveIndex((prev) => { const next = Math.min(prev + 1, sections.length - 1); scrollTo(next, "instant"); return next; });
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        setActiveIndex((prev) => { const next = Math.max(prev - 1, 0); scrollTo(next, "instant"); return next; });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sections.length, hasQuiz, slug]);

  return (
    <div className={`flex h-screen ${state.enabled && state.focusMode ? "study-focus-active" : ""}`}>
      <div
        ref={containerRef}
        className={`bg-background flex-1 h-screen overflow-y-scroll transition-all duration-300 ${state.showComments ? "pr-[320px]" : ""}`}
        style={{ scrollSnapType: "y mandatory" }}
      >
        {sections.map((section, i) => {
          const bgCSS = getBackgroundCSS(section.style?.background);
          return (
            <div
              key={section.id}
              id={section.id}
              ref={(el) => { sectionRefs.current[i] = el; }}
              className="h-screen w-full flex items-center justify-center px-6 md:px-16 shrink-0"
              style={{ scrollSnapAlign: "start", ...bgCSS }}
            >
              <div className="container w-full max-h-screen overflow-y-auto flex flex-col items-center py-16 md:py-24 scrollbar-thin">
                <SlideErrorBoundary slideId={section.id}>
                  {section.content}
                </SlideErrorBoundary>
              </div>
            </div>
          );
        })}
      </div>

      {state.showComments && <CommentsPanel slug={slug} activeIndex={activeIndex} />}

      <nav className={`hidden md:flex fixed top-1/2 -translate-y-1/2 flex-col gap-[10px] text-foreground transition-all duration-300 ${state.showComments ? "right-[340px]" : "right-8"}`}>
        {sections.map((section, i) => (
          <button key={section.id} onClick={() => scrollTo(i)} aria-label={`Go to ${section.label}`} className="block cursor-pointer">
            <motion.span
              className="block h-[2px] origin-right rounded-full"
              animate={{ scaleX: activeIndex === i ? 1 : 0.5, backgroundColor: activeIndex === i ? "currentColor" : "color-mix(in srgb, currentColor 25%, transparent)" }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
              style={{ width: "16px" }}
            />
          </button>
        ))}
      </nav>

      <StudyModeToolbar slug={slug} hasQuiz={hasQuiz} />
    </div>
  );
}

export function DynamicPresentation({ report, slug = "", hasQuiz = false }: { report: Report; slug?: string; hasQuiz?: boolean }) {
  return (
    <StudyModeProvider>
      <PresentationInner report={report} slug={slug} hasQuiz={hasQuiz} />
    </StudyModeProvider>
  );
}
