"use client";

import { useState } from "react";
import Link from "next/link";

export type PresentationEntry = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  dateSort: number;
  slideCount: number;
  source: string;
  category: string;
  pinned: boolean;
  author: string;
  tags?: { status: string; maturity: string };
};

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "products", label: "Products" },
  { id: "conver", label: "Conver" },
  { id: "agent-library", label: "Agent Library" },
  { id: "servicenow", label: "ServiceNow" },
  { id: "product-hub", label: "Product Hub" },
] as const;

function categoryColour(cat: string) {
  switch (cat) {
    case "products":
      return "bg-[#6B21A8]/10 text-[#6B21A8] dark:bg-[#A78BFA]/15 dark:text-[#A78BFA]";
    case "conver":
      return "bg-[#002BFE]/10 text-[#002BFE] dark:bg-[#80A0F8]/15 dark:text-[#80A0F8]";
    case "agent-library":
      return "bg-[#FF0070]/10 text-[#FF0070] dark:bg-[#FF0070]/15 dark:text-[#FF7EB3]";
    case "servicenow":
      return "bg-[#33913A]/10 text-[#33913A] dark:bg-[#33913A]/15 dark:text-[#6FCF76]";
    case "product-hub":
      return "bg-[#FF8C00]/10 text-[#FF8C00] dark:bg-[#FF8C00]/15 dark:text-[#FFB347]";
    default:
      return "bg-foreground/5 text-foreground/50";
  }
}

function statusColour(status: string) {
  switch (status) {
    case "Production":
      return "bg-[#33913A]/15 text-[#33913A] dark:text-[#6FCF76]";
    case "POC":
      return "bg-[#FF8C00]/15 text-[#FF8C00] dark:text-[#FFB347]";
    case "Pilot":
      return "bg-[#002BFE]/15 text-[#002BFE] dark:text-[#80A0F8]";
    default:
      return "bg-foreground/10 text-foreground/60";
  }
}

function categoryLabel(cat: string) {
  switch (cat) {
    case "products":
      return "Products";
    case "conver":
      return "Conver";
    case "agent-library":
      return "Agent Library";
    case "servicenow":
      return "ServiceNow";
    case "product-hub":
      return "Product Hub";
    default:
      return cat;
  }
}

export function PresentationGallery({
  entries,
}: {
  entries: PresentationEntry[];
}) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? entries
      : entries.filter((e) => e.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.dateSort - a.dateSort;
  });

  const counts = {
    all: entries.length,
    products: entries.filter((e) => e.category === "products").length,
    conver: entries.filter((e) => e.category === "conver").length,
    "agent-library": entries.filter((e) => e.category === "agent-library")
      .length,
    servicenow: entries.filter((e) => e.category === "servicenow").length,
    "product-hub": entries.filter((e) => e.category === "product-hub").length,
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-10">
        {CATEGORIES.map((cat) => {
          const count = counts[cat.id as keyof typeof counts];
          if (count === 0 && cat.id !== "all") return null;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-foreground/[0.06] text-foreground/60 hover:bg-foreground/[0.1] hover:text-foreground/80"
                }
              `}
            >
              {cat.label}
              <span
                className={`ml-1.5 ${isActive ? "text-background/60" : "text-foreground/30"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-foreground/40 mb-6">
        {sorted.length} presentation{sorted.length !== 1 ? "s" : ""} — sorted
        newest first
      </p>

      <div className="grid gap-3">
        {sorted.map((entry) => (
          <Link
            key={entry.slug}
            href={`/p/${entry.slug}`}
            className="group block border border-foreground/10 rounded-lg p-5 hover:border-foreground/25 hover:bg-foreground/[0.03] transition-all duration-200"
          >
              <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 mb-1">
                  {entry.pinned && (
                    <span className="shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/60">
                      PIN
                    </span>
                  )}
                  {entry.tags?.status && (
                    <span className={`shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded ${statusColour(entry.tags.status)}`}>
                      {entry.tags.status}
                    </span>
                  )}
                  {entry.tags?.maturity && (
                    <span className="shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/60">
                      {entry.tags.maturity}
                    </span>
                  )}
                  <h2 className="text-base font-semibold text-foreground group-hover:text-foreground/90 truncate">
                    {entry.title}
                  </h2>
                </div>
                {entry.subtitle && (
                  <p className="text-sm text-foreground/50 mt-0.5 line-clamp-2">
                    {entry.subtitle}
                  </p>
                )}
                {entry.author && entry.author !== "Datacom" && (
                  <p className="text-xs text-foreground/40 mt-1">
                    {entry.author}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${categoryColour(entry.category)}`}
                >
                  {categoryLabel(entry.category)}
                </span>
                <span className="text-xs text-foreground/40">
                  {entry.slideCount} slides
                </span>
                {entry.date && (
                  <span className="text-xs text-foreground/40">
                    {entry.date}
                  </span>
                )}
                <span className="text-foreground/20 group-hover:text-foreground/40 transition-colors">
                  ↗
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-20 text-foreground/30">
          <p className="text-lg">No presentations in this category yet.</p>
        </div>
      )}
    </>
  );
}
