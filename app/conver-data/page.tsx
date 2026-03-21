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
  CoffeeBreakROI,
  WaffleChart,
  RadialGauge,
  FunnelChart,
  StackedValueBreakdown,
  DepartmentImpactBubbles,
  ShadowAIRiskGauge,
} from "@/components/charts";

const WRAP = "max-w-2xl w-full";
const LABEL = "text-sm font-semibold uppercase tracking-widest text-foreground/40 mb-4";
const H2 = "text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 md:mb-8 leading-tight text-balance";
const BODY = "text-foreground/60 text-base md:text-lg leading-relaxed text-balance";
const STAT = "text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-none";
const STAT_SM = "text-foreground/50 text-lg md:text-xl mt-2";
const CL = "underline decoration-foreground/0 hover:decoration-foreground/40 transition-all duration-200";
const C = "https://datacomgroup.atlassian.net/wiki/spaces/IA/pages";

function Cite({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={`text-foreground/40 text-sm ${CL}`}>{children}</a>;
}

function scrollToSlide(n: number) {
  document.getElementById(`slide-${n}`)?.scrollIntoView({ behavior: "instant", block: "start" });
}

function firstSlide(s: string): number {
  return parseInt(s.match(/\d+/)?.[0] ?? "1", 10);
}

type Slide = { id: string; label: string; content: React.ReactNode };

const SOURCES = [
  { claim: "ROI, costs, adoption, hiring avoidance, break-even", doc: "Datacom Chat Business Case Production", author: "Joe Thornley", date: "13 Jan 2026", url: `${C}/39929380876`, slides: "2, 4, 11, 14, 16, 18" },
  { claim: "13 models, 156 audit configurations, token costs", doc: "Conver PROD Token Consumption Audit", author: "Harrison Bland", date: "4 Mar 2026", url: `${C}/40842133509`, slides: "13, 15" },
  { claim: "Platform overview, adoption targets, 14 features", doc: "Conver Knowledge Hub", author: "Harrison Bland", date: "16 Oct 2025", url: `${C}/40110391561`, slides: "6, 11" },
  { claim: "7 production risks, severity, Group Tech blockers", doc: "Conver Risk Review November 2025", author: "Joe Thornley", date: "18 Nov 2025", url: `${C}/40415953243`, slides: "15" },
  { claim: "Commercialisation terms, Copilot cost comparison", doc: "Overview Hyperscaler T&Cs", author: "Joe Thornley", date: "21 Nov 2025", url: `${C}/40435482672`, slides: "10" },
  { claim: "Enterprise architecture, Azure WAF, microservices", doc: "Conver Platform Enterprise Architecture", author: "Dipesh Trikam", date: "12 Dec 2025", url: `${C}/40533983331`, slides: "17" },
  { claim: "Serverless strategy, trunk-based dev, feature flags", doc: "Conver Serverless Enterprise Architecture", author: "Dipesh Trikam", date: "3 Dec 2025", url: `${C}/40486469753`, slides: "17" },
  { claim: "ISO 27001, SOC 2 certification programme", doc: "Conver Playbook for Certification", author: "Joe Thornley", date: "6 Oct 2025", url: `${C}/40217739335`, slides: "17" },
  { claim: "90-day compliance roadmap", doc: "Pathway to Security and Compliance", author: "Joe Thornley", date: "6 Oct 2025", url: `${C}/40217313800`, slides: "17" },
  { claim: "Zendesk + SITC integration, 16 tools", doc: "Zendesk SITC Conver Integration", author: "Dipesh Trikam", date: "9 Feb 2026", url: `${C}/40747171868`, slides: "6" },
  { claim: "SPP/OpenAir integration", doc: "SPP/Open Air Conver Integration", author: "Dipesh Trikam", date: "4 Feb 2026", url: `${C}/40727773361`, slides: "6" },
  { claim: "Feature roadmap, DataScape agents", doc: "Roadmap Draft", author: "Jason Moss", date: "30 May 2025", url: `${C}/39636010283`, slides: "6" },
  { claim: "Backlog priorities, 115+ planned agents", doc: "Conver Backlog Snapshot Sept 2025", author: "Joe Thornley", date: "22 Sep 2025", url: `${C}/40166228081`, slides: "6" },
  { claim: "Code Interpreter QA findings", doc: "Conver Code Interpreter QA Jan 2026", author: "Kieran Sinclair", date: "29 Jan 2026", url: `${C}/40679800900`, slides: "15" },
  { claim: "Agent handoff architecture", doc: "Conver Intro Agent Handoffs", author: "Kieran Sinclair", date: "16 Jan 2026", url: `${C}/40653521063`, slides: "6" },
];

function buildSlides(): Slide[] {
  return [
    // 1. Title
    {
      id: "title", label: "Title",
      content: (
        <div className={WRAP}>
          <svg className="h-5 w-auto text-foreground mb-8" viewBox="0 0 121.962 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Datacom">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.0564 0.21891L0.43748 1.26032V22.8676L0 23.583H7.54483C12.7502 23.583 17.1677 18.9856 17.1677 11.2315C17.1677 5.6055 14.5522 0.49189 9.11959 0.21891L0.0564 0.21891ZM4.24219 2.4082H6.73036C10.3114 2.4082 12.9508 4.74701 12.9508 11.1983C12.9508 19.2262 9.90551 20.7542 6.40053 20.7542H4.24219V2.4082ZM41.587 2.35066H46.1771L46.888 2.89927L47.6194 0.222656H32.1136L31.6172 2.92542L32.8297 2.35065H37.2053V22.793L36.8798 23.5543H41.9321L41.587 22.793L41.587 2.35066ZM76.6064 19.7684C75.464 21.2433 74.0738 21.9424 72.499 21.9424C68.5891 21.9424 66.4572 18.2253 66.4572 12.3595C66.4572 7.31446 68.1593 2.06125 72.3726 2.06125C74.0234 2.06125 75.6451 3.1612 76.5876 5.01526H76.9431L76.9379 1.45944C75.464 0.3612 74.0234 0 72.3469 0C66.8135 0 62.2422 3.88385 62.2422 12.8396C62.2422 19.872 66.3547 24 71.7898 24C73.4885 24 75.2922 23.9892 76.8149 22.9252L76.8209 19.5711L76.6064 19.7684ZM97.1166 11.8145C97.0918 6.49545 94.9582 0 87.7219 0C81.4006 0 77.7188 5.12527 77.7188 11.9513C77.7188 19.7396 81.5014 24 87.1126 24C93.3322 24 97.1413 18.5063 97.1166 11.8145M87.5674 2.06055C91.374 2.06055 92.8966 6.73526 92.8966 11.1624C92.8966 16.8579 91.1458 21.9417 87.235 21.9417C83.4284 21.9417 81.9297 17.4065 81.9297 12.9462C81.9297 5.25972 84.0351 2.06056 87.5674 2.06056M109.926 16.8298L103.459 0.210938H99.9405L100.257 0.920777L98.7536 22.5209L98.4922 23.5442H101.206L102.22 8.96052L108.284 23.5442H109.762L115.728 9.07948L116.882 23.5442H121.963L121.688 22.5642L119.767 0.813608L119.944 0.210947H116.531L109.926 16.8298ZM28.3078 16.5741L30.4824 23.5443H35.4151L34.829 22.9219L27.3466 0.222656H23.1025L23.575 1.55967L16.636 22.8922L16.2344 23.5443H19.2703L21.4149 16.575L28.3078 16.5741ZM22.2031 13.8787L24.8494 5.63086L27.5238 13.8787H22.2031ZM55.668 16.5741L57.8418 23.5443H62.7745L62.1901 22.9219L54.7085 0.222656H50.4619L50.9344 1.55967L43.997 22.8922L43.5938 23.5443H46.6305L48.7743 16.575L55.668 16.5741ZM49.5703 13.8787L52.2183 5.63086L54.8919 13.8787H49.5703Z" fill="currentColor" />
          </svg>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-none text-balance">
            Conver by the Numbers
          </h1>
          <p className="text-xl md:text-2xl text-foreground/60 mt-6 leading-snug text-balance">
            15 ways to see why Datacom&apos;s AI platform is worth the investment
          </p>
          <p className="text-sm text-foreground/40 mt-8">
            <a href="https://datacomgroup.atlassian.net/wiki/people/62a65fd8188d08006fe06fc2" target="_blank" rel="noopener noreferrer" className={CL}>Joe Thornley</a>
            {" & "}
            <a href="https://datacomgroup.atlassian.net/wiki/spaces/IA" target="_blank" rel="noopener noreferrer" className={CL}>Jason Moss</a>
            {" — Insights & Analytics — March 2026"}
          </p>
        </div>
      ),
    },

    // 2. The Coffee Break
    {
      id: "coffee", label: "Coffee Break",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>The simplest way to see it</p>
          <h2 className={H2}>A coffee break pays for the entire platform</h2>
          <CoffeeBreakROI />
          <p className="text-foreground/40 text-sm mt-4">
            If Conver saves 5 minutes per employee per day, the entire annual investment is covered. That&apos;s one fewer search, one faster email, one auto-generated document.{" "}
            <Cite href={`${C}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    // 3. Shadow AI Gauge
    {
      id: "shadow-ai", label: "Shadow AI",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>The alternative</p>
          <h2 className={H2}>Without Conver, employees use ungoverned AI</h2>
          <ShadowAIRiskGauge />
          <p className={`${BODY} mt-4`}>
            This isn&apos;t hypothetical. ChatGPT, Gemini, and Claude are one browser tab away. Every employee who uses them without Conver creates unauditable data exposure. Conver replaces the risk with a governed alternative.
          </p>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case — Shadow AI Section</Cite>
          </p>
        </div>
      ),
    },

    // 4. Three Radial Gauges
    {
      id: "gauges", label: "ROI Gauges",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Three numbers that matter</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <RadialGauge value={826} max={10000} label="826%" sublabel="Worst-case ROI" />
            <RadialGauge value={15.6} max={78} label="$15.6M" sublabel="Conservative value" color="#00B8D9" />
            <RadialGauge value={9} max={20} label="9" sublabel="Contributors" color="#00875A" />
          </div>
          <p className="text-foreground/40 text-sm mt-4 text-center">
            <Cite href={`${C}/39929380876`}>Business Case Production</Cite>{" | "}<Cite href={`${C}/40842133509`}>Token Audit</Cite>
          </p>
        </div>
      ),
    },

    // 5. Funnel
    {
      id: "funnel", label: "Adoption Funnel",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Organic adoption</p>
          <h2 className={H2}>Nobody was told to use Conver. They chose it.</h2>
          <FunnelChart />
          <p className="text-foreground/40 text-sm mt-4">
            54 power users discovered the tool, tried it, and now use it multiple times daily. Scale this to 6,500 and measure the impact.{" "}
            <Cite href={`${C}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    // 6. Waffle: Feature shipped
    {
      id: "waffle-features", label: "Features",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Delivered vs. planned</p>
          <h2 className={H2}>14 features shipped. 10 more coming.</h2>
          <div className="flex justify-center">
            <WaffleChart filled={14} total={24} label="Platform Features (24 total)" sublabel="Each square = 1 feature · Blue = shipped · Grey = planned" />
          </div>
          <p className={`${BODY} mt-4`}>
            Chat, Code Interpreter, Memories, Autodocx, Knowledge Base, Zendesk, SPP, Agents, Brand Agent, FAQ Bot, and more. 3.5 features per person on a 4-person team.
          </p>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40110391561`}>Knowledge Hub</Cite>{" | "}<Cite href={`${C}/39636010283`}>Roadmap</Cite>
          </p>
        </div>
      ),
    },

    // 7. Stacked cost breakdown
    {
      id: "cost-stack", label: "Cost Breakdown",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Where the money goes</p>
          <h2 className={H2}>$1.685M total — here&apos;s every dollar</h2>
          <StackedValueBreakdown />
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    // 8. The $5 Stat
    {
      id: "five-dollars", label: "$5",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Per user, per month</p>
          <div className={STAT}>$5</div>
          <p className={STAT_SM}>gets you GPT-4o, Claude 3.5, Gemini 2.0 — and 10 more models</p>
          <p className={`${BODY} mt-8`}>
            Microsoft charges $50 for Copilot. That&apos;s $3.9M/year for 6,500 employees — with one vendor&apos;s models only. Conver delivers 13 models from 4 providers at 1/10th the price.
          </p>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case</Cite>{" | "}<Cite href={`${C}/40435482672`}>Hyperscaler T&Cs</Cite>
          </p>
        </div>
      ),
    },

    // 9. Department Impact Bubbles
    {
      id: "departments", label: "Departments",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Phase 1 targets</p>
          <h2 className={H2}>IT, HR, and Dev go first — measurable results in 60 days</h2>
          <DepartmentImpactBubbles />
          <p className="text-foreground/40 text-sm mt-4">
            Track tickets resolved per person, code commits, project velocity, and hiring avoidance. Hard numbers, not estimates.{" "}
            <Cite href={`${C}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    // 10. Cost comparison — horizontal bars
    {
      id: "cost-bars", label: "vs Copilot",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Side by side</p>
          <h2 className={H2}>Every way to compare costs says the same thing</h2>
          <CostComparisonChart />
          <p className="text-foreground/40 text-sm mt-4">
            Infrastructure alone: $35K vs. $3.9M. Even the maximum Year-1 investment is less than half of Copilot&apos;s annual licensing.{" "}
            <Cite href={`${C}/39929380876`}>Business Case</Cite>
          </p>
        </div>
      ),
    },

    // 11. Adoption bars
    {
      id: "adoption", label: "Adoption",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Conversation volume</p>
          <h2 className={H2}>600% year-over-year growth — before any rollout</h2>
          <AdoptionGrowthChart />
          <p className="text-foreground/40 text-sm mt-4">
            16,462+ conversations. Q2 2025 alone generated 10,090 conversations — more than the entirety of 2024.{" "}
            <Cite href={`${C}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    // 12. Efficiency scenarios
    {
      id: "scenarios", label: "Scenarios",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Value scenarios</p>
          <h2 className={H2}>Pick any scenario — the ROI is overwhelming</h2>
          <EfficiencyGainsChart />
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    // 13. Model Portfolio
    {
      id: "models", label: "Models",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>No vendor lock-in</p>
          <h2 className={H2}>13 models. 4 providers. Best tool for the job.</h2>
          <ModelPortfolioChart />
          <p className={`${BODY} mt-4`}>
            When OpenAI releases o4, add it. When Anthropic ships Claude 4, add it. Conver&apos;s architecture means switching models is a configuration change — not a procurement exercise.
          </p>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40842133509`}>Token Consumption Audit</Cite>
          </p>
        </div>
      ),
    },

    // 14. The 10x Hiring Slide
    {
      id: "hiring", label: "Hiring",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>The hidden multiplier</p>
          <div className="grid grid-cols-2 gap-8 md:gap-12">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-foreground">10</p>
              <p className="text-foreground/50 text-sm mt-2">hires avoided at $100K each</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-foreground">$1M</p>
              <p className="text-foreground/50 text-sm mt-2">saved annually — on top of ROI</p>
            </div>
          </div>
          <p className={`${BODY} mt-8`}>
            If Conver helps teams absorb 10% more workload without hiring, and each avoided hire costs $100K loaded, 10 avoided hires = $1M/year. This isn&apos;t in the $15.6M figure — it&apos;s incremental.
          </p>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case Production — Hiring Avoidance</Cite>
          </p>
        </div>
      ),
    },

    // 15. Waffle: Audit Progress
    {
      id: "audit", label: "Audit",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>One thing left to prove</p>
          <h2 className={H2}>Token audit: 1 of 156 runs complete</h2>
          <div className="flex justify-center">
            <WaffleChart filled={1} total={100} label="Audit Progress (156 runs, shown as 100 squares)" sublabel="Blue = complete · Grey = remaining · Finishing this validates every cost projection" />
          </div>
          <p className={`${BODY} mt-4`}>
            The audit will validate per-model token consumption across 13 models and 6 scenarios. Completing it moves costs from &quot;projected&quot; to &quot;audited.&quot;
          </p>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40842133509`}>Token Consumption Audit</Cite>
          </p>
        </div>
      ),
    },

    // 16. ROI Bar Chart
    {
      id: "roi-bars", label: "ROI Bars",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>The full picture</p>
          <h2 className={H2}>Every bar tells the same story: invest</h2>
          <ROIBarChart />
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    // 17. Feature Maturity
    {
      id: "maturity", label: "Maturity",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Platform depth</p>
          <h2 className={H2}>This isn&apos;t a proof of concept — it&apos;s production</h2>
          <div className="flex justify-center">
            <FeatureMaturityPieChart />
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            14 features serving real workflows: document generation, code analysis, knowledge base queries, customer support automation, and more.{" "}
            <Cite href={`${C}/40110391561`}>Knowledge Hub</Cite>
          </p>
        </div>
      ),
    },

    // 18. The Single Number
    {
      id: "single-number", label: "Payback",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Payback period</p>
          <div className="flex items-baseline gap-2">
            <span className="text-7xl md:text-8xl lg:text-9xl font-bold text-foreground leading-none">&lt;1</span>
            <span className="text-2xl md:text-3xl text-foreground/50 font-medium">month</span>
          </div>
          <p className={`${BODY} mt-8`}>
            In every scenario — conservative, moderate, optimistic — the investment pays for itself in under one month. There is no scenario where this loses money.
          </p>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case Production — ROI Matrix</Cite>
          </p>
        </div>
      ),
    },

    // 19. Citations
    {
      id: "citations", label: "Citations",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Citations</p>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Every claim traced to source</h2>
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-1">
            {SOURCES.map((s, i) => (
              <div key={i} className="flex gap-2 py-1.5 border-b border-foreground/5 text-xs">
                <span className="text-foreground/25 w-5 text-right shrink-0">{i + 1}.</span>
                <div className="min-w-0">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={`text-foreground/70 ${CL}`}>{s.doc}</a>
                  <span className="text-foreground/30"> — {s.author}, {s.date} — </span>
                  <button onClick={() => scrollToSlide(firstSlide(s.slides))} className={`text-foreground/40 cursor-pointer ${CL}`}>Slides {s.slides}</button>
                  <p className="text-foreground/25 mt-0.5">{s.claim}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-foreground/30 text-xs mt-4">117 Confluence pages reviewed read-only. No pages were edited.</p>
        </div>
      ),
    },

    // 20. Close
    {
      id: "close", label: "Close",
      content: (
        <div className={WRAP}>
          <h2 className={H2}>
            A coffee break&apos;s worth of time saved, per person, per day. That pays for everything. Everything else is upside.
          </h2>
          <p className={BODY}>
            826% worst-case ROI. 13 models at $5/user. 14 features. 3,000+ organic users. Sub-1-month payback. 9 people built this. The only question is how fast to scale.
          </p>
          <a
            href={`${C}/39929380876`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors group mt-8"
          >
            <span className="border-b border-foreground/20 group-hover:border-foreground/60 transition-colors">Full Business Case on Confluence</span>
            <span className="text-foreground/30 group-hover:text-foreground/60 transition-colors">↗</span>
          </a>
        </div>
      ),
    },
  ];
}

export default function ConverDataPage() {
  const slides = buildSlides();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const scrolling = useRef(false);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const obs: IntersectionObserver[] = [];
    refs.current.forEach((el, i) => {
      if (!el) return;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting && !scrolling.current) setActive(i); }, { root: c, threshold: 0.5 });
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, [slides.length]);

  const go = (i: number, b: ScrollBehavior = "smooth") => {
    const el = refs.current[i];
    if (!el) return;
    scrolling.current = true;
    el.scrollIntoView({ behavior: b, block: "start" });
    setTimeout(() => { scrolling.current = false; }, 100);
  };

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") setActive((p) => { const n = Math.min(p + 1, slides.length - 1); go(n, "instant"); return n; });
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") setActive((p) => { const n = Math.max(p - 1, 0); go(n, "instant"); return n; });
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [slides.length]);

  return (
    <div ref={containerRef} className="bg-background h-screen overflow-y-scroll" style={{ scrollSnapType: "y mandatory" }}>
      {slides.map((s, i) => (
        <div key={s.id} id={`slide-${i + 1}`} ref={(el) => { refs.current[i] = el; }} className="h-screen w-full flex items-center justify-center px-6 md:px-16 shrink-0" style={{ scrollSnapAlign: "start" }}>
          <div className="container w-full flex flex-col items-center justify-center">{s.content}</div>
        </div>
      ))}
      <nav className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-[10px] text-foreground">
        {slides.map((s, i) => (
          <button key={s.id} onClick={() => go(i)} aria-label={`Go to ${s.label}`} className="block cursor-pointer">
            <motion.span className="block h-[2px] origin-right rounded-full" animate={{ scaleX: active === i ? 1 : 0.5, backgroundColor: active === i ? "currentColor" : "color-mix(in srgb, currentColor 25%, transparent)" }} transition={reduced ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }} style={{ width: "16px" }} />
          </button>
        ))}
      </nav>
    </div>
  );
}
