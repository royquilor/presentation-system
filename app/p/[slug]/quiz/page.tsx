import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Quiz } from "@/content/types";
import { QuizPresentation } from "@/components/quiz-presentation";

const PRESENTATIONS_DIRS = [
  path.join(process.cwd(), "content", "presentations"),
  path.join(process.cwd(), "content", "detailed-presentations"),
  path.join(process.cwd(), "content", "agent-library-presentations"),
  path.join(process.cwd(), "content", "servicenow-presentations"),
  path.join(process.cwd(), "content", "product-hub-presentations"),
  path.join(process.cwd(), "content", "capability"),
  path.join(process.cwd(), "content", "products"),
  path.join(process.cwd(), "content", "external-reports"),
];

function findQuizFile(slug: string): string | null {
  for (const dir of PRESENTATIONS_DIRS) {
    const fp = path.join(dir, `${slug}.quiz.json`);
    if (fs.existsSync(fp)) return fp;
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fp = findQuizFile(slug);
  if (!fp) return { title: "Quiz Not Found" };
  try {
    const quiz: Quiz = JSON.parse(fs.readFileSync(fp, "utf-8"));
    return { title: `${quiz.title} — Quiz` };
  } catch {
    return { title: "Quiz Error" };
  }
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fp = findQuizFile(slug);

  if (!fp) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background text-foreground gap-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-3">No Quiz Available</h1>
          <p className="text-foreground/50 text-base">
            There is no quiz for this presentation yet.
          </p>
        </div>
        <Link
          href={`/p/${slug}`}
          className="text-sm font-medium text-foreground/50 hover:text-foreground transition-colors border-b border-foreground/20 hover:border-foreground/60"
        >
          ← Back to presentation
        </Link>
      </div>
    );
  }

  let quiz: Quiz;
  try {
    const parsed = JSON.parse(fs.readFileSync(fp, "utf-8"));
    if (
      !parsed ||
      !Array.isArray(parsed.questions) ||
      parsed.questions.length === 0 ||
      !parsed.questions.every((q: Record<string, unknown>) => q.id && q.type)
    ) {
      throw new Error("Invalid quiz structure");
    }
    quiz = parsed as Quiz;
  } catch (e) {
    console.error(`Failed to load quiz for "${slug}":`, e);
    return notFound();
  }
  return <QuizPresentation quiz={quiz} slug={slug} />;
}
