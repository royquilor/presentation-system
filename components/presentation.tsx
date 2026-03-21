"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { report } from "@/content/report";
import type { SlideStyle, SlideBackground, SlideAnimation, SlideMedia } from "@/content/types";

type Section = {
  id: string;
  label: string;
  content: React.ReactNode;
  style?: SlideStyle;
};

const SECTION_WRAPPER = "max-w-2xl w-full";
const SECTION_LABEL =
  "text-sm font-semibold uppercase tracking-widest text-foreground/40 mb-4 text-balance";
const SECTION_HEADING =
  "text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 md:mb-8 leading-tight text-balance";
const SECTION_BODY_BASE =
  "text-foreground/60 text-base md:text-lg leading-relaxed text-balance";

function SectionContainer({ children }: { children: React.ReactNode }) {
  return <div className={SECTION_WRAPPER}>{children}</div>;
}

function SectionLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  const cls = color
    ? `text-sm font-semibold uppercase tracking-widest mb-4 text-balance`
    : SECTION_LABEL;
  return <p className={cls} style={color ? { color } : undefined}>{children}</p>;
}

function SectionHeading({ children, color }: { children: React.ReactNode; color?: string }) {
  const cls = color
    ? "text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 leading-tight text-balance"
    : SECTION_HEADING;
  return <h2 className={cls} style={color ? { color } : undefined}>{children}</h2>;
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
        backgroundPosition: bg.position ?? "center",
      };
  }
}

const animationVariants: Record<SlideAnimation, Variants> = {
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  },
  none: {
    hidden: {},
    visible: {},
  },
};

function MediaElement({ media }: { media: SlideMedia }) {
  const isGif = media.src.endsWith(".gif");
  const isVideo = media.src.endsWith(".mp4") || media.src.endsWith(".webm");

  const baseClasses = `${media.rounded !== false ? "rounded-lg" : ""} object-cover`;
  const style: React.CSSProperties = {
    maxWidth: media.width ?? "100%",
    maxHeight: media.height ?? "400px",
  };

  if (isVideo) {
    return (
      <video
        src={media.src}
        autoPlay
        loop
        muted
        playsInline
        className={baseClasses}
        style={style}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={media.src}
      alt={media.alt ?? ""}
      className={baseClasses}
      style={style}
      {...(isGif ? {} : { loading: "lazy" })}
    />
  );
}

function SlideContent({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: SlideStyle;
}) {
  const media = style?.media;
  const position = media?.position ?? "below";

  if (!media || position === "background") {
    return <SectionContainer>{children}</SectionContainer>;
  }

  if (position === "left" || position === "right") {
    const isLeft = position === "left";
    return (
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {isLeft && (
          <div className="w-full md:w-1/2 flex-shrink-0">
            <MediaElement media={media} />
          </div>
        )}
        <div className="w-full md:w-1/2">{children}</div>
        {!isLeft && (
          <div className="w-full md:w-1/2 flex-shrink-0">
            <MediaElement media={media} />
          </div>
        )}
      </div>
    );
  }

  return (
    <SectionContainer>
      {position === "above" && (
        <div className="mb-6 md:mb-8">
          <MediaElement media={media} />
        </div>
      )}
      {children}
      {position === "below" && (
        <div className="mt-6 md:mt-8">
          <MediaElement media={media} />
        </div>
      )}
    </SectionContainer>
  );
}

function buildSections(): Section[] {
  const sections: Section[] = [];
  const r = report as unknown as import("@/content/types").Report;

  // Title
  sections.push({
    id: "intro",
    label: "Title",
    style: r.titleStyle,
    content: (
      <SlideContent style={r.titleStyle}>
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <svg className="h-5 w-auto text-foreground" viewBox="0 0 121.962 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Datacom">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.0564 0.21891L0.43748 1.26032V22.8676L0 23.583H7.54483C12.7502 23.583 17.1677 18.9856 17.1677 11.2315C17.1677 5.6055 14.5522 0.49189 9.11959 0.21891L0.0564 0.21891ZM4.24219 2.4082H6.73036C10.3114 2.4082 12.9508 4.74701 12.9508 11.1983C12.9508 19.2262 9.90551 20.7542 6.40053 20.7542H4.24219V2.4082ZM41.587 2.35066H46.1771L46.888 2.89927L47.6194 0.222656H32.1136L31.6172 2.92542L32.8297 2.35065H37.2053V22.793L36.8798 23.5543H41.9321L41.587 22.793L41.587 2.35066ZM76.6064 19.7684C75.464 21.2433 74.0738 21.9424 72.499 21.9424C68.5891 21.9424 66.4572 18.2253 66.4572 12.3595C66.4572 7.31446 68.1593 2.06125 72.3726 2.06125C74.0234 2.06125 75.6451 3.1612 76.5876 5.01526H76.9431L76.9379 1.45944C75.464 0.3612 74.0234 0 72.3469 0C66.8135 0 62.2422 3.88385 62.2422 12.8396C62.2422 19.872 66.3547 24 71.7898 24C73.4885 24 75.2922 23.9892 76.8149 22.9252L76.8209 19.5711L76.6064 19.7684ZM97.1166 11.8145C97.0918 6.49545 94.9582 0 87.7219 0C81.4006 0 77.7188 5.12527 77.7188 11.9513C77.7188 19.7396 81.5014 24 87.1126 24C93.3322 24 97.1413 18.5063 97.1166 11.8145M87.5674 2.06055C91.374 2.06055 92.8966 6.73526 92.8966 11.1624C92.8966 16.8579 91.1458 21.9417 87.235 21.9417C83.4284 21.9417 81.9297 17.4065 81.9297 12.9462C81.9297 5.25972 84.0351 2.06056 87.5674 2.06056M109.926 16.8298L103.459 0.210938H99.9405L100.257 0.920777L98.7536 22.5209L98.4922 23.5442H101.206L102.22 8.96052L108.284 23.5442H109.762L115.728 9.07948L116.882 23.5442H121.963L121.688 22.5642L119.767 0.813608L119.944 0.210947H116.531L109.926 16.8298ZM28.3078 16.5741L30.4824 23.5443H35.4151L34.829 22.9219L27.3466 0.222656H23.1025L23.575 1.55967L16.636 22.8922L16.2344 23.5443H19.2703L21.4149 16.575L28.3078 16.5741ZM22.2031 13.8787L24.8494 5.63086L27.5238 13.8787H22.2031ZM55.668 16.5741L57.8418 23.5443H62.7745L62.1901 22.9219L54.7085 0.222656H50.4619L50.9344 1.55967L43.997 22.8922L43.5938 23.5443H46.6305L48.7743 16.575L55.668 16.5741ZM49.5703 13.8787L52.2183 5.63086L54.8919 13.8787H49.5703Z" fill="currentColor"/>
          </svg>
        </div>
        <h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold leading-none text-balance"
          style={{ color: r.titleStyle?.textColor ?? undefined }}
        >
          {r.title}
        </h1>
        <p className="text-xl md:text-2xl text-foreground/60 mt-6 leading-snug text-balance">
          {r.subtitle}
        </p>
        <p className="text-sm font-medium text-foreground/40 mt-8">
          {r.author.name} — {r.date}
        </p>
      </SlideContent>
    ),
  });

  // Context
  sections.push({
    id: "context",
    label: "Context",
    style: r.context.style,
    content: (
      <SlideContent style={r.context.style}>
        <SectionLabel color={r.context.style?.labelColor}>Context</SectionLabel>
        <SectionHeading color={r.context.style?.textColor}>{r.context.heading}</SectionHeading>
        <SectionBody>{r.context.body}</SectionBody>
      </SlideContent>
    ),
  });

  // Problem
  sections.push({
    id: "problem",
    label: "Problem",
    style: r.problem.style,
    content: (
      <SlideContent style={r.problem.style}>
        <SectionLabel color={r.problem.style?.labelColor}>Problem</SectionLabel>
        <SectionHeading color={r.problem.style?.textColor}>{r.problem.heading}</SectionHeading>
        <SectionBody>{r.problem.body}</SectionBody>
      </SlideContent>
    ),
  });

  // Observations
  for (const obs of r.observations) {
    sections.push({
      id: `observation-${obs.number}`,
      label: `Observation ${obs.number}`,
      style: obs.style,
      content: (
        <SlideContent style={obs.style}>
          <SectionLabel color={obs.style?.labelColor}>Observation {obs.number}</SectionLabel>
          <SectionHeading color={obs.style?.textColor}>{obs.title}</SectionHeading>
          <SectionBody className="mb-4 md:mb-5">{obs.body}</SectionBody>
          {obs.note && (
            <p className="text-foreground/40 text-sm md:text-base leading-relaxed text-balance">
              {obs.note}
            </p>
          )}
        </SlideContent>
      ),
    });
  }

  // Proposal
  sections.push({
    id: "proposal",
    label: "Proposal",
    style: r.proposal.style,
    content: (
      <SlideContent style={r.proposal.style}>
        <SectionLabel color={r.proposal.style?.labelColor}>Proposal</SectionLabel>
        <SectionHeading color={r.proposal.style?.textColor}>{r.proposal.heading}</SectionHeading>
        <SectionBody className="mb-4 md:mb-6">{r.proposal.body}</SectionBody>
        {r.proposal.bullets.length > 0 && (
          <ul className="list-disc list-inside space-y-4 md:space-y-5 text-foreground/60 text-base md:text-lg mb-6 md:mb-8 text-balance">
            {r.proposal.bullets.map((bullet: string, i: number) => (
              <li key={i} className="text-balance">{bullet}</li>
            ))}
          </ul>
        )}
        <p className="text-foreground/40 text-sm md:text-base text-balance">
          {r.proposal.summary}
        </p>
      </SlideContent>
    ),
  });

  // Risks
  sections.push({
    id: "risks",
    label: "Risks",
    style: r.risksStyle,
    content: (
      <SlideContent style={r.risksStyle}>
        <SectionLabel color={r.risksStyle?.labelColor}>Risks</SectionLabel>
        <SectionHeading color={r.risksStyle?.textColor}>What could go wrong</SectionHeading>
        <div className="space-y-5 md:space-y-6">
          {r.risks.map((risk: { title: string; body: string }, i: number) => (
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
      </SlideContent>
    ),
  });

  // Next Steps
  sections.push({
    id: "next-steps",
    label: "Next Steps",
    style: r.nextStepsStyle,
    content: (
      <SlideContent style={r.nextStepsStyle}>
        <SectionLabel color={r.nextStepsStyle?.labelColor}>Next Steps</SectionLabel>
        <SectionHeading color={r.nextStepsStyle?.textColor}>What to do first</SectionHeading>
        <ol className="space-y-4 md:space-y-5 text-foreground/60 text-base md:text-lg text-balance">
          {r.nextSteps.map((step: { step: number; label: string; description: string }) => (
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
      </SlideContent>
    ),
  });

  // Closer
  sections.push({
    id: "close",
    label: "Close",
    style: r.closer.style,
    content: (
      <SlideContent style={r.closer.style}>
        <SectionHeading color={r.closer.style?.textColor}>{r.closer.observation}</SectionHeading>
        <SectionBody className="mb-6 md:mb-8">{r.closer.body}</SectionBody>
        {r.closer.reportUrl && (r.closer.reportUrl as string) !== "#" && (
          <a
            href={r.closer.reportUrl}
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
      </SlideContent>
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

  const scrollTo = (index: number, behavior: ScrollBehavior = "smooth") => {
    const section = sectionRefs.current[index];
    if (!section) return;
    isProgrammaticScrollRef.current = true;
    section.scrollIntoView({
      behavior: behavior === "smooth" ? "smooth" : "instant",
      block: "start",
    });
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
      {sections.map((section, i) => {
        const bg = section.style?.background;
        const anim = section.style?.animation ?? "none";
        const variants = animationVariants[anim];
        const shouldAnimate = !prefersReducedMotion && anim !== "none";

        return (
          <div
            key={section.id}
            id={section.id}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="h-screen w-full flex items-center justify-center px-6 md:px-16 shrink-0 relative overflow-hidden"
            style={{
              scrollSnapAlign: "start",
              ...getBackgroundCSS(bg),
            }}
          >
            {shouldAnimate ? (
              <motion.div
                className="container w-full flex flex-col items-center justify-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={variants}
              >
                {section.content}
              </motion.div>
            ) : (
              <div className="container w-full flex flex-col items-center justify-center">
                {section.content}
              </div>
            )}
          </div>
        );
      })}

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
