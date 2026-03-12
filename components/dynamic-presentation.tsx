"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Report } from "@/content/types";

type Section = {
  id: string;
  label: string;
  content: React.ReactNode;
};

const SECTION_WRAPPER = "max-w-2xl w-full";
const SECTION_LABEL =
  "text-sm font-semibold uppercase tracking-widest text-foreground/40 mb-4 text-balance";
const SECTION_HEADING =
  "text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 md:mb-8 leading-tight text-balance";
const SECTION_BODY_BASE =
  "text-foreground/60 text-base md:text-lg leading-relaxed text-balance";

function BodyText({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length <= 1) {
    return <p className={className || SECTION_BODY_BASE}>{text}</p>;
  }
  return (
    <div className={`space-y-3 ${className || SECTION_BODY_BASE}`}>
      {lines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
}

function SectionContainer({ children }: { children: React.ReactNode }) {
  return <div className={SECTION_WRAPPER}>{children}</div>;
}

function buildSections(report: Report): Section[] {
  const sections: Section[] = [];

  sections.push({
    id: "intro",
    label: "Title",
    content: (
      <SectionContainer>
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <svg className="h-5 w-auto text-foreground" viewBox="0 0 121.962 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Datacom">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.0564 0.21891L0.43748 1.26032V22.8676L0 23.583H7.54483C12.7502 23.583 17.1677 18.9856 17.1677 11.2315C17.1677 5.6055 14.5522 0.49189 9.11959 0.21891L0.0564 0.21891ZM4.24219 2.4082H6.73036C10.3114 2.4082 12.9508 4.74701 12.9508 11.1983C12.9508 19.2262 9.90551 20.7542 6.40053 20.7542H4.24219V2.4082ZM41.587 2.35066H46.1771L46.888 2.89927L47.6194 0.222656H32.1136L31.6172 2.92542L32.8297 2.35065H37.2053V22.793L36.8798 23.5543H41.9321L41.587 22.793L41.587 2.35066ZM76.6064 19.7684C75.464 21.2433 74.0738 21.9424 72.499 21.9424C68.5891 21.9424 66.4572 18.2253 66.4572 12.3595C66.4572 7.31446 68.1593 2.06125 72.3726 2.06125C74.0234 2.06125 75.6451 3.1612 76.5876 5.01526H76.9431L76.9379 1.45944C75.464 0.3612 74.0234 0 72.3469 0C66.8135 0 62.2422 3.88385 62.2422 12.8396C62.2422 19.872 66.3547 24 71.7898 24C73.4885 24 75.2922 23.9892 76.8149 22.9252L76.8209 19.5711L76.6064 19.7684ZM97.1166 11.8145C97.0918 6.49545 94.9582 0 87.7219 0C81.4006 0 77.7188 5.12527 77.7188 11.9513C77.7188 19.7396 81.5014 24 87.1126 24C93.3322 24 97.1413 18.5063 97.1166 11.8145M87.5674 2.06055C91.374 2.06055 92.8966 6.73526 92.8966 11.1624C92.8966 16.8579 91.1458 21.9417 87.235 21.9417C83.4284 21.9417 81.9297 17.4065 81.9297 12.9462C81.9297 5.25972 84.0351 2.06056 87.5674 2.06056M109.926 16.8298L103.459 0.210938H99.9405L100.257 0.920777L98.7536 22.5209L98.4922 23.5442H101.206L102.22 8.96052L108.284 23.5442H109.762L115.728 9.07948L116.882 23.5442H121.963L121.688 22.5642L119.767 0.813608L119.944 0.210947H116.531L109.926 16.8298ZM28.3078 16.5741L30.4824 23.5443H35.4151L34.829 22.9219L27.3466 0.222656H23.1025L23.575 1.55967L16.636 22.8922L16.2344 23.5443H19.2703L21.4149 16.575L28.3078 16.5741ZM22.2031 13.8787L24.8494 5.63086L27.5238 13.8787H22.2031ZM55.668 16.5741L57.8418 23.5443H62.7745L62.1901 22.9219L54.7085 0.222656H50.4619L50.9344 1.55967L43.997 22.8922L43.5938 23.5443H46.6305L48.7743 16.575L55.668 16.5741ZM49.5703 13.8787L52.2183 5.63086L54.8919 13.8787H49.5703Z" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-none text-balance">
          {report.title}
        </h1>
        {report.subtitle && (
          <p className="text-xl md:text-2xl text-foreground/60 mt-6 leading-snug text-balance">
            {report.subtitle}
          </p>
        )}
        <p className="text-sm font-medium text-foreground/40 mt-8">
          {report.author.avatarUrl ? (
            <a href={report.author.avatarUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-foreground/0 hover:decoration-foreground/40 transition-all duration-200">{report.author.name}</a>
          ) : (
            report.author.name
          )}
          {" — "}{report.date}
        </p>
      </SectionContainer>
    ),
  });

  if (report.context.body) {
    sections.push({
      id: "context",
      label: "Context",
      content: (
        <SectionContainer>
          <p className={SECTION_LABEL}>Context</p>
          <h2 className={SECTION_HEADING}>{report.context.heading}</h2>
          <BodyText text={report.context.body} />
        </SectionContainer>
      ),
    });
  }

  if (report.problem.body) {
    sections.push({
      id: "problem",
      label: "Problem",
      content: (
        <SectionContainer>
          <p className={SECTION_LABEL}>Problem</p>
          <h2 className={SECTION_HEADING}>{report.problem.heading}</h2>
          <BodyText text={report.problem.body} />
        </SectionContainer>
      ),
    });
  }

  for (const obs of report.observations) {
    if (!obs.title || obs.title === "No observations found") continue;
    sections.push({
      id: `observation-${obs.number}`,
      label: `Observation ${obs.number}`,
      content: (
        <SectionContainer>
          <p className={SECTION_LABEL}>Observation {obs.number}</p>
          <h2 className={SECTION_HEADING}>{obs.title}</h2>
          <BodyText text={obs.body} className={`${SECTION_BODY_BASE} mb-4 md:mb-5`} />
          {obs.note && (
            <p className="text-foreground/40 text-sm md:text-base leading-relaxed text-balance">
              {obs.note}
            </p>
          )}
        </SectionContainer>
      ),
    });
  }

  if (report.proposal.body || report.proposal.bullets.length > 0) {
    sections.push({
      id: "proposal",
      label: "Proposal",
      content: (
        <SectionContainer>
          <p className={SECTION_LABEL}>Proposal</p>
          <h2 className={SECTION_HEADING}>{report.proposal.heading}</h2>
          {report.proposal.body && (
            <BodyText text={report.proposal.body} className={`${SECTION_BODY_BASE} mb-4 md:mb-6`} />
          )}
          {report.proposal.bullets.length > 0 && (
            <ul className="list-disc list-inside space-y-4 md:space-y-5 text-foreground/60 text-base md:text-lg mb-6 md:mb-8 text-balance">
              {report.proposal.bullets.map((bullet, i) => (
                <li key={i} className="text-balance">{bullet}</li>
              ))}
            </ul>
          )}
          {report.proposal.summary && (
            <p className="text-foreground/40 text-sm md:text-base text-balance">
              {report.proposal.summary}
            </p>
          )}
        </SectionContainer>
      ),
    });
  }

  if (report.risks.length > 0 && report.risks[0].title !== "No risks identified") {
    sections.push({
      id: "risks",
      label: "Risks",
      content: (
        <SectionContainer>
          <p className={SECTION_LABEL}>Risks</p>
          <h2 className={SECTION_HEADING}>What could go wrong</h2>
          <div className="space-y-5 md:space-y-6">
            {report.risks.map((risk, i) => (
              <div key={i}>
                <p className="text-foreground/80 font-medium mb-1 text-base md:text-lg text-balance">
                  {risk.title}
                </p>
                <p className="text-foreground/60 text-base leading-relaxed text-balance">
                  {risk.body}
                </p>
              </div>
            ))}
          </div>
        </SectionContainer>
      ),
    });
  }

  if (report.nextSteps.length > 0 && report.nextSteps[0].label !== "Review document") {
    sections.push({
      id: "next-steps",
      label: "Next Steps",
      content: (
        <SectionContainer>
          <p className={SECTION_LABEL}>Next Steps</p>
          <h2 className={SECTION_HEADING}>What to do first</h2>
          <ol className="space-y-4 md:space-y-5 text-foreground/60 text-base md:text-lg text-balance">
            {report.nextSteps.map((step) => (
              <li key={step.step} className="flex gap-3 text-balance">
                <span className="font-semibold text-foreground/30 shrink-0">
                  {step.step}.
                </span>
                <span className="text-balance">
                  <span className="text-foreground/80">{step.label}</span>
                  {step.description && ` — ${step.description}`}
                </span>
              </li>
            ))}
          </ol>
        </SectionContainer>
      ),
    });
  }

  sections.push({
    id: "close",
    label: "Close",
    content: (
      <SectionContainer>
        <h2 className={SECTION_HEADING}>{report.closer.observation}</h2>
        {report.closer.body && (
          <p className={`${SECTION_BODY_BASE} mb-6 md:mb-8`}>{report.closer.body}</p>
        )}
        {report.closer.reportUrl && report.closer.reportUrl !== "#" && (
          <a
            href={report.closer.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors duration-200 group"
          >
            <span className="border-b border-foreground/20 group-hover:border-foreground/60 transition-colors duration-200 text-balance">
              Full report
            </span>
            <span className="text-foreground/30 group-hover:text-foreground/60 transition-colors duration-200">
              ↗
            </span>
          </a>
        )}
      </SectionContainer>
    ),
  });

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
      {sections.map((section, i) => (
        <div
          key={section.id}
          id={section.id}
          ref={(el) => { sectionRefs.current[i] = el; }}
          className="h-screen w-full flex items-center justify-center px-6 md:px-16 shrink-0"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="container w-full flex flex-col items-center justify-center">
            {section.content}
          </div>
        </div>
      ))}
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
