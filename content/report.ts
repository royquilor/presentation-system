export const report = {
  title: "Presentation system",
  subtitle: "A calm, markdown-first way to share ideas.",
  date: "2026",
  conversations: 0,
  author: {
    name: "Ben Schaumkel",
    avatarUrl: "",
    initials: "BS",
  },

  // ## Context
  context: {
    heading: "I wanted a calmer way to explain a workflow problem",
    body: "I had a workflow problem to explain. Slides felt loud and busy. I wanted something quieter: async or live, structured not decorative, easy to reshape with AI, and still feel like mine.",
  },

  // ## Problem
  problem: {
    heading: "Most slide tools optimise for polish, not control",
    body: "They push you toward templates and visual noise. That can be great for speed, but it quietly shapes the story. I wanted to keep the control and lose the performance.",
  },

  // ## Observations — one slide each
  observations: [
    {
      number: 1,
      title: "Markdown forces clarity",
      body: "When formatting disappears, only logic remains.",
      note: "",
    },
    {
      number: 2,
      title: "AI works better with structured text",
      body: "Claude can reason, restructure, and refine markdown far more effectively than slide layouts.",
      note: "",
    },
    {
      number: 3,
      title: "Version control reduces anxiety",
      body: "GitHub history makes iteration safe.",
      note: "",
    },
    {
      number: 4,
      title: "Deployment creates confidence",
      body: "Vercel allows instant publishing without design compromises.",
      note: "",
    },
    {
      number: 5,
      title: "Keyboard navigation improves flow",
      body: "It feels intentional and controlled during live walkthroughs.",
      note: "",
    },
    {
      number: 6,
      title: "Templates subtly shape thinking",
      body: "Tools like Gamma are powerful, but their structure influences the narrative.",
      note: "This was not a design problem. It was a thinking problem.",
    },
  ],

  // ## Proposal
  proposal: {
    heading: "So I built a small markdown-first presentation system",
    body: "Markdown for the content. Claude to help re-structure. Cursor to turn it into a site. GitHub for history. Vercel for shipping. Keyboard navigation so it feels calm and intentional live.",
    bullets: [
      "Fully custom",
      "Fast to iterate",
      "Structured",
      "Reusable",
      "Taste-aligned",
    ],
    summary: "Not a slide deck. A presentation system.",
  },

  // ## Risks
  risks: [
    {
      title: "Overbuilding when a simple deck would do",
      body: "This setup is not always needed. It makes sense when structure matters more than decoration, and when you care how the story feels to tell.",
    },
    {
      title: "Optimising for control over raw speed",
      body: "Owning the system can slow the first version down a bit. It pays off when you expect to revisit and refine the same story over time.",
    },
    {
      title: "Spending time on the container instead of the message",
      body: "It's easy to get lost in the system itself. The tool should stay quiet and let the thinking stay in front.",
    },
    {
      title: "Reaching for it when it's not needed",
      body: "Not every conversation needs this level of care. Part of the skill is knowing when to keep it simple.",
    },
  ],

  // ## Next Steps
  nextSteps: [
    {
      step: 1,
      label: "Turn into a reusable template",
      description: "So others can fork and fill in their own content without touching the system.",
    },
    {
      step: 2,
      label: "Extract into a lightweight framework",
      description: "Abstract the presentation layer further so structure and content are fully separate.",
    },
    {
      step: 3,
      label: "Offer as a tool for calm, text-first presentations",
      description: "Anyone who prefers writing to performing can reuse the pattern for their own stories.",
    },
    {
      step: 4,
      label: "Keep as an internal system for meaningful conversations",
      description: "The real value is having it ready when something matters, not in turning it into a product.",
    },
  ],

  // Closing slide
  closer: {
    observation: "The real outcome wasn't the website. It was feeling clear.",
    body: "For now, this is mostly a proof of concept for me. The system exists. It works. Whether it becomes something more depends on how often this kind of problem shows up again.",
    reportUrl: "#",
  },
} as const;
