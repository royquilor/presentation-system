"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Quiz, QuizQuestion, QuizResult } from "@/content/types";
import {
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  TextInputQuestion,
  OrderingQuestion,
} from "@/components/quiz-questions";

function scoreQuiz(quiz: Quiz, answers: Record<string, unknown>): QuizResult {
  let correct = 0;
  const details = quiz.questions.map((q) => {
    const answer = answers[q.id];
    let isCorrect = false;

    switch (q.type) {
      case "multiple-choice":
      case "scenario":
        isCorrect = answer === q.correct;
        break;
      case "true-false":
        isCorrect = answer === q.correct;
        break;
      case "ordering":
        isCorrect = JSON.stringify(answer) === JSON.stringify(q.correctOrder);
        break;
      case "text-input": {
        const text = (answer as string)?.toLowerCase() ?? "";
        const matched = q.keywords.filter((kw) => text.includes(kw.toLowerCase()));
        isCorrect = matched.length >= Math.ceil(q.keywords.length / 2);
        break;
      }
    }

    if (isCorrect) correct++;
    return { questionId: q.id, isCorrect, userAnswer: answer };
  });

  const percentage = Math.round((correct / quiz.questions.length) * 100);
  const mastery: QuizResult["mastery"] =
    percentage >= 90 ? "Mastery" : percentage >= 70 ? "Proficient" : percentage >= 50 ? "Developing" : "Needs Review";

  return { correct, total: quiz.questions.length, percentage, mastery, details };
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    easy: "bg-green-500/10 text-green-600 dark:text-green-400",
    medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    hard: "bg-red-500/10 text-red-600 dark:text-red-400",
  };
  return (
    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors[difficulty as keyof typeof colors] || ""}`}>
      {difficulty}
    </span>
  );
}

export function QuizPresentation({ quiz, slug }: { quiz: Quiz; slug: string }) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalSlides = quiz.questions.length + 2; // intro + questions + results

  const scrollToSlide = useCallback((index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: "instant", block: "start" });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) return;
      if (e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;
      const currentIdx = Math.round(container.scrollTop / container.clientHeight);
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        if (currentIdx < totalSlides - 1) scrollToSlide(currentIdx + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        if (currentIdx > 0) scrollToSlide(currentIdx - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides, scrollToSlide]);

  const handleAnswer = useCallback((qId: string, answer: unknown) => {
    setAnswers((prev) => ({ ...prev, [qId]: answer }));
  }, []);

  const handleSubmit = useCallback((qId: string) => {
    setSubmitted((prev) => ({ ...prev, [qId]: true }));
  }, []);

  const handleFinish = useCallback(() => {
    setShowResults(true);
    setTimeout(() => scrollToSlide(totalSlides - 1), 50);
  }, [scrollToSlide, totalSlides]);

  const handleRetry = useCallback(() => {
    setAnswers({});
    setSubmitted({});
    setShowResults(false);
    setTimeout(() => scrollToSlide(0), 50);
  }, [scrollToSlide]);

  const result = showResults ? scoreQuiz(quiz, answers) : null;
  const allSubmitted = quiz.questions.every((q) => submitted[q.id]);

  return (
    <div ref={containerRef} className="bg-background h-screen overflow-y-scroll" style={{ scrollSnapType: "y mandatory" }}>
      {/* Intro slide */}
      <div
        ref={(el) => { slideRefs.current[0] = el; }}
        className="h-screen w-full flex items-center justify-center px-6 md:px-16 shrink-0"
        style={{ scrollSnapAlign: "start" }}
      >
        <div className="max-w-2xl w-full text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-foreground/40 mb-4">Quiz</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">{quiz.title}</h1>
          <p className="text-foreground/50 text-base md:text-lg mb-8 leading-relaxed">{quiz.description}</p>
          <div className="flex items-center justify-center gap-6 text-sm text-foreground/40 mb-10">
            <span>{quiz.questions.length} questions</span>
            <span className="w-px h-4 bg-foreground/15" />
            <span>{quiz.estimatedTime}</span>
            <span className="w-px h-4 bg-foreground/15" />
            <span>Pass: {quiz.passingScore}%</span>
          </div>
          <button
            onClick={() => scrollToSlide(1)}
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-8 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Start Quiz
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Question slides */}
      {quiz.questions.map((q, i) => (
        <div
          key={q.id}
          ref={(el) => { slideRefs.current[i + 1] = el; }}
          className="min-h-screen w-full flex items-center justify-center px-6 md:px-16 shrink-0 py-12"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-foreground/40">
                Question {i + 1} of {quiz.questions.length}
              </p>
              <DifficultyBadge difficulty={q.difficulty} />
            </div>
            <QuestionRenderer
              question={q}
              answer={answers[q.id]}
              isSubmitted={!!submitted[q.id]}
              onAnswer={(a) => handleAnswer(q.id, a)}
              onSubmit={() => handleSubmit(q.id)}
              slug={slug}
            />
            {submitted[q.id] && i < quiz.questions.length - 1 && (
              <button
                onClick={() => scrollToSlide(i + 2)}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors"
              >
                Next question
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            )}
            {submitted[q.id] && i === quiz.questions.length - 1 && allSubmitted && (
              <button
                onClick={handleFinish}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                See Results
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Results slide */}
      <div
        ref={(el) => { slideRefs.current[totalSlides - 1] = el; }}
        className="min-h-screen w-full flex items-center justify-center px-6 md:px-16 shrink-0 py-12"
        style={{ scrollSnapAlign: "start" }}
      >
        {result ? (
          <ResultsSlide result={result} quiz={quiz} slug={slug} onRetry={handleRetry} />
        ) : (
          <div className="text-center text-foreground/30">
            <p className="text-lg">Complete all questions to see your results.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionRenderer({
  question,
  answer,
  isSubmitted,
  onAnswer,
  onSubmit,
  slug,
}: {
  question: QuizQuestion;
  answer: unknown;
  isSubmitted: boolean;
  onAnswer: (a: unknown) => void;
  onSubmit: () => void;
  slug: string;
}) {
  switch (question.type) {
    case "multiple-choice":
    case "scenario":
      return (
        <MultipleChoiceQuestion
          question={question}
          selected={answer as number | undefined}
          isSubmitted={isSubmitted}
          onSelect={onAnswer}
          onSubmit={onSubmit}
          slug={slug}
        />
      );
    case "true-false":
      return (
        <TrueFalseQuestion
          question={question}
          selected={answer as boolean | undefined}
          isSubmitted={isSubmitted}
          onSelect={onAnswer}
          onSubmit={onSubmit}
          slug={slug}
        />
      );
    case "text-input":
      return (
        <TextInputQuestion
          question={question}
          value={(answer as string) ?? ""}
          isSubmitted={isSubmitted}
          onChange={onAnswer}
          onSubmit={onSubmit}
          slug={slug}
        />
      );
    case "ordering":
      return (
        <OrderingQuestion
          question={question}
          order={answer as number[] | undefined}
          isSubmitted={isSubmitted}
          onReorder={onAnswer}
          onSubmit={onSubmit}
          slug={slug}
        />
      );
  }
}

function ResultsSlide({ result, quiz, slug, onRetry }: { result: QuizResult; quiz: Quiz; slug: string; onRetry: () => void }) {
  const masteryColors = {
    Mastery: "text-green-500",
    Proficient: "text-blue-500",
    Developing: "text-yellow-500",
    "Needs Review": "text-red-500",
  };

  const ringColor = {
    Mastery: "stroke-green-500",
    Proficient: "stroke-blue-500",
    Developing: "stroke-yellow-500",
    "Needs Review": "stroke-red-500",
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (result.percentage / 100) * circumference;

  return (
    <div className="max-w-2xl w-full">
      <div className="text-center mb-10">
        <div className="relative inline-block mb-6">
          <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-foreground/10" />
            <circle
              cx="50" cy="50" r="45" fill="none" strokeWidth="6" strokeLinecap="round"
              className={ringColor[result.mastery]}
              style={{ strokeDasharray: circumference, strokeDashoffset: offset, transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{result.percentage}%</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {result.correct}/{result.total}
        </h2>
        <p className={`text-lg font-semibold ${masteryColors[result.mastery]}`}>{result.mastery}</p>
      </div>

      <div className="space-y-2 mb-10">
        {result.details.map((d, i) => {
          const q = quiz.questions[i];
          return (
            <div key={d.questionId} className="flex items-center gap-3 rounded-lg border border-foreground/[0.06] px-4 py-3">
              <span className={`shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${d.isCorrect ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-red-500/15 text-red-600 dark:text-red-400"}`}>
                {d.isCorrect ? "✓" : "✗"}
              </span>
              <span className="flex-1 text-sm text-foreground/70 truncate">{q.question}</span>
              <DifficultyBadge difficulty={q.difficulty} />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4">
        <button onClick={onRetry} aria-label="Retry quiz" className="rounded-full border border-foreground/15 px-6 py-2.5 text-sm font-medium text-foreground/70 hover:bg-foreground/[0.05] transition-colors">
          Retry Quiz
        </button>
        <Link
          href={`/p/${slug}`}
          className="rounded-full bg-foreground text-background px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Presentation
        </Link>
      </div>
    </div>
  );
}
