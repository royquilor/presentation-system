"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Report, SlideStyle, SlideBackground, SlideMedia } from "@/content/types";

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

function MediaElement({ media }: { media: SlideMedia }) {
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

function renderInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`")
      ? <code key={i} className="px-1.5 py-0.5 rounded bg-foreground/[0.06] font-mono text-[0.85em]">{part.slice(1, -1)}</code>
      : <span key={i}>{part}</span>
  );
}

function CodeBlock({ code, language, style }: { code: string; language?: string; style?: React.CSSProperties }) {
  const lines = code.split("\n");
  const gutterWidth = String(lines.length).length;
  return (
    <div className="rounded-lg bg-foreground/[0.04] border border-foreground/10 overflow-hidden my-4 text-left" style={style}>
      {language && (
        <div className="px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-foreground/40 border-b border-foreground/10">
          {language}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed m-0">
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

function BodyText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const segments = splitIntoSegments(text);
  const hasOnlyOneTextSegment = segments.length === 1 && segments[0].type === "text";
  const textLines = hasOnlyOneTextSegment ? segments[0].content.split("\n").filter((l) => l.trim()) : [];

  if (hasOnlyOneTextSegment && textLines.length <= 1) {
    return <p className={className || SECTION_BODY_BASE} style={style}>{renderInlineCode(textLines[0] || text)}</p>;
  }

  return (
    <div className={`space-y-5 ${className || SECTION_BODY_BASE}`} style={style}>
      {segments.map((seg, i) =>
        seg.type === "code" ? (
          <CodeBlock key={i} code={seg.content} language={seg.language} style={style} />
        ) : (
          seg.content.split("\n").filter((l) => l.trim()).map((line, j) => (
            <p key={`${i}-${j}`}>{renderInlineCode(line)}</p>
          ))
        )
      )}
    </div>
  );
}

function SectionContainer({ children, textColor }: { children: React.ReactNode; textColor?: string }) {
  return <div className={SECTION_WRAPPER} style={textColor ? { color: textColor } : undefined}>{children}</div>;
}

function buildSections(report: Report): Section[] {
  const sections: Section[] = [];

  sections.push({
    id: "intro",
    label: "Title",
    style: report.titleStyle,
    content: (
      <SectionContainer textColor={report.titleStyle?.textColor}>
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <svg className="h-5 w-auto text-foreground" style={report.titleStyle?.textColor ? { color: report.titleStyle.textColor } : undefined} viewBox="0 0 121.962 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Datacom">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.0564 0.21891L0.43748 1.26032V22.8676L0 23.583H7.54483C12.7502 23.583 17.1677 18.9856 17.1677 11.2315C17.1677 5.6055 14.5522 0.49189 9.11959 0.21891L0.0564 0.21891ZM4.24219 2.4082H6.73036C10.3114 2.4082 12.9508 4.74701 12.9508 11.1983C12.9508 19.2262 9.90551 20.7542 6.40053 20.7542H4.24219V2.4082ZM41.587 2.35066H46.1771L46.888 2.89927L47.6194 0.222656H32.1136L31.6172 2.92542L32.8297 2.35065H37.2053V22.793L36.8798 23.5543H41.9321L41.587 22.793L41.587 2.35066ZM76.6064 19.7684C75.464 21.2433 74.0738 21.9424 72.499 21.9424C68.5891 21.9424 66.4572 18.2253 66.4572 12.3595C66.4572 7.31446 68.1593 2.06125 72.3726 2.06125C74.0234 2.06125 75.6451 3.1612 76.5876 5.01526H76.9431L76.9379 1.45944C75.464 0.3612 74.0234 0 72.3469 0C66.8135 0 62.2422 3.88385 62.2422 12.8396C62.2422 19.872 66.3547 24 71.7898 24C73.4885 24 75.2922 23.9892 76.8149 22.9252L76.8209 19.5711L76.6064 19.7684ZM97.1166 11.8145C97.0918 6.49545 94.9582 0 87.7219 0C81.4006 0 77.7188 5.12527 77.7188 11.9513C77.7188 19.7396 81.5014 24 87.1126 24C93.3322 24 97.1413 18.5063 97.1166 11.8145M87.5674 2.06055C91.374 2.06055 92.8966 6.73526 92.8966 11.1624C92.8966 16.8579 91.1458 21.9417 87.235 21.9417C83.4284 21.9417 81.9297 17.4065 81.9297 12.9462C81.9297 5.25972 84.0351 2.06056 87.5674 2.06056M109.926 16.8298L103.459 0.210938H99.9405L100.257 0.920777L98.7536 22.5209L98.4922 23.5442H101.206L102.22 8.96052L108.284 23.5442H109.762L115.728 9.07948L116.882 23.5442H121.963L121.688 22.5642L119.767 0.813608L119.944 0.210947H116.531L109.926 16.8298ZM28.3078 16.5741L30.4824 23.5443H35.4151L34.829 22.9219L27.3466 0.222656H23.1025L23.575 1.55967L16.636 22.8922L16.2344 23.5443H19.2703L21.4149 16.575L28.3078 16.5741ZM22.2031 13.8787L24.8494 5.63086L27.5238 13.8787H22.2031ZM55.668 16.5741L57.8418 23.5443H62.7745L62.1901 22.9219L54.7085 0.222656H50.4619L50.9344 1.55967L43.997 22.8922L43.5938 23.5443H46.6305L48.7743 16.575L55.668 16.5741ZM49.5703 13.8787L52.2183 5.63086L54.8919 13.8787H49.5703Z" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-none text-balance" style={report.titleStyle?.textColor ? { color: report.titleStyle.textColor } : undefined}>
          {report.title}
        </h1>
        {report.subtitle && (
          <p className="text-xl md:text-2xl text-foreground/60 mt-6 leading-snug text-balance" style={report.titleStyle?.textColor ? { color: `${report.titleStyle.textColor}99` } : undefined}>
            {report.subtitle}
          </p>
        )}
        <p className="text-sm font-medium text-foreground/40 mt-8" style={report.titleStyle?.textColor ? { color: `${report.titleStyle.textColor}66` } : undefined}>
          {report.author.avatarUrl ? (
            <a href={report.author.avatarUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-foreground/0 hover:decoration-foreground/40 transition-all duration-200">{report.author.name}</a>
          ) : (
            report.author.name
          )}
          {" — "}{report.date}
        </p>
        {report.titleStyle?.media && <MediaElement media={report.titleStyle.media} />}
      </SectionContainer>
    ),
  });

  if (report.context.body) {
    const cs = report.context.style;
    sections.push({
      id: "context",
      label: "Context",
      style: cs,
      content: (
        <SectionContainer textColor={cs?.textColor}>
          <p className={SECTION_LABEL} style={cs?.labelColor ? { color: cs.labelColor } : cs?.textColor ? { color: `${cs.textColor}66` } : undefined}>Context</p>
          <h2 className={SECTION_HEADING} style={cs?.textColor ? { color: cs.textColor } : undefined}>{report.context.heading}</h2>
          <BodyText text={report.context.body} style={cs?.textColor ? { color: `${cs.textColor}99` } : undefined} />
          {cs?.media && <MediaElement media={cs.media} />}
        </SectionContainer>
      ),
    });
  }

  if (report.problem.body) {
    const ps = report.problem.style;
    sections.push({
      id: "problem",
      label: "Problem",
      style: ps,
      content: (
        <SectionContainer textColor={ps?.textColor}>
          <p className={SECTION_LABEL} style={ps?.labelColor ? { color: ps.labelColor } : ps?.textColor ? { color: `${ps.textColor}66` } : undefined}>Problem</p>
          <h2 className={SECTION_HEADING} style={ps?.textColor ? { color: ps.textColor } : undefined}>{report.problem.heading}</h2>
          <BodyText text={report.problem.body} style={ps?.textColor ? { color: `${ps.textColor}99` } : undefined} />
          {ps?.media && <MediaElement media={ps.media} />}
        </SectionContainer>
      ),
    });
  }

  for (const obs of report.observations) {
    if (!obs.title || obs.title === "No observations found") continue;
    const os = obs.style;
    sections.push({
      id: `observation-${obs.number}`,
      label: `Observation ${obs.number}`,
      style: os,
      content: (
        <SectionContainer textColor={os?.textColor}>
          <p className={SECTION_LABEL} style={os?.labelColor ? { color: os.labelColor } : os?.textColor ? { color: `${os.textColor}66` } : undefined}>Observation {obs.number}</p>
          <h2 className={SECTION_HEADING} style={os?.textColor ? { color: os.textColor } : undefined}>{obs.title}</h2>
          <BodyText text={obs.body} className={`${SECTION_BODY_BASE} mb-4 md:mb-5`} style={os?.textColor ? { color: `${os.textColor}99` } : undefined} />
          {obs.note && (
            <p className="text-foreground/40 text-sm md:text-base leading-relaxed text-balance" style={os?.textColor ? { color: `${os.textColor}66` } : undefined}>
              {obs.note}
            </p>
          )}
          {os?.media && <MediaElement media={os.media} />}
        </SectionContainer>
      ),
    });
  }

  if (report.flexSections) {
    for (const flex of report.flexSections) {
      const label = [flex.emoji, flex.heading].filter(Boolean).join(" ");
      const slugBase = flex.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const fs = flex.style;

      if (flex.items.length > 0) {
        for (const item of flex.items) {
          const is = item.style || fs;
          sections.push({
            id: `${slugBase}-${item.number}`,
            label: `${label} ${item.number}`,
            style: is,
            content: (
              <SectionContainer textColor={is?.textColor}>
                <p className={SECTION_LABEL} style={is?.labelColor ? { color: is.labelColor } : is?.textColor ? { color: `${is.textColor}66` } : undefined}>{label}</p>
                <h2 className={SECTION_HEADING} style={is?.textColor ? { color: is.textColor } : undefined}>{item.title}</h2>
                {item.body && (
                  <BodyText text={item.body} className={`${SECTION_BODY_BASE} mb-4 md:mb-5`} style={is?.textColor ? { color: `${is.textColor}99` } : undefined} />
                )}
                {is?.media && <MediaElement media={is.media} />}
              </SectionContainer>
            ),
          });
        }
      } else if (flex.body) {
        sections.push({
          id: slugBase || `flex-${sections.length}`,
          label,
          style: fs,
          content: (
            <SectionContainer textColor={fs?.textColor}>
              <p className={SECTION_LABEL} style={fs?.labelColor ? { color: fs.labelColor } : fs?.textColor ? { color: `${fs.textColor}66` } : undefined}>{label}</p>
              <h2 className={SECTION_HEADING} style={fs?.textColor ? { color: fs.textColor } : undefined}>{flex.heading}</h2>
              <BodyText text={flex.body} style={fs?.textColor ? { color: `${fs.textColor}99` } : undefined} />
              {fs?.media && <MediaElement media={fs.media} />}
            </SectionContainer>
          ),
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
        <SectionContainer textColor={prs?.textColor}>
          <p className={SECTION_LABEL} style={prs?.labelColor ? { color: prs.labelColor } : prs?.textColor ? { color: `${prs.textColor}66` } : undefined}>Proposal</p>
          <h2 className={SECTION_HEADING} style={prs?.textColor ? { color: prs.textColor } : undefined}>{report.proposal.heading}</h2>
          {report.proposal.body && (
            <BodyText text={report.proposal.body} className={`${SECTION_BODY_BASE} mb-4 md:mb-6`} style={prs?.textColor ? { color: `${prs.textColor}99` } : undefined} />
          )}
          {report.proposal.bullets.length > 0 && (
            <ul className="list-disc list-inside space-y-4 md:space-y-5 text-foreground/60 text-base md:text-lg mb-6 md:mb-8 text-balance" style={prs?.textColor ? { color: `${prs.textColor}99` } : undefined}>
              {report.proposal.bullets.map((bullet, i) => (
                <li key={i} className="text-balance">{bullet}</li>
              ))}
            </ul>
          )}
          {report.proposal.summary && (
            <p className="text-foreground/40 text-sm md:text-base text-balance" style={prs?.textColor ? { color: `${prs.textColor}66` } : undefined}>
              {report.proposal.summary}
            </p>
          )}
          {prs?.media && <MediaElement media={prs.media} />}
        </SectionContainer>
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
        <SectionContainer textColor={rs?.textColor}>
          <p className={SECTION_LABEL} style={rs?.labelColor ? { color: rs.labelColor } : rs?.textColor ? { color: `${rs.textColor}66` } : undefined}>Risks</p>
          <h2 className={SECTION_HEADING} style={rs?.textColor ? { color: rs.textColor } : undefined}>What could go wrong</h2>
          <div className="space-y-5 md:space-y-6">
            {report.risks.map((risk, i) => (
              <div key={i}>
                <p className="text-foreground/80 font-medium mb-1 text-base md:text-lg text-balance" style={rs?.textColor ? { color: `${rs.textColor}cc` } : undefined}>
                  {risk.title}
                </p>
                <p className="text-foreground/60 text-base leading-relaxed text-balance" style={rs?.textColor ? { color: `${rs.textColor}99` } : undefined}>
                  {risk.body}
                </p>
              </div>
            ))}
          </div>
          {rs?.media && <MediaElement media={rs.media} />}
        </SectionContainer>
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
        <SectionContainer textColor={ns?.textColor}>
          <p className={SECTION_LABEL} style={ns?.labelColor ? { color: ns.labelColor } : ns?.textColor ? { color: `${ns.textColor}66` } : undefined}>Next Steps</p>
          <h2 className={SECTION_HEADING} style={ns?.textColor ? { color: ns.textColor } : undefined}>What to do first</h2>
          <ol className="space-y-4 md:space-y-5 text-foreground/60 text-base md:text-lg text-balance" style={ns?.textColor ? { color: `${ns.textColor}99` } : undefined}>
            {report.nextSteps.map((step) => (
              <li key={step.step} className="flex gap-3 text-balance">
                <span className="font-semibold text-foreground/30 shrink-0" style={ns?.textColor ? { color: `${ns.textColor}4d` } : undefined}>
                  {step.step}.
                </span>
                <span className="text-balance">
                  <span className="text-foreground/80" style={ns?.textColor ? { color: `${ns.textColor}cc` } : undefined}>{step.label}</span>
                  {step.description && ` — ${step.description}`}
                </span>
              </li>
            ))}
          </ol>
          {ns?.media && <MediaElement media={ns.media} />}
        </SectionContainer>
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
        <SectionContainer textColor={cls?.textColor}>
          <h2 className={SECTION_HEADING} style={cls?.textColor ? { color: cls.textColor } : undefined}>{report.closer.observation}</h2>
          {report.closer.body && (
            <p className={`${SECTION_BODY_BASE} mb-6 md:mb-8`} style={cls?.textColor ? { color: `${cls.textColor}99` } : undefined}>{report.closer.body}</p>
          )}
          {report.closer.reportUrl && report.closer.reportUrl !== "#" && (
            <a
              href={report.closer.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors duration-200 group"
              style={cls?.textColor ? { color: `${cls.textColor}80` } : undefined}
            >
              <span className="border-b border-foreground/20 group-hover:border-foreground/60 transition-colors duration-200 text-balance">
                Full report
              </span>
              <span className="text-foreground/30 group-hover:text-foreground/60 transition-colors duration-200">
                ↗
              </span>
            </a>
          )}
          {cls?.media && <MediaElement media={cls.media} />}
        </SectionContainer>
      ),
    });
  }

  return sections;
}

export function DynamicPresentation({ report }: { report: Report }) {
  const sections = buildSections(report);
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
      if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        setActiveIndex((prev) => { const next = Math.min(prev + 1, sections.length - 1); scrollTo(next, "instant"); return next; });
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        setActiveIndex((prev) => { const next = Math.max(prev - 1, 0); scrollTo(next, "instant"); return next; });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sections.length]);

  return (
    <div ref={containerRef} className="bg-background h-screen overflow-y-scroll" style={{ scrollSnapType: "y mandatory" }}>
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
            <div className="container w-full flex flex-col items-center justify-center">
              {section.content}
            </div>
          </div>
        );
      })}
      <nav className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-[10px] text-foreground">
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
    </div>
  );
}
