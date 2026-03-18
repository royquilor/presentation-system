"use client";

import { useState, useEffect, useRef } from "react";
import { getComments, addComment, deleteComment, updateComment, type CommentsMap } from "@/lib/study-comments";

export function CommentsPanel({ slug, activeIndex }: { slug: string; activeIndex: number }) {
  const [comments, setComments] = useState<CommentsMap>({});
  const [draft, setDraft] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setComments(getComments(slug));
  }, [slug]);

  const slideComments = comments[activeIndex] || [];

  const handleAdd = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const updated = addComment(slug, activeIndex, trimmed);
    setComments({ ...updated });
    setDraft("");
    textareaRef.current?.focus();
  };

  const handleDelete = (idx: number) => {
    const updated = deleteComment(slug, activeIndex, idx);
    setComments({ ...updated });
  };

  const handleEditStart = (idx: number) => {
    setEditingIdx(idx);
    setEditText(slideComments[idx]);
  };

  const handleEditSave = () => {
    if (editingIdx === null) return;
    const updated = updateComment(slug, activeIndex, editingIdx, editText.trim());
    setComments({ ...updated });
    setEditingIdx(null);
    setEditText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  const totalNotes = Object.values(comments).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="fixed right-0 top-0 h-screen w-[320px] bg-background/95 backdrop-blur border-l border-foreground/10 flex flex-col z-50">
      <div className="px-5 py-4 border-b border-foreground/10">
        <h3 className="text-sm font-semibold text-foreground/80">
          Slide {activeIndex + 1} Notes
        </h3>
        <p className="text-xs text-foreground/40 mt-0.5">
          {totalNotes} note{totalNotes !== 1 ? "s" : ""} total
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {slideComments.length === 0 && (
          <p className="text-sm text-foreground/30 italic">No notes for this slide yet</p>
        )}
        {slideComments.map((comment, idx) => (
          <div key={idx} className="group relative rounded-lg bg-foreground/[0.04] border border-foreground/[0.06] px-3.5 py-3">
            {editingIdx === idx ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full resize-none rounded bg-background border border-foreground/10 px-2.5 py-2 text-sm text-foreground/80 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={handleEditSave} aria-label="Save note" className="text-xs font-medium text-foreground/60 hover:text-foreground transition-colors">
                    Save
                  </button>
                  <button onClick={() => setEditingIdx(null)} aria-label="Cancel editing" className="text-xs text-foreground/40 hover:text-foreground/60 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">{comment}</p>
                <div className="absolute top-2 right-2 hidden group-hover:flex gap-1.5">
                  <button
                    onClick={() => handleEditStart(idx)}
                    className="text-foreground/30 hover:text-foreground/60 transition-colors"
                    aria-label="Edit note"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="text-foreground/30 hover:text-red-500 transition-colors"
                    aria-label="Delete note"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-foreground/10">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a note..."
          className="w-full resize-none rounded-lg bg-foreground/[0.04] border border-foreground/[0.06] px-3.5 py-2.5 text-sm text-foreground/80 placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/20"
          rows={2}
        />
        <button
          onClick={handleAdd}
          disabled={!draft.trim()}
          aria-label="Add note"
          className="mt-2 w-full rounded-lg bg-foreground/[0.08] hover:bg-foreground/[0.12] disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium text-foreground/70 py-2 transition-colors"
        >
          Add Note
        </button>
      </div>
    </div>
  );
}
