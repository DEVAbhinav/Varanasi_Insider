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

// Pre-process: URL-encode literal spaces inside bare media/link destinations so
// markdown like ![alt](https://host/varanasi tourist map.jpeg) resolves instead
// of rendering as literal text. Only targets unquoted http(s):// or root-relative
// destinations that contain a space — titled images (dest "title") are left alone.
function encodeMediaUrlSpaces(markdown) {
  if (!markdown || markdown.indexOf('](') === -1) return markdown;
  // Destination starts with http(s):// or /, contains >=1 literal space, and may
  // be followed by an optional quoted "title". Encode spaces in the URL only.
  const RE = /(!?\[[^\]]*\]\()((?:https?:\/\/|\/)[^\s"'()]*(?:[ \t]+[^\s"'()]+)+)((?:[ \t]+["'][^"']*["'])?\s*\))/g;
  return markdown.replace(RE, (_, open, dest, tail) => open + dest.replace(/[ \t]/g, '%20') + tail);
}

// Rehype plugin: support the `## Heading {#custom-id}` anchor syntax. Without this
// the token renders as literal text in the heading. Runs before rehypeSlug, which
// only auto-generates ids for headings that do not already have one.
function rehypeHeadingIds() {
  const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
  const RE = /\s*\{#([A-Za-z0-9._-]+)\}\s*$/;
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (!HEADINGS.has(node.tagName)) return;
      const children = node.children || [];
      for (let i = children.length - 1; i >= 0; i -= 1) {
        const child = children[i];
        if (child.type !== 'text') continue;
        const match = child.value.match(RE);
        if (!match) break;
        child.value = child.value.replace(RE, '');
        node.properties = { ...(node.properties || {}), id: match[1] };
        if (!child.value.trim()) children.splice(i, 1);
        break;
      }
    });
  };
}

// Rehype plugin: turn ad-hoc inline WhatsApp text-links into the shared on-brand
// button pill (same green pill used by lib/ctaBlocks). Skips anchors that already
// carry the shared CTA pill styling so structured {{CTA:...}} blocks are untouched.
function rehypeWhatsAppButtons() {
  const BTN_STYLE =
    'background:#16a34a;color:#ffffff;padding:8px 16px;border-radius:9999px;' +
    'text-decoration:none;display:inline-block;font-weight:700;font-size:0.95rem;' +
    'box-shadow:0 3px 10px rgba(22,163,74,0.2);white-space:nowrap;margin:2px 0;';
  const hasGlyph = (s) => /whatsapp|💬|📲|📱|🟢/i.test(s);
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const props = node.properties || {};
      const href = String(props.href || '');
      if (!/^https?:\/\/wa\.me\//i.test(href)) return;
      if (String(props.style || '').includes('border-radius:9999px')) return; // already a shared CTA pill
      const classList = [].concat(props.className || []).join(' ');
      if (/\b(fare-hero__btn|cta-)/.test(classList)) return; // structured hero / CTA button — leave styling to CSS
      const text = (node.children || [])
        .filter((c) => c.type === 'text')
        .map((c) => c.value)
        .join('');
      node.properties = {
        ...props,
        className: [].concat(props.className || [], 'wa-inline-btn'),
        style: BTN_STYLE,
      };
      // Autolinked bare wa.me URLs render the whole query string as label text.
      // Replace that with a readable call-to-action instead.
      if (/^\s*https?:\/\/wa\.me\//i.test(text)) {
        node.children = [{ type: 'text', value: '💬 Book on WhatsApp' }];
        return;
      }
      if (!hasGlyph(text)) {
        node.children = [{ type: 'text', value: '💬 ' }, ...(node.children || [])];
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
    .use(rehypeHeadingIds) // honour `## Heading {#custom-id}` before slugs are generated
    .use(rehypeSlug)      // add id="" to headings for TOC / anchor links
    .use(rehypeCallouts)  // convert emoji blockquotes to styled callouts
    .use(rehypeWhatsAppButtons) // style ad-hoc inline WhatsApp links as CTA buttons
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(injectCtaShortcodes(encodeMediaUrlSpaces(normalizeContactContent(markdown))));
  return processed.toString();
}

// Demote body <h1> headings to <h2> (preserving attributes such as id).
// Used on templates that already render a hero/header <h1>, so the markdown
// body's leading H1 does not create a second, duplicate H1 on the page.
export function demoteContentHeadings(html) {
  if (!html) return html;
  return html
    .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>')
    .replace(/<\/h1>/gi, '</h2>');
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
