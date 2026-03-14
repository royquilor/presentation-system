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
  position?: "above" | "below" | "left" | "right" | "background";
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
