// Unified markdown processing utility to ensure consistent support for GFM tables,
// strikethrough, task lists across all dynamic content types (posts, packages, bus, services).
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

export async function markdownToHtml(markdown) {
  if (!markdown) return '';
  const processed = await remark()
    .use(remarkGfm) // enable GitHub Flavored Markdown first
    .use(html)      // then convert to HTML
    .process(markdown);
  return processed.toString();
}
