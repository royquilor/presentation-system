"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export const KEYBOARD_SHORTCUTS = {
  STUDY_MODE: "s",
  FOCUS: "f",
  NOTES: "n",
  QUIZ: "q",
} as const;

type StudyModeState = {
  enabled: boolean;
  focusMode: boolean;
  showComments: boolean;
};

type StudyModeContextValue = {
  state: StudyModeState;
  toggle: () => void;
  toggleFocus: () => void;
  toggleComments: () => void;
};

const StudyModeContext = createContext<StudyModeContextValue | null>(null);

export function useStudyMode() {
  const ctx = useContext(StudyModeContext);
  if (!ctx) throw new Error("useStudyMode must be used within StudyModeProvider");
  return ctx;
}

export function StudyModeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudyModeState>({
    enabled: false,
    focusMode: false,
    showComments: false,
  });

  const toggle = useCallback(() => {
    setState((prev) => {
      if (prev.enabled) return { enabled: false, focusMode: false, showComments: false };
      return { ...prev, enabled: true };
    });
  }, []);

  const toggleFocus = useCallback(() => {
    setState((prev) => (prev.enabled ? { ...prev, focusMode: !prev.focusMode } : prev));
  }, []);

  const toggleComments = useCallback(() => {
    setState((prev) => (prev.enabled ? { ...prev, showComments: !prev.showComments } : prev));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;

      const k = e.key.toLowerCase();
      if (k === KEYBOARD_SHORTCUTS.STUDY_MODE) { e.preventDefault(); toggle(); }
      else if (k === KEYBOARD_SHORTCUTS.FOCUS) { e.preventDefault(); toggleFocus(); }
      else if (k === KEYBOARD_SHORTCUTS.NOTES) { e.preventDefault(); toggleComments(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, toggleFocus, toggleComments]);

  return (
    <StudyModeContext.Provider value={{ state, toggle, toggleFocus, toggleComments }}>
      {children}
    </StudyModeContext.Provider>
  );
}
