import { promises as fs } from "fs";
import path from "path";

export type Frontmatter = {
  title?: string;
  description?: string;
  slug?: string;
  date?: string;
  updated?: string;
  authors?: string[];
  category?: string;
  tags?: string[];
  image?: string;
  canonical?: string;
  // We ignore nested seo/og/robots here for simplicity
  [key: string]: unknown;
};

export type ParsedMarkdown = {
  frontmatter: Frontmatter;
  body: string;
};

export function parseMarkdownWithFrontmatter(source: string): ParsedMarkdown {
  const delimiter = "---\n";
  if (!source.startsWith("---")) {
    return { frontmatter: {}, body: source };
  }

  // Find start and end of frontmatter
  const firstDelimEnd = source.indexOf(delimiter);
  // Start is at 0, find the next occurrence for end
  const rest = source.slice(firstDelimEnd + delimiter.length);
  const secondDelimIdx = rest.indexOf("\n---");

  if (secondDelimIdx === -1) {
    // Malformed; return as-is
    return { frontmatter: {}, body: source };
  }

  const fmRaw = rest.slice(0, secondDelimIdx + 0);
  const body = rest.slice(secondDelimIdx + "\n---".length + 1); // skip trailing newline after closing ---

  const frontmatter = parseSimpleYamlFrontmatter(fmRaw);
  return { frontmatter, body };
}

// Minimal YAML parser for our controlled frontmatter
function parseSimpleYamlFrontmatter(input: string): Frontmatter {
  const lines = input.split(/\r?\n/);
  const data: Record<string, unknown> = {};

  let currentKey: string | null = null;
  let currentList: string[] | null = null;
  let skippingNested = false;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, "  ");
    if (!line.trim()) continue;

    // Top-level key: "value"
    const kvMatch = line.match(/^([A-Za-z0-9_]+):\s*"([\s\S]*)"\s*$/);
    if (kvMatch && line[0] !== ' ') {
      const [, key, value] = kvMatch;
      data[key] = value;
      currentKey = null;
      currentList = null;
      skippingNested = false;
      continue;
    }

    // Top-level list start: key:
    const listStart = line.match(/^([A-Za-z0-9_]+):\s*$/);
    if (listStart && line[0] !== ' ') {
      const key = listStart[1];
      if (key === "seo" || key === "og" || key === "robots") {
        // Skip nested objects; resume on next top-level key
        skippingNested = true;
        currentKey = null;
        currentList = null;
        continue;
      }
      currentKey = key;
      currentList = [];
      data[key] = currentList;
      skippingNested = false;
      continue;
    }

    if (skippingNested) {
      // Continue until next top-level line (no leading space)
      if (line[0] !== ' ') {
        skippingNested = false;
      } else {
        continue;
      }
    }

    // List item:   - "value"
    const listItem = line.match(/^\s*-\s*"([\s\S]*)"\s*$/);
    if (listItem && currentList) {
      currentList.push(listItem[1]);
      continue;
    }

    // Fallback: simple top-level key: value (unquoted)
    const simpleKv = line.match(/^([A-Za-z0-9_]+):\s*([^\"]\S.*?)\s*$/);
    if (simpleKv && line[0] !== ' ') {
      const [, key, value] = simpleKv;
      data[key] = value;
      currentKey = null;
      currentList = null;
      skippingNested = false;
      continue;
    }
  }

  return data as Frontmatter;
}

export function deriveSlugFromFilename(filename: string): string {
  // Strip leading numeric prefix and extension
  const base = filename.replace(/\.md$/, "");
  const withoutPrefix = base.replace(/^\d+-/, "");
  return withoutPrefix
    .toLowerCase()
    .replace(/[^a-z0-9\-]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-|-$|\s+/g, "");
}

export function markdownToBasicHtml(markdown: string): string {
  // Very basic converter for headings, bold/italic, lists, and paragraphs
  let html = markdown.trim();
  html = html
    .replace(/^###\s+(.*)$/gim, '<h3 class="text-xl font-bold mb-3 mt-6 text-gray-800">$1<\/h3>')
    .replace(/^##\s+(.*)$/gim, '<h2 class="text-2xl font-bold mb-4 mt-8 text-gray-800">$1<\/h2>')
    .replace(/^#\s+(.*)$/gim, '<h1 class="text-3xl font-bold mb-6 text-gray-800">$1<\/h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-gray-800">$1<\/strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1<\/em>')
    .replace(/^\s*\-\s+(.*)$/gim, '<li class="ml-4 mb-2">$1<\/li>');

  // Convert consecutive lines to paragraphs
  html = html
    .replace(/\n{2,}/g, '</p><p class="mb-4">')
    .replace(/^(?!<h\d|<p|<ul|<li|<strong|<em)(.+)$/gim, '<p class="mb-4">$1<\/p>');

  // Wrap list items with <ul>
  html = html.replace(/(<li[\s\S]*?<\/li>)/gim, '<ul class="list-disc pl-6 mb-4">$1<\/ul>');
  return html;
}

const ARTICLES_DIR = path.join(process.cwd(), "mdArticles");

export type ArticleIndexItem = {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  updated?: string;
  authors?: string[];
  category?: string;
  tags?: string[];
  image?: string;
  canonical?: string;
  readTime?: string;
};

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function extractTitleFromMarkdown(markdown: string): string | undefined {
  const m = markdown.match(/^##?\s+(.+)$/m) || markdown.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : undefined;
}

function numericPrefix(filename: string): number | null {
  const m = filename.match(/^(\d+)/);
  return m ? Number(m[1]) : null;
}

export async function getAllArticles(): Promise<ArticleIndexItem[]> {
  const entries = await fs.readdir(ARTICLES_DIR);
  const mdFiles = entries.filter((f) => f.endsWith(".md"));

  const items = await Promise.all(
    mdFiles.map(async (filename) => {
      const fullPath = path.join(ARTICLES_DIR, filename);
      const source = await fs.readFile(fullPath, "utf8");
      const { frontmatter, body } = parseMarkdownWithFrontmatter(source);
      const slug = (frontmatter.slug as string) || deriveSlugFromFilename(filename);
      const title = (frontmatter.title as string) || extractTitleFromMarkdown(body) || slug;
      const description = (frontmatter.description as string) || undefined;
      const readTime = estimateReadTime(body);
      return {
        slug,
        title,
        description,
        date: (frontmatter.date as string) || undefined,
        updated: (frontmatter.updated as string) || undefined,
        authors: (frontmatter.authors as string[]) || undefined,
        category: (frontmatter.category as string) || undefined,
        tags: (frontmatter.tags as string[]) || undefined,
        image: (frontmatter.image as string) || undefined,
        canonical: (frontmatter.canonical as string) || undefined,
        readTime,
      } satisfies ArticleIndexItem;
    })
  );

  return items.sort((a, b) => {
    // Sort by numeric prefix if present, else by title
    const aNum = numericPrefix(a.slug);
    const bNum = numericPrefix(b.slug);
    if (aNum !== null && bNum !== null) return aNum - bNum;
    if (aNum !== null) return -1;
    if (bNum !== null) return 1;
    return a.title.localeCompare(b.title);
  });
}

export async function getArticleBySlug(slug: string): Promise<{ meta: ArticleIndexItem; body: string } | null> {
  const entries = await fs.readdir(ARTICLES_DIR);
  const mdFiles = entries.filter((f) => f.endsWith(".md"));
  for (const filename of mdFiles) {
    const fullPath = path.join(ARTICLES_DIR, filename);
    const source = await fs.readFile(fullPath, "utf8");
    const { frontmatter, body } = parseMarkdownWithFrontmatter(source);
    const fmSlug = (frontmatter.slug as string) || deriveSlugFromFilename(filename);
    if (fmSlug === slug) {
      const title = (frontmatter.title as string) || extractTitleFromMarkdown(body) || slug;
      const meta: ArticleIndexItem = {
        slug: fmSlug,
        title,
        description: (frontmatter.description as string) || undefined,
        date: (frontmatter.date as string) || undefined,
        updated: (frontmatter.updated as string) || undefined,
        authors: (frontmatter.authors as string[]) || undefined,
        category: (frontmatter.category as string) || undefined,
        tags: (frontmatter.tags as string[]) || undefined,
        image: (frontmatter.image as string) || undefined,
        canonical: (frontmatter.canonical as string) || undefined,
        readTime: estimateReadTime(body),
      };
      return { meta, body };
    }
  }
  return null;
}

export async function getAllSlugs(): Promise<string[]> {
  const articles = await getAllArticles();
  return articles.map((a) => a.slug);
}

