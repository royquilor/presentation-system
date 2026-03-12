import type { Report } from "./types";

export const report: Report = {
  title: "Conver Business Case",
  subtitle: "Full company-wide rollout of Datacom's secure AI platform to all 6,500 employees.",
  date: "January 2026",
  conversations: 0,
  author: {
    name: "Ben Schaumkel",
    avatarUrl: "",
    initials: "BS",
  },

  titleStyle: {
    background: { type: "gradient", from: "#000A14", to: "#00167F", direction: "135deg" },
    textColor: "#FFFFFF",
    animation: "fade-in",
  },

  context: {
    heading: "Conver completed a successful beta with strong adoption",
    body: "Datacom Chat (now Conver) was built and validated on Azure as a customised fork of LibreChat with SSO, multi-model access, and agent capabilities. This business case was prepared to secure budget and dedicated operations resources for scaling to the full organisation.",
    style: {
      animation: "slide-up",
    },
  },

  problem: {
    heading: "Three core problems demand an approved AI platform",
    body: "Employees lack approved generative AI tools to drive productivity. Staff spend significant time searching disparate systems or waiting on overloaded support teams. Without an approved tool matching public alternatives, employees use unsanctioned AI — exposing Datacom to security breaches, data leakage, and compliance risk.",
    style: {
      animation: "slide-up",
    },
  },

  observations: [
    {
      number: 1,
      title: "The ROI case is compelling",
      body: "Annual ROI is projected between 826% and 10,314%, with potential productivity gains valued at $15.6M to $78M NZD per year.",
      note: "",
      style: { animation: "fade-in" },
    },
    {
      number: 2,
      title: "Costs are dominated by variable token usage",
      body: "Year-1 total costs: $905K–$1,685K NZD. Fixed infrastructure is only ~$35K/year; the bulk is token consumption charged back to business units.",
      note: "",
      style: { animation: "fade-in" },
    },
    {
      number: 3,
      title: "Infrastructure scales economically",
      body: "Azure billing data from the pilot shows annualised infrastructure costs of ~$9K scaling to ~$35K for 6,500 users. Infrastructure does not scale linearly with headcount.",
      note: "",
      style: { animation: "fade-in" },
    },
    {
      number: 4,
      title: "Microsoft Copilot is the direct competitor internally",
      body: "Copilot costs ~$50 NZD/user/month with less flexibility. Conver provides broader model access, data control, and integration capability at lower variable cost.",
      note: "",
      style: { animation: "fade-in" },
    },
    {
      number: 5,
      title: "A dedicated Chatbot Ops team is required",
      body: "The business case requests 2.5 FTE to manage the platform — without this, scaling will be unsustainable.",
      note: "",
      style: { animation: "fade-in" },
    },
    {
      number: 6,
      title: "The agent and MCP ecosystem is the key differentiator",
      body: "The extensible agent and tool ecosystem — Code Interpreter, File Search/RAG, MCP integrations — is positioned as the primary USP over both Copilot and standard ChatGPT.",
      note: "Change management is a critical dependency. The rollout plan targets >70% active user adoption.",
      style: { animation: "fade-in" },
    },
  ],

  proposal: {
    heading: "Full rollout to 6,500 employees within 3–6 months of budget approval",
    body: "Approve Year-1 investment of $905K–$1,685K NZD, stand up a dedicated Chatbot Ops team, and execute a phased change management plan.",
    bullets: [
      "Approve Year-1 investment (bulk being variable token costs charged back to LOBs)",
      "Stand up dedicated Chatbot Ops team (2.5 FTE)",
      "Execute phased change management targeting >70% active users",
      "Integrate into Microsoft Teams for maximum accessibility",
    ],
    summary: "Delivers $15.6M–$78M in annual productivity value while eliminating Shadow AI risk.",
    style: {
      animation: "slide-up",
    },
  },

  risks: [
    {
      title: "Token cost overrun",
      body: "Variable costs are usage-dependent; without per-user or per-team token limits, actual spend could exceed the upper range.",
    },
    {
      title: "Change management failure",
      body: "Low adoption is the most likely way this investment underdelivers — requires sustained manager-led promotion.",
    },
    {
      title: "Shadow AI persistence",
      body: "Even with Conver available, some employees may continue using external tools if the platform doesn't match their workflow.",
    },
    {
      title: "Productisation complexity",
      body: "Commercialising for external customers would require additional compliance, licensing, and T&C considerations not addressed in the initial case.",
    },
  ],
  risksStyle: { animation: "slide-up" },

  nextSteps: [
    {
      step: 1,
      label: "Budget approval",
      description: "Secure Year-1 funding from leadership, with token costs budgeted at the Line of Business level.",
    },
    {
      step: 2,
      label: "Staff the Chatbot Ops team",
      description: "Hire or allocate 2.5 FTE before rollout commences.",
    },
    {
      step: 3,
      label: "Launch change management programme",
      description: "Run phased comms, mandatory compliance training, and team-level onboarding.",
    },
    {
      step: 4,
      label: "Activate token cost controls",
      description: "Implement daily per-user limits and LOB chargeback model before broad rollout.",
    },
  ],
  nextStepsStyle: { animation: "slide-up" },

  closer: {
    observation: "Conver is not just an AI experiment — it is a material productivity and risk management investment with a documented ROI exceeding 800%.",
    body: "With the platform validated and infrastructure proven, the primary remaining challenge is adoption — making the change management and training strategy as important as the technology itself.",
    reportUrl: "https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/39929380876",
    style: {
      background: { type: "gradient", from: "#00167F", to: "#002BFE", direction: "135deg" },
      textColor: "#FFFFFF",
      animation: "scale-in",
    },
  },
};
