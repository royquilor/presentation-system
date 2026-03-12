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
  RiskSeverityScatter,
  TimelineChart,
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

const SOURCES: { claim: string; doc: string; author: string; date: string; url: string; slides: string }[] = [
  { claim: "ROI ($15.6M–$78M), costs, adoption, hiring avoidance", doc: "Datacom Chat Business Case Production", author: "Joe Thornley", date: "13 Jan 2026", url: `${C}/39929380876`, slides: "2–6, 8, 15–16" },
  { claim: "Token audit, 13 models, 156 configurations", doc: "Conver PROD Token Consumption Audit", author: "Harrison Bland", date: "4 Mar 2026", url: `${C}/40842133509`, slides: "2, 7" },
  { claim: "Backlog priorities, DataScape agents", doc: "Conver Backlog Snapshot Sept 2025", author: "Joe Thornley", date: "22 Sep 2025", url: `${C}/40166228081`, slides: "6, 12" },
  { claim: "Audit methodology, variance data", doc: "Conver Audit Phase B v1", author: "Harrison Bland", date: "6 Mar 2026", url: `${C}/40850227234`, slides: "12" },
  { claim: "Commercialisation terms, Copilot comparison", doc: "Overview Hyperscaler T&Cs Commercialising Conver", author: "Joe Thornley", date: "21 Nov 2025", url: `${C}/40435482672`, slides: "5" },
  { claim: "7 production risks, severity, blockers", doc: "Conver Risk Review November 2025", author: "Joe Thornley", date: "18 Nov 2025", url: `${C}/40415953243`, slides: "8–9" },
  { claim: "Feature roadmap, timeline", doc: "Roadmap Draft", author: "Jason Moss", date: "30 May 2025", url: `${C}/39636010283`, slides: "12" },
  { claim: "Server migration procedure", doc: "Conver Pilot Production Server Migration", author: "Jing Ling", date: "8 Sep 2025", url: `${C}/40087617783`, slides: "12" },
  { claim: "Platform overview, adoption goals", doc: "Conver Knowledge Hub", author: "Harrison Bland", date: "16 Oct 2025", url: `${C}/40110391561`, slides: "2, 6" },
  { claim: "Enterprise architecture, Azure WAF", doc: "Conver Platform Enterprise Architecture", author: "Dipesh Trikam", date: "12 Dec 2025", url: `${C}/40533983331`, slides: "11" },
  { claim: "Non-technical architecture overview", doc: "Conver Platform Architecture Explained Simply", author: "Dipesh Trikam", date: "11 Dec 2025", url: `${C}/40533950601`, slides: "11" },
  { claim: "Monolith to microservices migration", doc: "Conver Platform Redevelopment Guide", author: "Dipesh Trikam", date: "11 Dec 2025", url: `${C}/40533688413`, slides: "11" },
  { claim: "Serverless strategy, trunk-based dev", doc: "Conver Serverless Enterprise Architecture", author: "Dipesh Trikam", date: "3 Dec 2025", url: `${C}/40486469753`, slides: "11" },
  { claim: "ISO 27001, SOC 2 programme", doc: "Conver Playbook for Certification", author: "Joe Thornley", date: "6 Oct 2025", url: `${C}/40217739335`, slides: "10" },
  { claim: "90-day compliance programme", doc: "Pathway to Security and Compliance", author: "Joe Thornley", date: "6 Oct 2025", url: `${C}/40217313800`, slides: "10" },
  { claim: "User security guide, GCSE framework", doc: "A Practical Guide to Using Conver Securely", author: "Joe Thornley", date: "6 Oct 2025", url: `${C}/40217314277`, slides: "10" },
  { claim: "DevOps security, blob lifecycle", doc: "Technical Operations and Security Guide", author: "Johnson Paku", date: "26 Feb 2026", url: `${C}/40777154594`, slides: "10" },
  { claim: "Entra ID, permissions, group sync", doc: "Entra ID Permissions Request for Conver", author: "Dipesh Trikam", date: "15 Dec 2025", url: `${C}/40549122066`, slides: "10" },
  { claim: "Zendesk + SITC integration", doc: "Zendesk SITC Conver Integration", author: "Dipesh Trikam", date: "9 Feb 2026", url: `${C}/40747171868`, slides: "6" },
  { claim: "Integration architecture", doc: "Architecture Conver Zendesk SITC", author: "Dipesh Trikam", date: "9 Feb 2026", url: `${C}/40745926879`, slides: "6, 11" },
  { claim: "API endpoints, auth methods", doc: "API Reference Zendesk SITC", author: "Dipesh Trikam", date: "9 Feb 2026", url: `${C}/40746975437`, slides: "6" },
  { claim: "Access control, limitations", doc: "Zendesk SITC Access Control Security", author: "Dipesh Trikam", date: "9 Feb 2026", url: `${C}/40747270215`, slides: "6" },
  { claim: "16 tools (7 Zendesk + 9 SITC)", doc: "Available Tools & Capabilities", author: "Dipesh Trikam", date: "9 Feb 2026", url: `${C}/40745730458`, slides: "6" },
  { claim: "WAF deployment plan", doc: "Zendesk SITC Azure WAF Deployment", author: "Dipesh Trikam", date: "9 Feb 2026", url: `${C}/40745730525`, slides: "6" },
  { claim: "Python 3.12, FastMCP, Docker", doc: "Zendesk SITC Technical Details", author: "Dipesh Trikam", date: "9 Feb 2026", url: `${C}/40746713265`, slides: "6" },
  { claim: "SPP/OpenAir integration overview", doc: "SPP/Open Air Conver Integration", author: "Dipesh Trikam", date: "4 Feb 2026", url: `${C}/40727773361`, slides: "6" },
  { claim: "Governance blockers, P1 controls", doc: "SPP Insights Governance Summary", author: "Dipesh Trikam", date: "4 Feb 2026", url: `${C}/40727839006`, slides: "9, 13" },
  { claim: "Production architecture", doc: "SPP Insights Production Architecture", author: "Dipesh Trikam", date: "4 Feb 2026", url: `${C}/40728133732`, slides: "11" },
  { claim: "Security implementation gaps", doc: "Security Implementation Guide", author: "Dipesh Trikam", date: "4 Feb 2026", url: `${C}/40728330441`, slides: "9, 10" },
  { claim: "SharePoint proposal 1", doc: "SharePoint Conver Integration Proposal 1", author: "Jason Moss", date: "6 Oct 2025", url: `${C}/40217935933`, slides: "6" },
  { claim: "SharePoint proposal 2", doc: "SharePoint Integration for Conver Proposal 2", author: "Jason Moss", date: "6 Oct 2025", url: `${C}/40217281205`, slides: "6" },
  { claim: "Code Interpreter QA — data fabrication", doc: "Conver Code Interpreter QA Jan 2026", author: "Kieran Sinclair", date: "29 Jan 2026", url: `${C}/40679800900`, slides: "13" },
  { claim: "Code Interpreter QA — November bugs", doc: "Conver Code Interpreter QA Nov 2025", author: "Kieran Sinclair", date: "23 Jan 2026", url: `${C}/40359264428`, slides: "13" },
  { claim: "Autodocx V1 testing", doc: "Autodocx Conver QA Test Plan", author: "Kieran Sinclair", date: "26 Nov 2025", url: `${C}/40435843091`, slides: "13" },
  { claim: "Autodocx V2 testing", doc: "Autodocx v1.2 Conver QA Test Plan", author: "Johnson Paku", date: "13 Jan 2026", url: `${C}/40512061751`, slides: "13" },
  { claim: "Memory isolation testing", doc: "Conver Memories Acceptance Criteria Test Plan", author: "Kieran Sinclair", date: "27 Nov 2025", url: `${C}/40398749884`, slides: "13" },
  { claim: "FAQ bot testing", doc: "Conver FAQ/QnA Bot Testing", author: "Kieran Sinclair", date: "17 Nov 2025", url: `${C}/40323022916`, slides: "13" },
  { claim: "Smoke test checklist", doc: "Conver Quick Smoke Test Checklist", author: "Kieran Sinclair", date: "2 Dec 2025", url: `${C}/40115503162`, slides: "13" },
  { claim: "Agent documentation", doc: "Conver Agents", author: "Matt Shepheard", date: "6 Oct 2025", url: `${C}/40217510174`, slides: "6" },
  { claim: "Assistants menu feature", doc: "Conver Assistants Menu", author: "Harrison Bland", date: "15 Jan 2026", url: `${C}/40648441901`, slides: "6" },
  { claim: "Agent handoff architecture", doc: "Conver Intro Agent Handoffs & Passthroughs", author: "Kieran Sinclair", date: "16 Jan 2026", url: `${C}/40653521063`, slides: "6" },
  { claim: "Tool integration guide", doc: "Conver Tool Integration Guide", author: "Dipesh Trikam", date: "11 Dec 2025", url: `${C}/40533295251`, slides: "6" },
  { claim: "PolicyBot POC", doc: "Conver Policy Chat Bot (POC)", author: "Johnson Paku", date: "5 Dec 2025", url: `${C}/39820984356`, slides: "6" },
  { claim: "KB test sets, model guidance", doc: "Conver Knowledge Base Test QnA Sets", author: "Harrison Bland", date: "16 Oct 2025", url: `${C}/40255848492`, slides: "6" },
  { claim: "Feature flag management", doc: "Conver Feature Flags QA Environment", author: "Kieran Sinclair", date: "28 Jan 2026", url: `${C}/40656011311`, slides: "13" },
  { claim: "LibreChat merge plan", doc: "LibreChat Changes Merge Plan for Conver", author: "Jing Ling", date: "3 Dec 2025", url: `${C}/40468283444`, slides: "11" },
  { claim: "LibreChat roadmap features", doc: "Roadmap LibreChat 2025", author: "Victoria Marchant", date: "24 Jun 2025", url: `${C}/39888749091`, slides: "12" },
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
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-none text-balance">Conver Platform</h1>
          <p className="text-xl md:text-2xl text-foreground/60 mt-6 leading-snug text-balance">Comprehensive Business Analysis &amp; ROI</p>
          <p className="text-sm text-foreground/40 mt-8">
            <a href="https://datacomgroup.atlassian.net/wiki/people/62a65fd8188d08006fe06fc2" target="_blank" rel="noopener noreferrer" className={CL}>Joe Thornley</a>
            {" & "}
            <a href="https://datacomgroup.atlassian.net/wiki/spaces/IA" target="_blank" rel="noopener noreferrer" className={CL}>Jason Moss</a>
            {" — "}<Cite href={`${C}/39929380876`}>117 Confluence pages reviewed</Cite>{" — March 2026"}
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
          <h2 className={H2}>Datacom&apos;s enterprise AI platform</h2>
          <p className={BODY}>
            Conver provides 3,000+ employees with secure access to 13 AI models across 4 hyperscaler providers. Built on LibreChat, it shipped 14 features to production and is expanding to Zendesk, SPP/OpenAir, and SharePoint integrations. A team of 9 contributors built and operates the platform.
          </p>
          <p className="text-foreground/40 text-sm mt-4"><Cite href={`${C}/40110391561`}>Knowledge Hub</Cite></p>
        </div>
      ),
    },

    // 3. Key Metrics
    {
      id: "kpis", label: "Key Metrics",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Key metrics</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            <KPI value="3,000+" label="Employees" />
            <KPI value="30K+" label="Conversations" />
            <KPI value="$15.6M" label="Annual value (floor)" />
            <KPI value="826%" label="ROI (worst case)" />
            <KPI value="$5/mo" label="Per-user cost" />
            <KPI value="13" label="AI models" />
            <KPI value="14" label="Features shipped" />
            <KPI value="9" label="Contributors" />
          </div>
          <p className="text-foreground/30 text-xs mt-8 text-center"><Cite href={`${C}/39929380876`}>Business Case Production</Cite> | <Cite href={`${C}/40842133509`}>Token Audit</Cite></p>
        </div>
      ),
    },

    // 4. ROI
    {
      id: "roi", label: "ROI",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Financial analysis</p>
          <h2 className={H2}>Annual value vs. cost</h2>
          <ROIBarChart />
          <p className="text-foreground/40 text-sm mt-4">
            Conservative: $15.6M value / $1.685M cost = 826% ROI. Optimistic: $78M / $905K = 10,314%.{" "}
            <Cite href={`${C}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    // 5. Cost Comparison
    {
      id: "cost", label: "Cost",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Cost analysis</p>
          <h2 className={H2}>99% cheaper than Microsoft Copilot</h2>
          <CostComparisonChart />
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case</Cite>{" | "}<Cite href={`${C}/40435482672`}>Hyperscaler T&amp;Cs</Cite>
          </p>
        </div>
      ),
    },

    // 6. Features
    {
      id: "features", label: "Features",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Platform capabilities</p>
          <h2 className={H2}>14 shipped, 10 planned</h2>
          <FeatureMaturityPieChart />
          <p className="text-foreground/40 text-sm mt-4">
            Chat, Code Interpreter, Memories, Autodocx, Knowledge Base, Assistants, Handoffs, Flags, Zendesk SITC, SPP, Policy Bot, Brand Agent, Bing Search, Agents.{" "}
            <Cite href={`${C}/40110391561`}>Knowledge Hub</Cite>
          </p>
        </div>
      ),
    },

    // 7. Models
    {
      id: "models", label: "Models",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>AI model portfolio</p>
          <h2 className={H2}>13 models across 4 providers</h2>
          <ModelPortfolioChart />
          <p className="text-foreground/40 text-sm mt-4">
            GPT-4o, Claude 3.5, Gemini 2.0, o1, o3-mini, DALL-E 3, Whisper, and more. No single-vendor lock-in.{" "}
            <Cite href={`${C}/40842133509`}>Token Consumption Audit</Cite>
          </p>
        </div>
      ),
    },

    // 8. Risks
    {
      id: "risks", label: "Risks",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Risk assessment</p>
          <h2 className={H2}>7 active risks — Likelihood vs Impact</h2>
          <RiskSeverityScatter />
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40415953243`}>Risk Review November 2025</Cite>
          </p>
        </div>
      ),
    },

    // 9. Risk Detail
    {
      id: "risk-detail", label: "Risk Detail",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Highest-impact risks</p>
          <h2 className={H2}>4 risks blocked on Group Tech</h2>
          <div className="space-y-4">
            {[
              { title: "TLS certificate automation", impact: "High", status: "Blocked on Group Tech" },
              { title: "Public Azure exposure bypassing Cloudflare", impact: "High", status: "Blocked on Group Tech" },
              { title: "No centralised logging", impact: "Medium-High", status: "Blocked on Group Tech" },
              { title: "SPP P1 security controls unimplemented", impact: "Critical", status: "Documented, not built" },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-foreground/[0.03]">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${r.impact === "Critical" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}>{r.impact}</span>
                <div>
                  <p className="text-foreground/80 font-medium text-sm">{r.title}</p>
                  <p className="text-foreground/40 text-sm">{r.status}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40415953243`}>Risk Review</Cite>{" | "}<Cite href={`${C}/40728330441`}>SPP Security Guide</Cite>
          </p>
        </div>
      ),
    },

    // 10. Compliance
    {
      id: "compliance", label: "Compliance",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Security &amp; compliance</p>
          <h2 className={H2}>90-day ISO 27001 programme — documented, not started</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { phase: "Foundation", weeks: "Weeks 1–4", items: "Gap analysis, risk assessment, policy framework" },
              { phase: "Implementation", weeks: "Weeks 5–8", items: "Controls, training, incident response, audits" },
              { phase: "Audit Ready", weeks: "Weeks 9–12", items: "Internal audit, management review, certification" },
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-lg bg-foreground/[0.03]">
                <p className="text-foreground/80 font-semibold text-sm">{p.phase}</p>
                <p className="text-foreground/40 text-xs mt-1">{p.weeks}</p>
                <p className="text-foreground/50 text-xs mt-2">{p.items}</p>
              </div>
            ))}
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40217739335`}>Playbook for Certification</Cite>{" | "}
            <Cite href={`${C}/40217313800`}>Pathway to Compliance</Cite>{" | "}
            <Cite href={`${C}/40549122066`}>Entra ID</Cite>
          </p>
        </div>
      ),
    },

    // 11. Architecture
    {
      id: "architecture", label: "Architecture",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Architecture</p>
          <h2 className={H2}>Monolith → microservices transition</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-foreground/[0.03]">
              <p className="text-foreground/80 font-semibold text-sm mb-2">Current</p>
              <p className="text-foreground/50 text-sm">LibreChat fork, Node.js monolith, MongoDB, Azure App Service, single deployment</p>
            </div>
            <div className="p-4 rounded-lg bg-foreground/[0.03] border border-foreground/10">
              <p className="text-foreground/80 font-semibold text-sm mb-2">Target</p>
              <p className="text-foreground/50 text-sm">Serverless Azure Functions, API Management, feature flags, trunk-based dev, daily deploys</p>
            </div>
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40533983331`}>Enterprise Architecture</Cite>{" | "}
            <Cite href={`${C}/40486469753`}>Serverless Strategy</Cite>{" | "}
            <Cite href={`${C}/40533688413`}>Redevelopment Guide</Cite>
          </p>
        </div>
      ),
    },

    // 12. Timeline
    {
      id: "timeline", label: "Timeline",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Timeline</p>
          <h2 className={H2}>Pilot to production — and beyond</h2>
          <TimelineChart />
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/39929380876`}>Business Case</Cite>{" | "}
            <Cite href={`${C}/39636010283`}>Roadmap</Cite>{" | "}
            <Cite href={`${C}/40850227234`}>Audit Phase B</Cite>
          </p>
        </div>
      ),
    },

    // 13. QA Findings
    {
      id: "qa", label: "QA",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>QA findings</p>
          <h2 className={H2}>6 key issues across production features</h2>
          <div className="space-y-3">
            {[
              { feature: "Code Interpreter", issue: "Multi-turn data fabrication", severity: "High" },
              { feature: "Code Interpreter", issue: "Dataset persistence failures", severity: "Medium" },
              { feature: "Memories", issue: "Context isolation failures between users", severity: "High" },
              { feature: "Autodocx", issue: "Template rendering edge cases in v1.2", severity: "Medium" },
              { feature: "Feature Flags", issue: "Configuration drift between environments", severity: "Medium" },
              { feature: "SPP Insights", issue: "All P1 security controls unimplemented", severity: "Critical" },
            ].map((q, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-foreground/5">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${q.severity === "Critical" ? "bg-red-500/10 text-red-500" : q.severity === "High" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"}`}>{q.severity}</span>
                <span className="text-foreground/70 text-sm font-medium w-28 shrink-0">{q.feature}</span>
                <span className="text-foreground/50 text-sm">{q.issue}</span>
              </div>
            ))}
          </div>
          <p className="text-foreground/40 text-sm mt-4">
            <Cite href={`${C}/40679800900`}>Code Interpreter QA</Cite>{" | "}
            <Cite href={`${C}/40398749884`}>Memories QA</Cite>{" | "}
            <Cite href={`${C}/40435843091`}>Autodocx QA</Cite>
          </p>
        </div>
      ),
    },

    // 14. Next Steps
    {
      id: "next-steps", label: "Next Steps",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Next steps</p>
          <h2 className={H2}>6 prioritised actions</h2>
          <ol className="space-y-4 text-foreground/60 text-base md:text-lg">
            {[
              ["Approve full rollout budget", "$905K–$1.685M for $15.6M+ Year 1 return"],
              ["Complete token audit", "155 of 156 runs outstanding — validate cost model"],
              ["Resolve Group Tech blockers", "TLS and Azure exposure are highest-impact risks"],
              ["Begin 90-day ISO 27001", "Unlocks commercialisation and government clients"],
              ["Phase 1 departments", "IT Support, HR, Dev — measure tickets, commits, velocity"],
              ["Implement SPP P1 controls", "5 security controls before integration goes live"],
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

    // 15. Efficiency
    {
      id: "efficiency", label: "Efficiency",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Productivity scenarios</p>
          <h2 className={H2}>$15.6M to $78M — depending on hours saved</h2>
          <EfficiencyGainsChart />
          <p className="text-foreground/40 text-sm mt-4">
            Break-even at 0.1% of employee time (~5 min/day).{" "}
            <Cite href={`${C}/39929380876`}>Business Case Production</Cite>
          </p>
        </div>
      ),
    },

    // 16. Adoption
    {
      id: "adoption", label: "Adoption",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Adoption</p>
          <h2 className={H2}>600% year-over-year conversation growth</h2>
          <AdoptionGrowthChart />
          <p className={`${BODY} mt-4`}>
            54 power users (&gt;2/day). 73 core adopters. Organic growth — no mandate.
          </p>
          <p className="text-foreground/40 text-sm mt-4"><Cite href={`${C}/39929380876`}>Business Case Production</Cite></p>
        </div>
      ),
    },

    // 17. Citations
    {
      id: "citations", label: "Citations",
      content: (
        <div className={WRAP}>
          <p className={LABEL}>Citations</p>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">47 Confluence documents reviewed</h2>
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-1">
            {SOURCES.map((s, i) => (
              <div key={i} className="flex gap-2 py-1.5 border-b border-foreground/5 text-xs">
                <span className="text-foreground/25 w-5 text-right shrink-0">{i + 1}.</span>
                <div className="min-w-0">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={`text-foreground/70 ${CL}`}>{s.doc}</a>
                  <span className="text-foreground/30"> — {s.author}, {s.date} — </span>
                  <button onClick={() => scrollToSlide(firstSlide(s.slides))} className={`text-foreground/40 cursor-pointer ${CL}`}>Slides {s.slides}</button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-foreground/30 text-xs mt-4">Read-only. No Confluence pages were edited.</p>
        </div>
      ),
    },

    // 18. Close
    {
      id: "close", label: "Close",
      content: (
        <div className={WRAP}>
          <h2 className={H2}>
            $15.6M–$78M in value. 826%–10,314% ROI. 14 features. 3,000+ users. A platform worth investing in.
          </h2>
          <p className={BODY}>
            117 Confluence pages across 3 spaces. 47 core documents. 9 contributors. Every figure verified against source. The data supports full rollout.
          </p>
          <a href="https://datacomgroup.atlassian.net/wiki/spaces/IA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors group mt-8">
            <span className="border-b border-foreground/20 group-hover:border-foreground/60 transition-colors">Insights &amp; Analytics — Confluence</span>
            <span className="text-foreground/30 group-hover:text-foreground/60 transition-colors">↗</span>
          </a>
        </div>
      ),
    },
  ];
}

export default function AnalysisPage() {
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
