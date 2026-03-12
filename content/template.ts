/**
 * Presentation template — duplicate this file and fill in your content.
 * See CONVERSION-GUIDE.md for the markdown → report.ts mapping.
 */
export const report = {
  title: "",
  subtitle: "",
  date: "2026",
  conversations: 0,
  author: {
    name: "Ben Schaumkel",
    avatarUrl: "",
    initials: "BS",
  },

  context: {
    heading: "",
    body: "",
  },

  problem: {
    heading: "",
    body: "",
  },

  observations: [
    { number: 1, title: "", body: "", note: "" },
    { number: 2, title: "", body: "", note: "" },
    { number: 3, title: "", body: "", note: "" },
  ],

  proposal: {
    heading: "",
    body: "",
    bullets: [] as string[],
    summary: "",
  },

  risks: [
    { title: "", body: "" },
    { title: "", body: "" },
  ],

  nextSteps: [
    { step: 1, label: "", description: "" },
    { step: 2, label: "", description: "" },
    { step: 3, label: "", description: "" },
  ],

  closer: {
    observation: "",
    body: "",
    reportUrl: "",
  },
} as const;
