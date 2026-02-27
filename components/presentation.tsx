"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { report } from "@/content/report";

type Section = {
  id: string;
  label: string;
  content: React.ReactNode;
};

// Shared layout primitives — single source of truth for section styling (DRY).
const SECTION_WRAPPER = "max-w-2xl w-full";
const SECTION_LABEL =
  "font-mono text-sm text-foreground/40 mb-4 text-balance";
const SECTION_HEADING =
  "text-2xl md:text-3xl lg:text-4xl font-medium text-foreground mb-6 md:mb-8 leading-none text-balance";
const SECTION_BODY_BASE =
  "text-foreground/60 text-base md:text-lg leading-relaxed text-balance";

function SectionContainer({ children }: { children: React.ReactNode }) {
  return <div className={SECTION_WRAPPER}>{children}</div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className={SECTION_LABEL}>{children}</p>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className={SECTION_HEADING}>{children}</h2>;
}

function SectionBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cn = className ? `${SECTION_BODY_BASE} ${className}` : SECTION_BODY_BASE;
  return <p className={cn}>{children}</p>;
}

function buildSections(): Section[] {
  const sections: Section[] = [];

  // Title
  sections.push({
    id: "intro",
    label: "Title",
    content: (
      <SectionContainer>
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="w-5 h-5 cursor-default">
                <AvatarImage src={report.author.avatarUrl} alt={report.author.name} />
                <AvatarFallback className="text-[8px]">{report.author.initials}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{report.author.name}</p>
            </TooltipContent>
          </Tooltip>
          <p className="font-mono text-sm text-foreground/40 text-balance">
            <a
              href="https://www.404roy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground/70 transition-colors"
            >
              404roy
            </a>{" "}
            — 27 Feb 2026
          </p>
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-foreground leading-none text-balance">
          {report.title}
        </h1>
        <p className="text-xl md:text-2xl text-foreground/60 mt-6 leading-snug text-balance">
          {report.subtitle}
        </p>
      </SectionContainer>
    ),
  });

  // Context
  sections.push({
    id: "context",
    label: "Context",
    content: (
      <SectionContainer>
        <SectionLabel>Context</SectionLabel>
        <SectionHeading>{report.context.heading}</SectionHeading>
        <SectionBody>{report.context.body}</SectionBody>
      </SectionContainer>
    ),
  });

  // Problem
  sections.push({
    id: "problem",
    label: "Problem",
    content: (
      <SectionContainer>
        <SectionLabel>Problem</SectionLabel>
        <SectionHeading>{report.problem.heading}</SectionHeading>
        <SectionBody>{report.problem.body}</SectionBody>
      </SectionContainer>
    ),
  });

  // Observations — one slide each
  for (const obs of report.observations) {
    sections.push({
      id: `observation-${obs.number}`,
      label: `Observation ${obs.number}`,
      content: (
        <SectionContainer>
          <SectionLabel>Observation {obs.number}</SectionLabel>
          <SectionHeading>{obs.title}</SectionHeading>
          <SectionBody className="mb-4 md:mb-5">{obs.body}</SectionBody>
          <p className="text-foreground/40 text-sm md:text-base leading-relaxed text-balance">
            {obs.note}
          </p>
        </SectionContainer>
      ),
    });
  }

  // Proposal
  sections.push({
    id: "proposal",
    label: "Proposal",
    content: (
      <SectionContainer>
        <SectionLabel>Proposal</SectionLabel>
        <SectionHeading>{report.proposal.heading}</SectionHeading>
        <SectionBody className="mb-4 md:mb-6">{report.proposal.body}</SectionBody>
        {report.proposal.bullets.length > 0 && (
          <ul className="list-disc list-inside space-y-4 md:space-y-5 text-foreground/60 text-base md:text-lg mb-6 md:mb-8 text-balance">
            {report.proposal.bullets.map((bullet, i) => (
              <li key={i} className="text-balance">{bullet}</li>
            ))}
          </ul>
        )}
        <p className="text-foreground/40 text-sm md:text-base text-balance">
          {report.proposal.summary}
        </p>
      </SectionContainer>
    ),
  });

  // Risks
  sections.push({
    id: "risks",
    label: "Risks",
    content: (
      <SectionContainer>
        <SectionLabel>Risks</SectionLabel>
        <SectionHeading>What could go wrong</SectionHeading>
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

  // Next Steps
  sections.push({
    id: "next-steps",
    label: "Next Steps",
    content: (
      <SectionContainer>
        <SectionLabel>Next Steps</SectionLabel>
        <SectionHeading>What to do first</SectionHeading>
        <ol className="space-y-4 md:space-y-5 text-foreground/60 text-base md:text-lg text-balance">
          {report.nextSteps.map((step) => (
            <li key={step.step} className="flex gap-3 text-balance">
              <span className="font-mono text-foreground/30 shrink-0">
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

  // Closer
  sections.push({
    id: "close",
    label: "Close",
    content: (
      <SectionContainer>
        <SectionHeading>{report.closer.observation}</SectionHeading>
        <SectionBody className="mb-6 md:mb-8">{report.closer.body}</SectionBody>
        {report.closer.reportUrl && report.closer.reportUrl !== "#" && (
          <a
            href={report.closer.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-mono text-foreground/50 hover:text-foreground transition-colors duration-200 group"
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

const sections = buildSections();

export function Presentation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  // Skip IntersectionObserver updates during/right after keyboard or nav click scroll
  const isProgrammaticScrollRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isProgrammaticScrollRef.current) {
            setActiveIndex(i);
          }
        },
        { root: container, threshold: 0.5 }
      );
      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Scroll to section by index. Uses scrollIntoView so scroll-snap aligns correctly
  // (scrollTo(offsetTop) can land between snap points and snap to the wrong section).
  const scrollTo = (index: number, behavior: ScrollBehavior = "smooth") => {
    const section = sectionRefs.current[index];
    if (!section) return;
    isProgrammaticScrollRef.current = true;
    section.scrollIntoView({
      behavior: behavior === "smooth" ? "smooth" : "instant",
      block: "start",
    });
    // Allow IntersectionObserver to drive activeIndex again after scroll settles
    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 100);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft"
      ) {
        e.preventDefault();
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        setActiveIndex((prev) => {
          const next = Math.min(prev + 1, sections.length - 1);
          scrollTo(next, "instant");
          return next;
        });
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        setActiveIndex((prev) => {
          const next = Math.max(prev - 1, 0);
          scrollTo(next, "instant");
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-background h-screen overflow-y-scroll"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {sections.map((section, i) => (
        <div
          key={section.id}
          id={section.id}
          ref={(el) => {
            sectionRefs.current[i] = el;
          }}
          className="h-screen w-full flex items-center justify-center px-6 md:px-16 shrink-0"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="container w-full flex flex-col items-center justify-center">
            {section.content}
          </div>
        </div>
      ))}

      {/* Right-side navigation indicators */}
      <nav className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-[10px] text-foreground">
        {sections.map((section, i) => (
          <button
            key={section.id}
            onClick={() => scrollTo(i)}
            aria-label={`Go to ${section.label}`}
            className="block cursor-pointer"
          >
            <motion.span
              className="block h-[2px] origin-right rounded-full"
              animate={{
                scaleX: activeIndex === i ? 1 : 0.5,
                backgroundColor:
                  activeIndex === i
                    ? "currentColor"
                    : "color-mix(in srgb, currentColor 25%, transparent)",
              }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.3, ease: "easeInOut" }
              }
              style={{ width: "16px" }}
            />
          </button>
        ))}
      </nav>
    </div>
  );
}
