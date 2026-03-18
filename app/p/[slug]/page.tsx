import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { parseMarkdownToReport } from "@/lib/parse-markdown";
import { DynamicPresentation } from "@/components/dynamic-presentation";
import { getAuthorForSlug } from "@/content/author-map";

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

function findQuizFile(slug: string): boolean {
  for (const dir of PRESENTATIONS_DIRS) {
    const fp = path.join(dir, `${slug}.quiz.json`);
    if (fs.existsSync(fp)) return true;
  }
  return false;
}

function getMarkdownFiles(): string[] {
  const files: string[] = [];
  for (const dir of PRESENTATIONS_DIRS) {
    try {
      files.push(
        ...fs
          .readdirSync(dir)
          .filter((f) => f.endsWith(".md") && f !== "INDEX.md")
      );
    } catch {
      // directory may not exist
    }
  }
  return [...new Set(files)];
}

function findFile(slug: string): string | null {
  for (const dir of PRESENTATIONS_DIRS) {
    const fp = path.join(dir, `${slug}.md`);
    if (fs.existsSync(fp)) return fp;
  }
  return null;
}

export async function generateStaticParams() {
  return getMarkdownFiles().map((file) => ({
    slug: file.replace(/\.md$/, ""),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = findFile(slug);
  if (!filePath) return { title: "Not Found" };
  const md = fs.readFileSync(filePath, "utf-8");
  const report = parseMarkdownToReport(md);
  return {
    title: `${report.title} — Datacom`,
    description: report.subtitle,
  };
}

export default async function PresentationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = findFile(slug);

  if (!filePath) notFound();

  const md = fs.readFileSync(filePath, "utf-8");
  const report = parseMarkdownToReport(md);

  if (!report.author.avatarUrl) {
    const mapped = getAuthorForSlug(slug);
    if (mapped) {
      report.author.name = mapped.name;
      report.author.avatarUrl = mapped.profileUrl;
      report.author.initials = mapped.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
  }

  const hasQuiz = findQuizFile(slug);
  return <DynamicPresentation report={report} slug={slug} hasQuiz={hasQuiz} />;
}
