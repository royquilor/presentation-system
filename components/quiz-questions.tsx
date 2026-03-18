"use client";

import { useState } from "react";
import type { QuizQuestion, SourceReference } from "@/content/types";

type MCQuestion = Extract<QuizQuestion, { type: "multiple-choice" | "scenario" }>;
type TFQuestion = Extract<QuizQuestion, { type: "true-false" }>;
type TIQuestion = Extract<QuizQuestion, { type: "text-input" }>;
type OrdQuestion = Extract<QuizQuestion, { type: "ordering" }>;

function optionClass(submitted: boolean, isCorrect: boolean, isSelected: boolean): string {
  if (submitted) {
    if (isCorrect) return "border-green-500/30 bg-green-500/[0.08]";
    if (isSelected) return "border-red-500/30 bg-red-500/[0.08]";
    return "border-foreground/[0.05] opacity-50";
  }
  if (isSelected) return "border-foreground/40 ring-2 ring-foreground/20 bg-foreground/[0.04]";
  return "border-foreground/10 hover:border-foreground/25 hover:bg-foreground/[0.03]";
}

function ExplanationCard({ correct, explanation }: { correct: boolean; explanation: string }) {
  return (
    <div className={`mt-5 rounded-lg border px-5 py-4 ${correct ? "border-green-500/20 bg-green-500/[0.06]" : "border-red-500/20 bg-red-500/[0.06]"}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-sm font-semibold ${correct ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {correct ? "✓ Correct" : "✗ Incorrect"}
        </span>
      </div>
      <p className="text-sm text-foreground/60 leading-relaxed">{explanation}</p>
    </div>
  );
}

function SourceCitation({ source, slug }: { source?: SourceReference; slug: string }) {
  if (!source) return null;
  const slideId = source.slideLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (
    <p className="mt-3 text-xs text-foreground/30">
      Source:{" "}
      <a href={`/p/${slug}#${slideId}`} className="underline hover:text-foreground/50 transition-colors">
        {source.slideLabel}
      </a>
      {source.excerpt && <span className="italic"> &mdash; &ldquo;{source.excerpt}&rdquo;</span>}
    </p>
  );
}

function SubmitButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Submit answer"
      className="mt-5 w-full rounded-lg bg-foreground text-background py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
    >
      Submit Answer
    </button>
  );
}

export function MultipleChoiceQuestion({
  question,
  selected,
  isSubmitted,
  onSelect,
  onSubmit,
  slug,
}: {
  question: MCQuestion;
  selected: number | undefined;
  isSubmitted: boolean;
  onSelect: (idx: unknown) => void;
  onSubmit: () => void;
  slug: string;
}) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">{question.question}</h2>
      {question.situation && (
        <p className="text-foreground/50 text-base leading-relaxed mb-6 mt-3">{question.situation}</p>
      )}
      <div className="space-y-3 mt-6">
        {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => !isSubmitted && onSelect(idx)}
              disabled={isSubmitted}
              className={`w-full text-left rounded-lg border px-5 py-4 transition-all duration-150 ${optionClass(isSubmitted, idx === question.correct, idx === selected)}`}
            >
              <span className="text-sm text-foreground/70">{opt}</span>
            </button>
          ))}
      </div>
      {!isSubmitted && <SubmitButton disabled={selected === undefined} onClick={onSubmit} />}
      {isSubmitted && (
        <>
          <ExplanationCard correct={selected === question.correct} explanation={question.explanation} />
          <SourceCitation source={question.sourceReference} slug={slug} />
        </>
      )}
    </div>
  );
}

export function TrueFalseQuestion({
  question,
  selected,
  isSubmitted,
  onSelect,
  onSubmit,
  slug,
}: {
  question: TFQuestion;
  selected: boolean | undefined;
  isSubmitted: boolean;
  onSelect: (val: unknown) => void;
  onSubmit: () => void;
  slug: string;
}) {
  const options = [
    { label: "True", value: true },
    { label: "False", value: false },
  ];

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">{question.question}</h2>
      <div className="grid grid-cols-2 gap-4">
        {options.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => !isSubmitted && onSelect(value)}
              disabled={isSubmitted}
              className={`rounded-lg border px-5 py-5 text-center transition-all duration-150 ${optionClass(isSubmitted, value === question.correct, value === selected)}`}
            >
              <span className="text-lg font-semibold text-foreground/70">{label}</span>
            </button>
          ))}
      </div>
      {!isSubmitted && <SubmitButton disabled={selected === undefined} onClick={onSubmit} />}
      {isSubmitted && (
        <>
          <ExplanationCard correct={selected === question.correct} explanation={question.explanation} />
          <SourceCitation source={question.sourceReference} slug={slug} />
        </>
      )}
    </div>
  );
}

export function TextInputQuestion({
  question,
  value,
  isSubmitted,
  onChange,
  onSubmit,
  slug,
}: {
  question: TIQuestion;
  value: string;
  isSubmitted: boolean;
  onChange: (val: unknown) => void;
  onSubmit: () => void;
  slug: string;
}) {
  const [selfScore, setSelfScore] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">{question.question}</h2>
      <textarea
        value={value}
        onChange={(e) => !isSubmitted && onChange(e.target.value)}
        placeholder={question.placeholder}
        disabled={isSubmitted}
        className="w-full resize-none rounded-lg border border-foreground/10 bg-foreground/[0.02] px-5 py-4 text-sm text-foreground/80 placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-foreground/20 disabled:opacity-60"
        rows={4}
      />
      {!isSubmitted && <SubmitButton disabled={!value.trim()} onClick={onSubmit} />}
      {isSubmitted && (
        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-foreground/10 bg-foreground/[0.03] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-2">Sample Answer</p>
            <p className="text-sm text-foreground/60 leading-relaxed">{question.sampleAnswer}</p>
          </div>
          {!selfScore && (
            <div>
              <p className="text-sm font-medium text-foreground/50 mb-3">How did you do?</p>
              <div className="flex gap-2">
                {[
                  { id: "nailed", label: "Nailed it", cls: "border-green-500/20 hover:bg-green-500/[0.08] text-green-600 dark:text-green-400" },
                  { id: "partial", label: "Partially", cls: "border-yellow-500/20 hover:bg-yellow-500/[0.08] text-yellow-600 dark:text-yellow-400" },
                  { id: "missed", label: "Missed it", cls: "border-red-500/20 hover:bg-red-500/[0.08] text-red-600 dark:text-red-400" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelfScore(opt.id)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${opt.cls}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {selfScore && (
            <p className="text-xs text-foreground/40">
              Self-assessed: <span className="font-medium text-foreground/60">{selfScore === "nailed" ? "Nailed it" : selfScore === "partial" ? "Partially" : "Missed it"}</span>
            </p>
          )}
          <SourceCitation source={question.sourceReference} slug={slug} />
        </div>
      )}
    </div>
  );
}

export function OrderingQuestion({
  question,
  order,
  isSubmitted,
  onReorder,
  onSubmit,
  slug,
}: {
  question: OrdQuestion;
  order: number[] | undefined;
  isSubmitted: boolean;
  onReorder: (val: unknown) => void;
  onSubmit: () => void;
  slug: string;
}) {
  const currentOrder = order ?? question.items.map((_, i) => i);

  const moveUp = (idx: number) => {
    if (isSubmitted || idx === 0) return;
    const newOrder = [...currentOrder];
    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    onReorder(newOrder);
  };

  const moveDown = (idx: number) => {
    if (isSubmitted || idx === currentOrder.length - 1) return;
    const newOrder = [...currentOrder];
    [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
    onReorder(newOrder);
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">{question.question}</h2>
      <div className="space-y-2">
        {currentOrder.map((itemIdx, pos) => {
          const isCorrectPos = question.correctOrder[pos] === itemIdx;
          return (
            <div key={itemIdx} className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-all ${optionClass(isSubmitted, isCorrectPos, !isCorrectPos)}`}>
              <span className="text-xs font-bold text-foreground/30 w-5 text-center">{pos + 1}</span>
              <span className="flex-1 text-sm text-foreground/70">{question.items[itemIdx]}</span>
              {!isSubmitted && (
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveUp(pos)}
                    disabled={pos === 0}
                    className="text-foreground/30 hover:text-foreground/60 disabled:opacity-20 transition-colors"
                    aria-label="Move up"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveDown(pos)}
                    disabled={pos === currentOrder.length - 1}
                    className="text-foreground/30 hover:text-foreground/60 disabled:opacity-20 transition-colors"
                    aria-label="Move down"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!isSubmitted && <SubmitButton disabled={false} onClick={onSubmit} />}
      {isSubmitted && (
        <>
          <ExplanationCard
            correct={JSON.stringify(currentOrder) === JSON.stringify(question.correctOrder)}
            explanation={question.explanation}
          />
          <SourceCitation source={question.sourceReference} slug={slug} />
        </>
      )}
    </div>
  );
}
