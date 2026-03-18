export type SlideBackground =
  | { type: "solid"; color: string }
  | { type: "gradient"; from: string; to: string; direction?: string }
  | { type: "image"; src: string; overlay?: string; position?: string };

export type SlideAnimation =
  | "fade-in"
  | "slide-up"
  | "slide-left"
  | "scale-in"
  | "none";

export type SlideMedia = {
  src: string;
  alt?: string;
  position?: "above" | "below" | "left" | "right" | "center" | "background";
  width?: string;
  height?: string;
  rounded?: boolean;
};

export type SlideStyle = {
  background?: SlideBackground;
  animation?: SlideAnimation;
  media?: SlideMedia;
  textColor?: string;
  labelColor?: string;
};

export type Author = {
  name: string;
  avatarUrl: string;
  initials: string;
};

export type Observation = {
  number: number;
  title: string;
  body: string;
  note: string;
  style?: SlideStyle;
};

export type Risk = {
  title: string;
  body: string;
};

export type NextStep = {
  step: number;
  label: string;
  description: string;
};

export type FlexSection = {
  emoji: string;
  heading: string;
  body: string;
  items: { number: number; title: string; body: string; style?: SlideStyle }[];
  style?: SlideStyle;
};

export type Report = {
  title: string;
  subtitle: string;
  date: string;
  conversations?: number;
  author: Author;

  titleStyle?: SlideStyle;

  context: {
    heading: string;
    body: string;
    style?: SlideStyle;
  };

  problem: {
    heading: string;
    body: string;
    style?: SlideStyle;
  };

  observations: Observation[];

  proposal: {
    heading: string;
    body: string;
    bullets: string[];
    summary: string;
    style?: SlideStyle;
  };

  risks: Risk[];
  risksStyle?: SlideStyle;

  nextSteps: NextStep[];
  nextStepsStyle?: SlideStyle;

  flexSections?: FlexSection[];

  closer: {
    observation: string;
    body: string;
    reportUrl: string;
    style?: SlideStyle;
  };
};

export type SourceReference = {
  slideLabel: string;
  slideIndex?: number;
  excerpt?: string;
};

export type QuizQuestion =
  | {
      id: string;
      type: "multiple-choice" | "scenario";
      question: string;
      situation?: string;
      options: string[];
      correct: number;
      explanation: string;
      difficulty: "easy" | "medium" | "hard";
      objective: string;
      sourceReference?: SourceReference;
    }
  | {
      id: string;
      type: "true-false";
      question: string;
      correct: boolean;
      explanation: string;
      difficulty: "easy" | "medium" | "hard";
      objective: string;
      sourceReference?: SourceReference;
    }
  | {
      id: string;
      type: "text-input";
      question: string;
      placeholder: string;
      sampleAnswer: string;
      keywords: string[];
      difficulty: "easy" | "medium" | "hard";
      objective: string;
      sourceReference?: SourceReference;
    }
  | {
      id: string;
      type: "ordering";
      question: string;
      items: string[];
      correctOrder: number[];
      explanation: string;
      difficulty: "easy" | "medium" | "hard";
      objective: string;
      sourceReference?: SourceReference;
    };

export type Quiz = {
  quizId: string;
  title: string;
  description: string;
  sourceMaterial: string;
  estimatedTime: string;
  passingScore: number;
  metadata: { author: string; created: string; version: string; tags: string[] };
  questions: QuizQuestion[];
};

export type QuizResult = {
  correct: number;
  total: number;
  percentage: number;
  mastery: "Mastery" | "Proficient" | "Developing" | "Needs Review";
  details: { questionId: string; isCorrect: boolean; userAnswer: unknown }[];
};
