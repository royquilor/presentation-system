"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ROIBarChart,
  CostComparisonChart,
  AdoptionGrowthChart,
  EfficiencyGainsChart,
  ModelPortfolioChart,
  FeatureMaturityPieChart,
} from "@/components/charts";

const WRAP = "max-w-2xl w-full";
const LABEL = "text-sm font-semibold uppercase tracking-widest text-foreground/40 mb-4";
const H2 = "text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 md:mb-8 leading-tight text-balance";
const BODY = "text-foreground/60 text-base md:text-lg leading-relaxed text-balance";
const STAT = "text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-none";
const STAT_LABEL = "text-foreground/50 text-lg md:text-xl mt-2";
const CITE_LINK = "underline decoration-foreground/0 hover:decoration-foreground/40 transition-all duration-200";
const CONF = "https://datacomgroup.atlassian.net/wiki/spaces/IA/pages";

function Cite({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`text-foreground/40 text-sm ${CITE_LINK}`}>
      {children}
    </a>
  );
}

function KPI({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-bold text-foreground">{value}</p>
      <p className="text-foreground/50 text-sm mt-1">{label}</p>
    </div>
  );
}

function scrollToSlide(n: number) {
  document.getElementById(`slide-${n}`)?.scrollIntoView({ behavior: "instant", block: "start" });
}

type Slide = { id: string; label: string; content: React.ReactNode };

function buildSlides(): Slide[] {
  return [
    {
      id: "title",
      label: "Title",
      content: (
        <div className={WRAP}>
          <svg className="h-5 w-auto text-foreground mb-8" viewBox="0 0 121.962 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Datacom">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.0564 0.21891L0.43748 1.26032V22.8676L0 23.583H7.54483C12.7502 23.583 17.1677 18.9856 17.1677 11.2315C17.1677 5.6055 14.5522 0.49189 9.11959 0.21891L0.0564 0.21891ZM4.24219 2.4082H6.73036C10.3114 2.4082 12.9508 4.74701 12.9508 11.1983C12.9508 19.2262 9.90551 20.7542 6.40053 20.7542H4.24219V2.4082ZM41.587 2.35066H46.1771L46.888 2.89927L47.6194 0.222656H32.1136L31.6172 2.92542L32.8297 2.35065H37.2053V22.793L36.8798 23.5543H41.9321L41.587 22.793L41.587 2.35066ZM76.6064 19.7684C75.464 21.2433 74.0738 21.9424 72.499 21.9424C68.5891 21.9424 66.4572 18.2253 66.4572 12.3595C66.4572 7.31446 68.1593 2.06125 72.3726 2.06125C74.0234 2.06125 75.6451 3.1612 76.5876 5.01526H76.9431L76.9379 1.45944C75.464 0.3612 74.0234 0 72.3469 0C66.8135 0 62.2422 3.88385 62.2422 12.8396C62.2422 19.872 66.3547 24 71.7898 24C73.4885 24 75.2922 23.9892 76.8149 22.9252L76.8209 19.5711L76.6064 19.7684ZM97.1166 11.8145C97.0918 6.49545 94.9582 0 87.7219 0C81.4006 0 77.7188 5.12527 77.7188 11.9513C77.7188 19.7396 81.5014 24 87.1126 24C93.3322 24 97.1413 18.5063 97.1166 11.8145M87.5674 2.06055C91.374 2.06055 92.8966 6.73526 92.8966 11.1624C92.8966 16.8579 91.1458 21.9417 87.235 21.9417C83.4284 21.9417 81.9297 17.4065 81.9297 12.9462C81.9297 5.25972 84.0351 2.06056 87.5674 2.06056M109.926 16.8298L103.459 0.210938H99.9405L100.257 0.920777L98.7536 22.5209L98.4922 23.5442H101.206L102.22 8.96052L108.284 23.5442H109.762L115.728 9.07948L116.882 23.5442H121.963L121.688 22.5642L119.767 0.813608L119.944 0.210947H116.531L109.926 16.8298ZM28.3078 16.5741L30.4824 23.5443H35.4151L34.829 22.9219L27.3466 0.222656H23.1025L23.575 1.55967L16.636 22.8922L16.2344 23.5443H19.2703L21.4149 16.575L28.3078 16.5741ZM22.2031 13.8787L24.8494 5.63086L27.5238 13.8787H22.2031ZM55.668 16.5741L57.8418 23.5443H62.7745L62.1901 22.9219L54.7085 0.222656H50.4619L50.9344 1.55967L43.997 22.8922L43.5938 23.5443H46.6305L48.7743 16.575L55.668 16.5741ZM49.5703 13.8787L52.2183 5.63086L54.8919 13.8787H49.5703Z" fill="currentColor" />
          </svg>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-none text-balance">
            Conver is Generating $15.6M+ in Value
          </h1>
          <p className="text-xl md:text-2xl text-foreground/60 mt-6 leading-snug text-balance">
            3,000 users. 14 features. 826% ROI. Built by 9 people.
          </p>
          <p className="text-sm text-foreground/40 mt-8">
            <a href="https://datacomgroup.atlassian.net/wiki/people/62a65fd8188d08006fe06fc2" target="_blank" rel="noopener noreferrer" className={CITE_LINK}>Joe Thornley</a>
            {" — March 2026"}
          </p>
        </div>
      ),
    },

    {
      id: "kpis",
      label: "Key Metrics",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>At a glance</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            <KPI value="3,000+" label="Employees using Conver" />
            <KPI value="$15.6M" label="Annual value (conservative)" />
            <KPI value="826%" label="ROI (worst case)" />
            <KPI value="$5" label="Cost per user/month" />
            <KPI value="14" label="Features shipped" />
            <KPI value="30K+" label="Conversations to date" />
            <KPI value="13" label="AI models available" />
            <KPI value="9" label="Contributors" />
          </div>
          <p className="text-foreground/30 text-xs mt-8 text-center">
            All figures from <Cite href={`${CONF}/39929380876`}>Datacom Chat Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "problem",
      label: "Problem",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>The problem</p>
          <h2 className={H2}>Two bad options — until Conver</h2>
          <div className="space-y-4">
            <p className={BODY}>
              <strong className="text-foreground/80">Option A:</strong> Buy Microsoft Copilot at $50/user/month — $3.9M/year for 6,500 employees. Single vendor. Limited model choice.
            </p>
            <p className={BODY}>
              <strong className="text-foreground/80">Option B:</strong> Do nothing. Accept the growing risk of shadow AI — ungoverned tools exposing sensitive data.
            </p>
            <p className={`${BODY} mt-4`}>
              There was no way to give every employee access to GPT-4o, Claude, and Gemini in a secure, audited environment — until the Insights &amp; Analytics team built one.
            </p>
          </div>
        </div>
      ),
    },

    {
      id: "value",
      label: "Value",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Observation 1</p>
          <h2 className={H2}>$15.6M annual value — the conservative estimate</h2>
          <EfficiencyGainsChart />
          <p className="text-foreground/40 text-sm mt-4">
            Even the floor (1 hr/week) delivers 826% ROI against maximum investment.{" "}
            <Cite href={`${CONF}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "breakeven",
      label: "Break-even",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Observation 2</p>
          <div className={STAT}>0.1%</div>
          <p className={STAT_LABEL}>of an employee&apos;s time is all it takes to break even</p>
          <p className={`${BODY} mt-8`}>
            If Conver saves someone 5 minutes a day, the entire investment is paid for. With 30,000+ conversations already taking place, employees are demonstrably using AI every day.
          </p>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${CONF}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "cost",
      label: "Cost",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Observation 3</p>
          <h2 className={H2}>99% cheaper than Microsoft Copilot</h2>
          <CostComparisonChart />
          <p className="text-foreground/40 text-sm mt-4">
            Conver: ~$5/user/month with 13 models. Copilot: $50/user/month with one ecosystem.{" "}
            <Cite href={`${CONF}/39929380876`}>Business Case</Cite>
            {" | "}
            <Cite href={`${CONF}/40435482672`}>Hyperscaler T&amp;Cs</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "adoption",
      label: "Adoption",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Observation 4</p>
          <h2 className={H2}>600% year-over-year adoption growth</h2>
          <AdoptionGrowthChart />
          <p className="text-foreground/40 text-sm mt-4">
            16,462+ conversations. 54 power users. 73 core adopters. Organic — no mandate, no forced training.{" "}
            <Cite href={`${CONF}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "features",
      label: "Features",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Observation 5</p>
          <h2 className={H2}>14 features shipped by a team of 9</h2>
          <FeatureMaturityPieChart />
          <p className="text-foreground/40 text-sm mt-4">
            Multi-model chat, Code Interpreter, Memories, Autodocx, Knowledge Base, Zendesk SITC, SPP/OpenAir, and more. 10 additional features in pipeline.{" "}
            <Cite href={`${CONF}/40110391561`}>Knowledge Hub</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "investment",
      label: "Investment",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Observation 6</p>
          <h2 className={H2}>Total investment: $905K–$1.685M</h2>
          <ROIBarChart />
          <p className="text-foreground/40 text-sm mt-4">
            Azure hosting $180K–$360K. AI tokens $375K–$625K. Staff 4.0 FTE $350K–$700K. Infrastructure alone: $35K/year for 6,500 users.{" "}
            <Cite href={`${CONF}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "models",
      label: "Models",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Observation 7</p>
          <h2 className={H2}>13 AI models across 4 providers</h2>
          <ModelPortfolioChart />
          <p className="text-foreground/40 text-sm mt-4">
            GPT-4o, Claude 3.5 Sonnet, Gemini 2.0 Flash, o1, o3-mini, and more. No single-vendor lock-in.{" "}
            <Cite href={`${CONF}/40842133509`}>Token Consumption Audit</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "hiring",
      label: "Hiring",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Observation 8</p>
          <h2 className={H2}>Hiring avoidance compounds the value</h2>
          <p className={BODY}>
            Phase 1 targets IT Support, HR, and Software Development — departments with measurable gains in tickets resolved, code commits, and project velocity.
          </p>
          <p className={`${BODY} mt-4`}>
            If Conver enables teams to absorb 10% workload growth without hiring, and each avoided hire costs $100K loaded, just 10 avoided hires saves <strong className="text-foreground/80">$1M/year</strong> — from a platform that already exists.
          </p>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${CONF}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "proposal",
      label: "Proposal",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Proposal</p>
          <h2 className={H2}>Approve full rollout — lead the AI Capability Catalogue with Conver</h2>
          <ul className="list-disc list-inside space-y-4 text-foreground/60 text-base md:text-lg text-balance">
            <li>Approve $905K–$1.685M Year-1 budget — projected return $15.6M+</li>
            <li>Launch Phase 1 measurement in IT, HR, and Dev within 60 days</li>
            <li>Feature Conver as the anchor product in the AI Capability Vending Machine</li>
            <li>Complete token audit to move costs from &quot;estimated&quot; to &quot;audited&quot;</li>
            <li>Begin 90-day ISO 27001 programme to unlock commercialisation</li>
          </ul>
          <p className="text-foreground/40 text-sm mt-6">
            826% ROI in the worst case. Payback in under one month.
          </p>
        </div>
      ),
    },

    {
      id: "risks",
      label: "Risks",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Risks</p>
          <h2 className={H2}>Manageable — none are blockers</h2>
          <div className="space-y-5">
            <div>
              <p className="text-foreground/80 font-medium text-base md:text-lg">Token audit in progress</p>
              <p className={BODY}>1/156 runs complete. Cost projections are sound — audit strengthens them. <Cite href={`${CONF}/40842133509`}>Token Audit</Cite></p>
            </div>
            <div>
              <p className="text-foreground/80 font-medium text-base md:text-lg">Compliance programme ready to start</p>
              <p className={BODY}>ISO 27001 playbook documented. Starting it converts risk into competitive advantage. <Cite href={`${CONF}/40217739335`}>Playbook for Certification</Cite></p>
            </div>
            <div>
              <p className="text-foreground/80 font-medium text-base md:text-lg">Productivity needs departmental validation</p>
              <p className={BODY}>Phase 1 measurement converts the 1 hr/week assumption into audited fact within 60 days.</p>
            </div>
          </div>
        </div>
      ),
    },

    {
      id: "next-steps",
      label: "Next Steps",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Next steps</p>
          <h2 className={H2}>Six actions to full rollout</h2>
          <ol className="space-y-4 text-foreground/60 text-base md:text-lg">
            {[
              ["Approve rollout", "$905K–$1.685M delivers $15.6M+ Year 1. Payback <1 month."],
              ["Phase 1 measurement", "IT Support, HR, Dev. Validate savings within 60 days."],
              ["AI Capability Catalogue", "Lead with Conver as the strongest product."],
              ["Complete token audit", "155 remaining runs. Target: end of March 2026."],
              ["ISO 27001", "90-day playbook. Unlocks government & commercial clients."],
              ["Scale to 6,500", "Infrastructure ready. $5/user/month. $15.6M+ value."],
            ].map(([label, desc], i) => (
              <li key={i} className="flex gap-3">
                <span className="font-semibold text-foreground/30 shrink-0">{i + 1}.</span>
                <span><span className="text-foreground/80">{label}</span> — {desc}</span>
              </li>
            ))}
          </ol>
        </div>
      ),
    },

    {
      id: "citations",
      label: "Citations",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Citations</p>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Every claim traced to source</h2>
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-1">
            {[
              { doc: "Datacom Chat Business Case Production", author: "Joe Thornley", date: "13 Jan 2026", url: `${CONF}/39929380876`, slide: 4 },
              { doc: "Business Case Production", author: "Joe Thornley", date: "13 Jan 2026", url: `${CONF}/39929380876`, slide: 2 },
              { doc: "Business Case Production", author: "Joe Thornley", date: "13 Jan 2026", url: `${CONF}/39929380876`, slide: 5 },
              { doc: "Hyperscaler T&Cs for Commercialising Conver", author: "Joe Thornley", date: "21 Nov 2025", url: `${CONF}/40435482672`, slide: 6 },
              { doc: "Business Case Production", author: "Joe Thornley", date: "13 Jan 2026", url: `${CONF}/39929380876`, slide: 7 },
              { doc: "PROD Token Consumption Audit", author: "Harrison Bland", date: "4 Mar 2026", url: `${CONF}/40842133509`, slide: 10 },
              { doc: "Conver Knowledge Hub", author: "Harrison Bland", date: "16 Oct 2025", url: `${CONF}/40110391561`, slide: 8 },
              { doc: "Business Case Production", author: "Joe Thornley", date: "13 Jan 2026", url: `${CONF}/39929380876`, slide: 9 },
              { doc: "Conver Risk Review November 2025", author: "Joe Thornley", date: "18 Nov 2025", url: `${CONF}/40415953243`, slide: 13 },
              { doc: "Conver Playbook for Certification", author: "Joe Thornley", date: "6 Oct 2025", url: `${CONF}/40217739335`, slide: 13 },
              { doc: "Zendesk SITC Conver Integration", author: "Dipesh Trikam", date: "9 Feb 2026", url: `${CONF}/40747171868`, slide: 8 },
              { doc: "SPP/Open Air Conver Integration", author: "Dipesh Trikam", date: "4 Feb 2026", url: `${CONF}/40727773361`, slide: 8 },
            ].map((c, i) => (
              <div key={i} className="flex gap-2 py-1.5 border-b border-foreground/5 text-xs">
                <span className="text-foreground/25 w-5 text-right shrink-0">{i + 1}.</span>
                <div className="min-w-0">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className={`text-foreground/70 ${CITE_LINK}`}>{c.doc}</a>
                  <span className="text-foreground/30">{" — "}{c.author}, {c.date} — </span>
                  <button onClick={() => scrollToSlide(c.slide)} className={`text-foreground/40 cursor-pointer ${CITE_LINK}`}>Slide {c.slide}</button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-foreground/30 text-xs mt-6">117 Confluence pages reviewed read-only. No pages were edited.</p>
        </div>
      ),
    },

    {
      id: "close",
      label: "Close",
      content: (
        <div className={WRAP}>
          <h2 className={H2}>
            $15.6M in value. 826% ROI. 99% cheaper than alternatives. 14 features. 9 people built this.
          </h2>
          <p className={BODY}>
            Conver already answered whether AI delivers value at Datacom. 3,000+ employees use 13 models every day through a platform costing $5/user/month. The question now is how fast to scale.
          </p>
          <a
            href={`${CONF}/39929380876`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors duration-200 group mt-8"
          >
            <span className="border-b border-foreground/20 group-hover:border-foreground/60 transition-colors">
              Full Business Case on Confluence
            </span>
            <span className="text-foreground/30 group-hover:text-foreground/60 transition-colors">↗</span>
          </a>
        </div>
      ),
    },
  ];
}

export default function ConverValuePage() {
  const slides = buildSlides();
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const scrollingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observers: IntersectionObserver[] = [];
    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting && !scrollingRef.current) setActiveIndex(i); },
        { root: container, threshold: 0.5 },
      );
      obs.observe(ref);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [slides.length]);

  const scrollTo = (i: number, behavior: ScrollBehavior = "smooth") => {
    const el = refs.current[i];
    if (!el) return;
    scrollingRef.current = true;
    el.scrollIntoView({ behavior, block: "start" });
    setTimeout(() => { scrollingRef.current = false; }, 100);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        setActiveIndex((p) => { const n = Math.min(p + 1, slides.length - 1); scrollTo(n, "instant"); return n; });
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        setActiveIndex((p) => { const n = Math.max(p - 1, 0); scrollTo(n, "instant"); return n; });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  return (
    <div ref={containerRef} className="bg-background h-screen overflow-y-scroll" style={{ scrollSnapType: "y mandatory" }}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          id={`slide-${i + 1}`}
          ref={(el) => { refs.current[i] = el; }}
          className="h-screen w-full flex items-center justify-center px-6 md:px-16 shrink-0"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="container w-full flex flex-col items-center justify-center">
            {slide.content}
          </div>
        </div>
      ))}
      <nav className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-[10px] text-foreground">
        {slides.map((slide, i) => (
          <button key={slide.id} onClick={() => scrollTo(i)} aria-label={`Go to ${slide.label}`} className="block cursor-pointer">
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
