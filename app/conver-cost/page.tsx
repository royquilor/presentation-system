"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CostScenarioChart,
  CostBreakdownChart,
  CostComparisonChart,
  TokenCostAllocationChart,
  ROIMatrixChart,
  RadialGauge,
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

function firstSlide(s: string): number {
  return parseInt(s.match(/\d+/)?.[0] ?? "1", 10);
}

type Slide = { id: string; label: string; content: React.ReactNode };

const SOURCES: { claim: string; doc: string; author: string; date: string; url: string; slides: string }[] = [
  { claim: "Year-1 costs $905K–$1.685M, three cost scenarios, ROI matrix, pilot $5/user validation", doc: "Datacom Chat Business Case Production", author: "Joe Thornley", date: "13 Jan 2026", url: `${C}/39929380876`, slides: "2–6, 8–10" },
  { claim: "Token burn rate discrepancies, 1/156 audit runs complete", doc: "Conver PROD Token Consumption Audit", author: "Harrison Bland", date: "4 Mar 2026", url: `${C}/40842133509`, slides: "11" },
  { claim: "Copilot $50/user/month, Conver consumption-based pricing", doc: "Conver Knowledge Hub", author: "Harrison Bland", date: "16 Oct 2025", url: `${C}/40110391561`, slides: "7" },
  { claim: "Hyperscaler token pricing, commercialisation terms", doc: "Overview Hyperscaler T&Cs Commercialising Conver", author: "Joe Thornley", date: "21 Nov 2025", url: `${C}/40435482672`, slides: "5, 7" },
  { claim: "Token cost controls, daily per-user limits", doc: "Conver Backlog Snapshot Sept 2025", author: "Joe Thornley", date: "22 Sep 2025", url: `${C}/40166228081`, slides: "10" },
  { claim: "Audit methodology, token accounting path", doc: "Conver Audit Phase B v1", author: "Harrison Bland", date: "6 Mar 2026", url: `${C}/40850227234`, slides: "11" },
  { claim: "Pilot infrastructure actuals ($2,274/quarter)", doc: "Conver Pilot Production Server Migration", author: "Jing Ling", date: "8 Sep 2025", url: `${C}/40087617783`, slides: "4" },
  { claim: "7 production risks, Group Tech blockers", doc: "Conver Risk Review November 2025", author: "Joe Thornley", date: "18 Nov 2025", url: `${C}/40415953243`, slides: "11" },
];

function buildSlides(): Slide[] {
  return [
    {
      id: "title", label: "Title",
      content: (
        <div className={WRAP}>
          <svg className="h-5 w-auto text-foreground mb-8" viewBox="0 0 121.962 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Datacom">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.0564 0.21891L0.43748 1.26032V22.8676L0 23.583H7.54483C12.7502 23.583 17.1677 18.9856 17.1677 11.2315C17.1677 5.6055 14.5522 0.49189 9.11959 0.21891L0.0564 0.21891ZM4.24219 2.4082H6.73036C10.3114 2.4082 12.9508 4.74701 12.9508 11.1983C12.9508 19.2262 9.90551 20.7542 6.40053 20.7542H4.24219V2.4082ZM41.587 2.35066H46.1771L46.888 2.89927L47.6194 0.222656H32.1136L31.6172 2.92542L32.8297 2.35065H37.2053V22.793L36.8798 23.5543H41.9321L41.587 22.793L41.587 2.35066ZM76.6064 19.7684C75.464 21.2433 74.0738 21.9424 72.499 21.9424C68.5891 21.9424 66.4572 18.2253 66.4572 12.3595C66.4572 7.31446 68.1593 2.06125 72.3726 2.06125C74.0234 2.06125 75.6451 3.1612 76.5876 5.01526H76.9431L76.9379 1.45944C75.464 0.3612 74.0234 0 72.3469 0C66.8135 0 62.2422 3.88385 62.2422 12.8396C62.2422 19.872 66.3547 24 71.7898 24C73.4885 24 75.2922 23.9892 76.8149 22.9252L76.8209 19.5711L76.6064 19.7684ZM97.1166 11.8145C97.0918 6.49545 94.9582 0 87.7219 0C81.4006 0 77.7188 5.12527 77.7188 11.9513C77.7188 19.7396 81.5014 24 87.1126 24C93.3322 24 97.1413 18.5063 97.1166 11.8145M87.5674 2.06055C91.374 2.06055 92.8966 6.73526 92.8966 11.1624C92.8966 16.8579 91.1458 21.9417 87.235 21.9417C83.4284 21.9417 81.9297 17.4065 81.9297 12.9462C81.9297 5.25972 84.0351 2.06056 87.5674 2.06056M109.926 16.8298L103.459 0.210938H99.9405L100.257 0.920777L98.7536 22.5209L98.4922 23.5442H101.206L102.22 8.96052L108.284 23.5442H109.762L115.728 9.07948L116.882 23.5442H121.963L121.688 22.5642L119.767 0.813608L119.944 0.210947H116.531L109.926 16.8298ZM28.3078 16.5741L30.4824 23.5443H35.4151L34.829 22.9219L27.3466 0.222656H23.1025L23.575 1.55967L16.636 22.8922L16.2344 23.5443H19.2703L21.4149 16.575L28.3078 16.5741ZM22.2031 13.8787L24.8494 5.63086L27.5238 13.8787H22.2031ZM55.668 16.5741L57.8418 23.5443H62.7745L62.1901 22.9219L54.7085 0.222656H50.4619L50.9344 1.55967L43.997 22.8922L43.5938 23.5443H46.6305L48.7743 16.575L55.668 16.5741ZM49.5703 13.8787L52.2183 5.63086L54.8919 13.8787H49.5703Z" fill="currentColor" />
          </svg>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-none text-balance">
            The Real Cost of Conver
          </h1>
          <p className="text-xl md:text-2xl text-foreground/60 mt-6 leading-snug text-balance">
            Three scenarios, one incomplete audit, and what the data actually shows
          </p>
          <p className="text-sm text-foreground/40 mt-8">
            <a href="https://datacomgroup.atlassian.net/wiki/people/62a65fd8188d08006fe06fc2" target="_blank" rel="noopener noreferrer" className={CL}>Joe Thornley</a>
            {" — Sourced from "}
            <Cite href={`${C}/39929380876`}>8 Confluence documents</Cite>
            {" — March 2026"}
          </p>
        </div>
      ),
    },

    {
      id: "kpis", label: "Key Figures",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>At a glance</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            <KPI value="$905K" label="Year-1 minimum" />
            <KPI value="$1.7M" label="Year-1 maximum" />
            <KPI value="$5–$15" label="Per user/month range" />
            <KPI value="1/156" label="Audit runs complete" />
            <KPI value="$35K" label="Infrastructure/year" />
            <KPI value="$480K" label="Personnel (4 FTE)" />
            <KPI value="80%+" label="Tokens as % of variable" />
            <KPI value="826%" label="Worst-case ROI" />
          </div>
          <p className="text-foreground/30 text-xs mt-8 text-center">
            <Cite href={`${C}/39929380876`}>Business Case Production</Cite>
            {" | "}
            <Cite href={`${C}/40842133509`}>Token Audit</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "structure", label: "Cost Structure",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Cost structure</p>
          <h2 className={H2}>Three cost pillars — tokens dominate</h2>
          <CostBreakdownChart />
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-3 rounded-lg bg-foreground/[0.03]">
              <p className="text-foreground/80 font-semibold text-sm">Infrastructure</p>
              <p className="text-foreground/40 text-xs mt-1">~$35K/year for 6,500 users. Azure VMs, storage, Defender. Does not scale linearly.</p>
            </div>
            <div className="p-3 rounded-lg bg-foreground/[0.03]">
              <p className="text-foreground/80 font-semibold text-sm">Personnel</p>
              <p className="text-foreground/40 text-xs mt-1">4.0 FTE at ~$120K average. Product, Dev, Support, Governance. Fixed cost.</p>
            </div>
            <div className="p-3 rounded-lg bg-foreground/[0.03]">
              <p className="text-foreground/80 font-semibold text-sm">Tokens</p>
              <p className="text-foreground/40 text-xs mt-1">$390K–$1.17M variable. Charged back to LoBs monthly. Primary cost driver.</p>
            </div>
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case Production — Appendix: Financial Analysis</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "infrastructure", label: "Infrastructure",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Infrastructure costs</p>
          <div className={STAT}>$35K</div>
          <p className={STAT_SM}>per year for 6,500 users — $0.45/user/month</p>
          <div className="space-y-3 mt-8">
            {[
              { item: "Virtual Machines", pilot: "$1,614.66", scaled: "~$20,000" },
              { item: "Storage & Backup", pilot: "$427.75", scaled: "~$10,000" },
              { item: "Microsoft Defender", pilot: "$167.80", scaled: "~$3,000" },
              { item: "Other (networking, DNS)", pilot: "$64.38", scaled: "~$2,000" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-foreground/5 text-sm">
                <span className="text-foreground/70">{r.item}</span>
                <div className="flex gap-8">
                  <span className="text-foreground/40 w-24 text-right">Pilot: {r.pilot}</span>
                  <span className="text-foreground/70 w-24 text-right font-medium">Scaled: {r.scaled}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            Pilot actuals: $2,274.59/quarter (Apr–Jun 2025). Annualised: ~$9,098.{" "}
            <Cite href={`${C}/39929380876`}>Business Case</Cite>
            {" | "}
            <Cite href={`${C}/40087617783`}>Server Migration</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "tokens", label: "Token Pricing",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Token cost model</p>
          <h2 className={H2}>GPT-o3 is 5% of usage but 56% of cost</h2>
          <TokenCostAllocationChart />
          <div className="mt-6 p-4 rounded-lg bg-foreground/[0.03]">
            <p className="text-foreground/80 font-semibold text-sm mb-2">Blended cost calculation</p>
            <p className="text-foreground/50 text-xs leading-relaxed">
              Model mix: 70% GPT-4o-mini ($0.15/$0.60 per 1M tokens) · 25% GPT-4o ($2.50/$10.00) · 5% GPT-o3 ($15.00/$75.00).
              Input-to-output ratio: 1:3. Blended cost: ~$0.00886 NZD per 1,000 tokens. 1 page ≈ 750 tokens.
            </p>
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case — Token Cost Appendix</Cite>
            {" | "}
            <Cite href={`${C}/40435482672`}>Hyperscaler T&amp;Cs</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "scenarios", label: "Scenarios",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Three cost scenarios</p>
          <h2 className={H2}>$905K to $1.7M — depending on usage</h2>
          <CostScenarioChart />
          <div className="mt-6 p-4 rounded-lg border border-amber-500/20 bg-amber-500/[0.04]">
            <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm">The &quot;$5/user&quot; claim uses the lowest scenario</p>
            <p className="text-foreground/50 text-xs mt-1">
              Presentations cite &quot;$5/user/month&quot; — this is the low scenario from pilot data (actual July 2025).
              The medium projection is $10/user/month. The Business Case uses $10/user for its break-even calculations, not $5.
            </p>
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case Production — Cost Scenarios</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "copilot", label: "vs Copilot",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Cost comparison</p>
          <h2 className={H2}>$1.3M vs $3.9M — even at medium scenario</h2>
          <CostComparisonChart />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-foreground/[0.03]">
              <p className="text-foreground/80 font-semibold text-sm mb-1">Conver (medium)</p>
              <p className="text-foreground/50 text-xs">~$1.3M/year total. 13 models, 4 providers, consumption-based, can commercialise.</p>
            </div>
            <div className="p-4 rounded-lg bg-foreground/[0.03]">
              <p className="text-foreground/80 font-semibold text-sm mb-1">Microsoft Copilot</p>
              <p className="text-foreground/50 text-xs">~$3.9M/year ($50/user/month × 6,500 × 12). Single vendor, fixed licensing, no resale rights.</p>
            </div>
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case</Cite>
            {" | "}
            <Cite href={`${C}/40435482672`}>Hyperscaler T&amp;Cs</Cite>
            {" | "}
            <Cite href={`${C}/40110391561`}>Knowledge Hub</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "breakeven", label: "Break-even",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Break-even analysis</p>
          <div className={STAT}>0.1%</div>
          <p className={STAT_SM}>of an employee&apos;s time to break even</p>
          <div className="space-y-4 mt-8">
            <p className={BODY}>
              At $10/user/month (medium scenario), the variable cost for 250 users is $2,500/month. The productivity gain from just one employee saving $10,000/month covers 1,000 users.
            </p>
            <p className={BODY}>
              If the tool saves 5 minutes per day per employee, the entire investment is justified. With 30,000+ conversations already, usage is demonstrably real.
            </p>
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case — Break-Even Calculation</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "roi", label: "ROI Matrix",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>ROI projection matrix</p>
          <h2 className={H2}>826% ROI in the worst case — 8,520% in the best</h2>
          <ROIMatrixChart />
          <p className="text-foreground/40 text-sm mt-4">
            Rows = total Year-1 cost. Columns = productivity saved per employee per week.
            Even at maximum cost and minimum savings, ROI exceeds 826%.{" "}
            <Cite href={`${C}/39929380876`}>Business Case — ROI Matrix</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "controls", label: "Cost Controls",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Cost management</p>
          <h2 className={H2}>Consumption-based with chargeback</h2>
          <div className="space-y-4">
            {[
              { title: "Per-user token caps", desc: "Daily limits enforced per user. Access suspended until renewal cycle. Configurable daily, weekly, or monthly resets." },
              { title: "LoB chargeback", desc: "Each Line of Business is charged monthly for their employees' actual token consumption. No cross-subsidisation." },
              { title: "Power BI reporting", desc: "LoB owners receive reports detailing user counts, token consumption, and estimated costs for budget management." },
              { title: "Model-level controls", desc: "Expensive models (GPT-o3) can be restricted to specific users or use cases to control the blended cost." },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-foreground/[0.03]">
                <span className="text-foreground/20 font-semibold text-sm shrink-0 mt-0.5">{i + 1}.</span>
                <div>
                  <p className="text-foreground/80 font-medium text-sm">{c.title}</p>
                  <p className="text-foreground/40 text-xs mt-0.5">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case — Cost Controls</Cite>
            {" | "}
            <Cite href={`${C}/40166228081`}>Backlog Snapshot</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "audit", label: "Token Audit",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Token audit status</p>
          <h2 className={H2}>1 of 156 audit runs complete — costs unvalidated at scale</h2>
          <div className="flex items-center gap-8 justify-center">
            <RadialGauge value={1} max={156} label="1" sublabel="of 156 runs" color="#DE350B" />
          </div>
          <div className="mt-6 p-4 rounded-lg border border-red-500/20 bg-red-500/[0.04]">
            <p className="text-red-600 dark:text-red-400 font-semibold text-sm">Active investigation: unexpectedly high token burn rates</p>
            <p className="text-foreground/50 text-xs mt-1 leading-relaxed">
              The Token Consumption Audit (DAAAT-485) is investigating discrepancies where users experience higher token burn than expected for their selected models.
              Scope includes token counting methodology, model-specific rate configuration, and provider vs logged token comparison.
              Until this audit completes, the $5–$15/user cost projections are based on pilot-era assumptions, not validated production data.
            </p>
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40842133509`}>Token Consumption Audit</Cite>
            {" | "}
            <Cite href={`${C}/40850227234`}>Audit Phase B</Cite>
            {" | "}
            <Cite href={`${C}/40415953243`}>Risk Review</Cite>
          </p>
        </div>
      ),
    },

    {
      id: "defensible", label: "What's Defensible",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Assessment</p>
          <h2 className={H2}>What&apos;s defensible and what isn&apos;t</h2>
          <div className="space-y-3">
            {[
              { claim: "Infrastructure: ~$35K/year", status: "Verified", color: "bg-green-500/10 text-green-600 dark:text-green-400", note: "Based on pilot actuals, scaled. Infrastructure costs don't scale linearly with users." },
              { claim: "Personnel: 4.0 FTE at ~$480K", status: "Verified", color: "bg-green-500/10 text-green-600 dark:text-green-400", note: "Detailed breakdown in Business Case. 9 contributors, budgeted as 4.0 FTE." },
              { claim: "Total: $905K–$1.685M", status: "Verified", color: "bg-green-500/10 text-green-600 dark:text-green-400", note: "Arithmetic confirmed. Range covers three token scenarios." },
              { claim: "Per-user cost: $5/month", status: "Caution", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", note: "Lowest of three scenarios. Pilot data only. Token audit finding burn rate issues." },
              { claim: "Cheaper than Copilot", status: "Verified", color: "bg-green-500/10 text-green-600 dark:text-green-400", note: "True even at $15/user high scenario ($1.7M vs $3.9M). Structurally sound." },
              { claim: "826% ROI", status: "Caution", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", note: "Depends on unvalidated 1 hr/week productivity assumption. No survey or time study cited." },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-foreground/5">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5 ${r.color}`}>{r.status}</span>
                <div>
                  <p className="text-foreground/80 font-medium text-sm">{r.claim}</p>
                  <p className="text-foreground/40 text-xs mt-0.5">{r.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    {
      id: "citations", label: "Citations",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Citations</p>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">8 Confluence documents reviewed</h2>
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
          <p className="text-foreground/30 text-xs mt-4">Read-only. No Confluence pages were edited.</p>
        </div>
      ),
    },

    {
      id: "close", label: "Close",
      content: (
        <div className={WRAP}>
          <h2 className={H2}>
            The cost advantage over Copilot is real. The per-user figure needs the audit to finish.
          </h2>
          <p className={BODY}>
            Conver is structurally cheaper than Copilot at every scenario — $905K to $1.7M versus $3.9M.
            The infrastructure is validated from pilot actuals. The ROI is positive even at maximum cost.
            But the &quot;$5/user/month&quot; headline is the lowest of three scenarios, based on pilot data,
            and the token audit is finding burn rate discrepancies. Use $5–$15 as the range until the audit completes.
          </p>
          <a href={`${C}/39929380876`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors group mt-8">
            <span className="border-b border-foreground/20 group-hover:border-foreground/60 transition-colors">Full Business Case on Confluence</span>
            <span className="text-foreground/30 group-hover:text-foreground/60 transition-colors">↗</span>
          </a>
        </div>
      ),
    },
  ];
}

export default function ConverCostPage() {
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
