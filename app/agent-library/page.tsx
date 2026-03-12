"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AgentLibPerformanceChart,
  AgentLibSecurityChart,
  AgentLibWAFChart,
  AgentLibDevVelocityChart,
  WaffleChart,
  RadialGauge,
} from "@/components/charts";

const WRAP = "max-w-2xl w-full";
const LABEL = "text-sm font-semibold uppercase tracking-widest text-foreground/40 mb-4";
const H2 = "text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 md:mb-8 leading-tight text-balance";
const BODY = "text-foreground/60 text-base md:text-lg leading-relaxed text-balance";
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

const SOURCES: { doc: string; author: string; date: string; url: string; topics: string; slides: string }[] = [
  { doc: "Agent Library (Parent Page)", author: "Dipesh Trikam", date: "17 Sep 2025", url: `${C}/40043905712`, topics: "Overview, team, page tree", slides: "2" },
  { doc: "Agent Library Overview", author: "Dipesh Trikam", date: "15 Sep 2025", url: `${C}/40062156834`, topics: "Purpose, architecture, WAF 8.5/10, 70% cost reduction", slides: "2, 3, 6" },
  { doc: "Getting Started", author: "Dipesh Trikam", date: "13 Sep 2025", url: `${C}/40061763856`, topics: "Developer onboarding, prerequisites", slides: "2" },
  { doc: "Auth and Authorisation", author: "Dipesh Trikam", date: "13 Sep 2025", url: `${C}/40061698297`, topics: "Azure AD SSO, RBAC, JWT, MSAL.js", slides: "7, 9" },
  { doc: "API Guide", author: "Dipesh Trikam", date: "13 Sep 2025", url: `${C}/40061796665`, topics: "Endpoints, auth, data models", slides: "9" },
  { doc: "Deployment Guide Production", author: "Dipesh Trikam", date: "13 Sep 2025", url: `${C}/40062255105`, topics: "Infra, CI/CD, environment vars", slides: "9" },
  { doc: "Operations Runbook", author: "Dipesh Trikam", date: "13 Sep 2025", url: `${C}/40062189618`, topics: "Monitoring, alerting, incidents", slides: "9" },
  { doc: "Troubleshooting", author: "Dipesh Trikam", date: "13 Sep 2025", url: `${C}/40062222342`, topics: "Common issues, error patterns", slides: "11" },
  { doc: "Glossary", author: "Dipesh Trikam", date: "13 Sep 2025", url: `${C}/40062222353`, topics: "Definitions, terminology", slides: "2" },
  { doc: "Change Log", author: "Dipesh Trikam", date: "13 Sep 2025", url: `${C}/40139980869`, topics: "Architecture evolution, versions", slides: "9, 15" },
  { doc: "MongoDB Schema Changes", author: "Dipesh Trikam", date: "17 Nov 2025", url: `${C}/40411627578`, topics: "Schema updates, migration, cost", slides: "9" },
  { doc: "Application Insights", author: "Dipesh Trikam", date: "25 Nov 2025", url: `${C}/40450850911`, topics: "Telemetry, 10% sampling, cost control", slides: "4" },
  { doc: "CISO Approval Request", author: "Jason Moss", date: "9 Dec 2025", url: `${C}/40516616397`, topics: "18 findings, 6 residual risks", slides: "7, 10" },
  { doc: "Architecture", author: "Dipesh Trikam", date: "17 Sep 2025", url: `${C}/40061796638`, topics: "Component breakdown, data flows", slides: "9" },
  { doc: "High-Level Architecture", author: "Dipesh Trikam", date: "21 Aug 2025", url: `${C}/40045674637`, topics: "5 ADRs, dual-DB, Azure PaaS", slides: "9" },
  { doc: "Shared Agent Access System Tech Spec", author: "Dipesh Trikam", date: "26 Aug 2025", url: `${C}/40063139947`, topics: "DB schema, API, state machine", slides: "9" },
  { doc: "Agent Access System", author: "Dipesh Trikam", date: "28 Aug 2025", url: `${C}/40070512927`, topics: "5 access types, 3-tab UX, ACL", slides: "9" },
  { doc: "Approval Workflow", author: "Johnson Paku", date: "8 Aug 2025", url: `${C}/40011694081`, topics: "Manual VM-edit process (archived)", slides: "14" },
  { doc: "Complete Features Timeline", author: "Dipesh Trikam", date: "27 Aug 2025", url: `${C}/40066023621`, topics: "150+ features, 50+ endpoints, 34 days", slides: "5, 15" },
  { doc: "Prompt Architecture", author: "Dipesh Trikam", date: "13 Jan 2026", url: `${C}/40634745263`, topics: "ACDE templates, ElevenLabs", slides: "9" },
  { doc: "Versioning System", author: "Dipesh Trikam", date: "16 Oct 2025", url: `${C}/40255914017`, topics: "Single-duplicate model, versions[]", slides: "9" },
  { doc: "Feature Flagging Guide", author: "Dipesh Trikam", date: "21 Oct 2025", url: `${C}/40269742249`, topics: "CosmosDB, env vars, fail-closed", slides: "9" },
  { doc: "MCP Server Integration", author: "Dipesh Trikam", date: "27 Oct 2025", url: `${C}/40283635932`, topics: "AWS→Azure APIM migration", slides: "9" },
  { doc: "Mobile Responsiveness Test Plan", author: "Kieran Sinclair", date: "25 Feb 2026", url: `${C}/40469135533`, topics: "4 admin pages, nav bug", slides: "11" },
  { doc: "Audit Dashboard Test Plan", author: "Kieran Sinclair", date: "3 Dec 2025", url: `${C}/40469921930`, topics: "Functional, timezone defect", slides: "10, 11" },
  { doc: "Reports Dashboard Test Plan", author: "Kieran Sinclair", date: "28 Nov 2025", url: `${C}/40468283393`, topics: "5 sections accurate", slides: "11" },
  { doc: "Security Remediation Report", author: "Dipesh Trikam", date: "14 Nov 2025", url: `${C}/40398848336`, topics: "18 findings, 4 HIGH fixed", slides: "7, 10" },
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
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-none text-balance">Agent Library</h1>
          <p className="text-xl md:text-2xl text-foreground/60 mt-6 leading-snug text-balance">
            Documentation Analysis &amp; Platform Assessment — 27 Confluence pages reviewed
          </p>
          <p className="text-sm text-foreground/40 mt-8">
            <a href="https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073" target="_blank" rel="noopener noreferrer" className={CL}>Dipesh Trikam</a>
            {" (23 pages) & team — Insights & Analytics — March 2026"}
          </p>
        </div>
      ),
    },

    // 2. Context
    {
      id: "context", label: "Context",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Context</p>
          <h2 className={H2}>Enterprise AI agent platform on Azure</h2>
          <p className={BODY}>
            The Agent Library is Datacom&apos;s enterprise-grade serverless platform for discovering, sharing, and governing AI agents and prompts. Built on Azure Functions, CosmosDB, and React — it also serves as a reference template for future enterprise Azure projects. 150+ features shipped in 34 days by a small EAS team led by Dipesh Trikam.
          </p>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40062156834`}>Overview</Cite>{" | "}<Cite href={`${C}/40043905712`}>Parent Page</Cite>
          </p>
        </div>
      ),
    },

    // 3. KPIs
    {
      id: "kpis", label: "Key Metrics",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Key metrics</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            <KPI value="150+" label="Features shipped" />
            <KPI value="50+" label="API endpoints" />
            <KPI value="12ms" label="Avg response time" />
            <KPI value="99.9%" label="Availability" />
            <KPI value="8.5/10" label="WAF score (A-)" />
            <KPI value="$50/mo" label="Database cost" />
            <KPI value="34" label="Days to build" />
            <KPI value="27" label="Docs reviewed" />
          </div>
          <p className="text-foreground/30 text-xs mt-8 text-center">
            <Cite href={`${C}/40062156834`}>Overview</Cite>{" | "}<Cite href={`${C}/40066023621`}>Features Timeline</Cite>{" | "}<Cite href={`${C}/40411627578`}>Schema Changes</Cite>
          </p>
        </div>
      ),
    },

    // 4. Performance
    {
      id: "performance", label: "Performance",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Performance</p>
          <h2 className={H2}>5,000ms → 12ms — 400x faster</h2>
          <AgentLibPerformanceChart />
          <p className="text-foreground/40 text-sm mt-4">
            VNet peering and optimised database connectivity eliminated 99.8% of API latency. JWT validation: &lt;12ms. Rating calculation: 8ms. ACL check: 3ms.{" "}
            <Cite href={`${C}/40062156834`}>Overview</Cite>{" | "}<Cite href={`${C}/40061796665`}>API Guide</Cite>
          </p>
        </div>
      ),
    },

    // 5. Dev Velocity
    {
      id: "velocity", label: "Velocity",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Development velocity</p>
          <h2 className={H2}>150+ features in 5 weeks</h2>
          <AgentLibDevVelocityChart />
          <p className="text-foreground/40 text-sm mt-4">
            Peak: 35 features/week. 50+ API endpoints. 50,000+ lines of code. Peak user satisfaction: 4.8/5 stars.{" "}
            <Cite href={`${C}/40066023621`}>Features Timeline</Cite>
          </p>
        </div>
      ),
    },

    // 6. WAF Score
    {
      id: "waf", label: "WAF",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Architecture quality</p>
          <h2 className={H2}>Azure WAF 8.5/10 — Security leads at 9/10</h2>
          <AgentLibWAFChart />
          <p className="text-foreground/40 text-sm mt-4">
            5 Architecture Decision Records (ADRs): non-monorepo, Vite frontend, Azure Functions backend, dual-DB (Cosmos + MongoDB), APIM gateway.{" "}
            <Cite href={`${C}/40062156834`}>Overview</Cite>{" | "}<Cite href={`${C}/40045674637`}>High-Level Architecture</Cite>
          </p>
        </div>
      ),
    },

    // 7. Security
    {
      id: "security", label: "Security",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Security posture</p>
          <h2 className={H2}>18 pen test findings — 4 HIGH fixed, CISO submitted</h2>
          <div className="flex justify-center">
            <AgentLibSecurityChart />
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40398848336`}>Remediation Report</Cite>{" | "}<Cite href={`${C}/40516616397`}>CISO Approval</Cite>
          </p>
        </div>
      ),
    },

    // 8. Cost
    {
      id: "cost", label: "Cost",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Cost efficiency</p>
          <h2 className={H2}>70% cost reduction — $50/month database</h2>
          <div className="grid grid-cols-2 gap-8 md:gap-12">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-foreground">70%</p>
              <p className="text-foreground/50 text-sm mt-2">Cost reduction via serverless</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-foreground">$50</p>
              <p className="text-foreground/50 text-sm mt-2">Monthly database cost</p>
            </div>
          </div>
          <p className={`${BODY} mt-8`}>
            Consumption-based serverless pricing on Azure. Agent Library adds $0–5/month to the existing Cosmos DB instance. Application Insights at 10% sampling for cost control.
          </p>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40062156834`}>Overview</Cite>{" | "}<Cite href={`${C}/40411627578`}>Schema Changes</Cite>{" | "}<Cite href={`${C}/40450850911`}>App Insights</Cite>
          </p>
        </div>
      ),
    },

    // 9. Architecture
    {
      id: "architecture", label: "Architecture",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Tech stack</p>
          <h2 className={H2}>Serverless Azure — dual database, APIM gateway</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Frontend", items: "React 18, Vite, Tailwind, Radix UI, MSAL.js" },
              { label: "Backend", items: "Azure Functions v4, Node.js 18+, Joi, jwks-rsa" },
              { label: "Data", items: "Cosmos DB (MongoDB API) + CosmosDB (public), Blob Storage" },
              { label: "Infra", items: "Static Web Apps, APIM, VNet peering, Key Vault" },
            ].map((t, i) => (
              <div key={i} className="p-4 rounded-lg bg-foreground/[0.03]">
                <p className="text-foreground/80 font-semibold text-sm">{t.label}</p>
                <p className="text-foreground/50 text-xs mt-2">{t.items}</p>
              </div>
            ))}
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40061796638`}>Architecture</Cite>{" | "}<Cite href={`${C}/40045674637`}>High-Level Architecture</Cite>
          </p>
        </div>
      ),
    },

    // 10. Documentation Audit
    {
      id: "audit", label: "Audit",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Documentation audit</p>
          <h2 className={H2}>5 critical issues found across 27 pages</h2>
          <div className="space-y-3">
            {[
              { issue: "2 misfiled documents (ACDE + SoWGen)", impact: "7.4% of docs are wrong project", severity: "Critical" },
              { issue: "Conflicting access specs (AGLIB-017 vs 018)", impact: "Cannot determine correct behaviour", severity: "Critical" },
              { issue: "Obsolete manual VM workflow (AGLIB-019)", impact: "Could bypass security controls", severity: "Critical" },
              { issue: "Production status unknown (target: Jan 2026)", impact: "No confirmation of go-live", severity: "High" },
              { issue: "Multiple placeholder values in 4+ docs", impact: "Guides not fully usable", severity: "High" },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-foreground/[0.03]">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${r.severity === "Critical" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}>{r.severity}</span>
                <div>
                  <p className="text-foreground/80 font-medium text-sm">{r.issue}</p>
                  <p className="text-foreground/40 text-sm">{r.impact}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40063139947`}>Access Spec</Cite>{" | "}<Cite href={`${C}/40070512927`}>Access System</Cite>{" | "}<Cite href={`${C}/40516616397`}>CISO Approval</Cite>
          </p>
        </div>
      ),
    },

    // 11. QA Defects
    {
      id: "qa", label: "QA",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>QA findings</p>
          <h2 className={H2}>10 defects — 4 HIGH severity</h2>
          <div className="space-y-3">
            {[
              { item: "Settings button cut off in mobile landscape", severity: "HIGH" },
              { item: "Rejected prompt missing from audit log", severity: "HIGH" },
              { item: "Admin panel timezone mismatch — today's logs invisible", severity: "HIGH" },
              { item: "Cannot select today's date in date picker", severity: "HIGH" },
              { item: "Missing mobile UI name/icon", severity: "MEDIUM" },
              { item: "Date range resets on page refresh", severity: "MEDIUM" },
            ].map((q, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-foreground/5">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${q.severity === "HIGH" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"}`}>{q.severity}</span>
                <span className="text-foreground/60 text-sm">{q.item}</span>
              </div>
            ))}
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40469135533`}>Mobile Test Plan</Cite>{" | "}<Cite href={`${C}/40469921930`}>Audit Dashboard QA</Cite>{" | "}<Cite href={`${C}/40468283393`}>Reports QA</Cite>
          </p>
        </div>
      ),
    },

    // 12. Authorship
    {
      id: "authors", label: "Authors",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Authorship</p>
          <h2 className={H2}>85% authored by one person</h2>
          <div className="flex justify-center">
            <WaffleChart filled={23} total={27} label="Pages by Author (27 total)" sublabel="Blue = Dipesh Trikam (23) · Grey = Other (Kieran 3, Johnson 2, Jason 1)" />
          </div>
          <p className={`${BODY} mt-4`}>
            Knowledge concentration risk: if Dipesh is unavailable, architecture, integration, and security documentation has no backup author. Recommend assigning secondary page owners.
          </p>
        </div>
      ),
    },

    // 13. Gauges
    {
      id: "gauges", label: "Gauges",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Platform health at a glance</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <RadialGauge value={99.9} max={100} label="99.9%" sublabel="Availability" />
            <RadialGauge value={8.5} max={10} label="8.5/10" sublabel="WAF Score" color="#00B8D9" />
            <RadialGauge value={500} max={1000} label="500+" sublabel="Concurrent users" color="#00875A" />
          </div>
          <p className="text-foreground/40 text-sm mt-4 text-center">
            <Cite href={`${C}/40062156834`}>Overview</Cite>{" | "}<Cite href={`${C}/40061796665`}>API Guide</Cite>
          </p>
        </div>
      ),
    },

    // 14. Next Steps
    {
      id: "next-steps", label: "Next Steps",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Recommended actions</p>
          <h2 className={H2}>6 prioritised actions</h2>
          <ol className="space-y-4 text-foreground/60 text-base md:text-lg">
            {[
              ["Resolve conflicting access specs", "AGLIB-017 vs 018 — determine canonical model with Dipesh"],
              ["Archive misfiled documents", "AGLIB-019 (obsolete), 021 (ACDE), 024 (SoWGen)"],
              ["Confirm production status", "Target was Jan 2026 — 2 months overdue for documentation"],
              ["Fill placeholder values", "Repository URLs, phone numbers, domain names in 4+ docs"],
              ["Fix 4 HIGH QA defects", "Mobile nav, audit log, timezone, date picker"],
              ["Establish documentation governance", "Assign page owners, quarterly review cadence"],
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

    // 15. Timeline
    {
      id: "timeline", label: "Timeline",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Project timeline</p>
          <h2 className={H2}>August 2025 → February 2026</h2>
          <div className="space-y-3">
            {[
              { date: "Jul–Aug 2025", label: "34-day feature sprint — 150+ features", done: true },
              { date: "Aug–Sep 2025", label: "Core docs, architecture, deployment guides", done: true },
              { date: "Oct 2025", label: "Versioning, feature flags, MCP integration", done: true },
              { date: "Nov 2025", label: "Security remediation, schema changes, QA plans", done: true },
              { date: "Dec 2025", label: "CISO approval submitted", done: true },
              { date: "Jan 2026", label: "Target production go-live (status: unknown)", done: false },
              { date: "Feb 2026", label: "Mobile responsiveness testing update", done: true },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full shrink-0 ${m.done ? "bg-[#002BFE]" : "border-2 border-foreground/30"}`} />
                <span className="text-foreground/40 text-sm w-24 shrink-0">{m.date}</span>
                <span className={`text-sm ${m.done ? "text-foreground/70" : "text-foreground/40 italic"}`}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    // 16. Citations
    {
      id: "citations", label: "Citations",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Citations</p>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">27 Confluence documents reviewed</h2>
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-1">
            {SOURCES.map((s, i) => (
              <div key={i} className="flex gap-2 py-1.5 border-b border-foreground/5 text-xs">
                <span className="text-foreground/25 w-5 text-right shrink-0">{i + 1}.</span>
                <div className="min-w-0">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={`text-foreground/70 ${CL}`}>{s.doc}</a>
                  <span className="text-foreground/30"> — {s.author}, {s.date} — </span>
                  <button onClick={() => scrollToSlide(firstSlide(s.slides))} className={`text-foreground/40 cursor-pointer ${CL}`}>Slides {s.slides}</button>
                  <p className="text-foreground/25 mt-0.5">{s.topics}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-foreground/30 text-xs mt-4">Read-only. No Confluence pages were edited.</p>
        </div>
      ),
    },

    // 17. Close
    {
      id: "close", label: "Close",
      content: (
        <div className={WRAP}>
          <h2 className={H2}>
            150+ features. 12ms response time. 8.5/10 WAF. $50/month. Built in 34 days. A platform worth productionising.
          </h2>
          <p className={BODY}>
            27 Confluence pages. 4 authors. 5 critical documentation issues to resolve. The platform is technically impressive — the documentation needs governance to match. Fix the access spec conflict, confirm production status, and archive obsolete content.
          </p>
          <a href="https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40043905712" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors group mt-8">
            <span className="border-b border-foreground/20 group-hover:border-foreground/60 transition-colors">Agent Library — Confluence</span>
            <span className="text-foreground/30 group-hover:text-foreground/60 transition-colors">↗</span>
          </a>
        </div>
      ),
    },
  ];
}

export default function AgentLibraryPage() {
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
