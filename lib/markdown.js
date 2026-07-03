// Unified markdown processing utility to ensure consistent support for GFM tables,
// strikethrough, task lists across all dynamic content types (posts, packages, bus, services).
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { normalizeContactContent } from './contact';
import { injectCtaShortcodes } from './ctaBlocks';

// Rehype plugin: convert blockquotes starting with emoji markers into callout boxes.
// Patterns:  > ⚠️ …  > 💡 …  > 📍 …  > ℹ️ …  > ✅ …
function rehypeCallouts() {
  const markers = {
    '⚠️':  'warning',
    '💡':  'tip',
    '📍':  'info',
    'ℹ️':  'info',
    '✅':  'success',
  };

  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'blockquote') return;
      // Get the text content of the first paragraph
      const firstP = node.children?.find((c) => c.tagName === 'p');
      if (!firstP) return;
      const firstText = firstP.children?.find((c) => c.type === 'text');
      if (!firstText?.value) return;

      for (const [emoji, type] of Object.entries(markers)) {
        if (firstText.value.trimStart().startsWith(emoji)) {
          node.properties = node.properties || {};
          node.properties.className = (node.properties.className || []).concat(`callout`, `callout-${type}`);
          // Strip the emoji from the rendered text
          firstText.value = firstText.value.trimStart().slice(emoji.length).trimStart();
          break;
        }
      }
    });
  };
}

export async function markdownToHtml(markdown) {
  if (!markdown) return '';
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)       // parse inline HTML in markdown
    .use(rehypeSlug)      // add id="" to headings for TOC / anchor links
    .use(rehypeCallouts)  // convert emoji blockquotes to styled callouts
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(injectCtaShortcodes(normalizeContactContent(markdown)));
  return processed.toString();
}

// Extract heading structure from HTML for Table of Contents
export function extractHeadings(html) {
  if (!html) return [];
  const regex = /<h([23])\s+id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
  const headings = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, '').trim(),
    });
  }
  return headings;
}
