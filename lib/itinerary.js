import fs from 'fs';
import path from 'path';
import { remark } from 'remark';

const IMAGE_TOKEN_PATTERN = /\[(?:image|img)\s*:\s*([^\]]+)\]/gi;
const missingImageMemo = new Set();
const resolvedImageCache = new Map();

const HEURISTIC_IMAGE_LIBRARY = [
  {
    keywords: ['sunrise', 'subah', 'dawn', 'morning yoga', 'assi ghat'],
    spec: 'varanasi-subeh-e-banaras-p.jpeg|Subah-e-Banaras sunrise at Assi Ghat',
  },
  {
    keywords: ['sunset', 'twilight', 'evening aarti', 'arti', 'dashashwamedh'],
    spec: 'ganga-aarti-ceremony-2025.jpg|Dashashwamedh Ganga Aarti at dusk',
  },
  {
    keywords: ['boat', 'cruise', 'river', 'ghat hopping', 'private boat'],
    spec: 'varanasi-boat-bird-river-p.jpeg|Private boat gliding past Varanasi ghats',
  },
  {
    keywords: ['temple', 'darshan', 'vishwanath', 'mandir', 'shrine'],
    spec: 'varanasi-kashivishwanath-outside-l.jpeg|Kashi Vishwanath Temple corridor exterior',
  },
  {
    keywords: ['sarnath', 'stupa', 'buddha', 'dhamek'],
    spec: 'Sarnath-Stoopa-Square-beautiful-large.jpeg|Dhamek Stupa in Sarnath',
  },
  {
    keywords: ['bhu', 'campus', 'museum', 'university'],
    spec: 'blogbhu.jpg|Banaras Hindu University campus lanes',
  },
  {
    keywords: ['silk', 'weaving', 'loom', 'handloom'],
    spec: 'varanasi-ghat-wallpaper-p.jpeg|Varanasi old city lanes and bazaars',
  },
  {
    keywords: ['fort', 'ramnagar', 'museum'],
    spec: 'varanasi-river-bajra.jpeg|Boat passing Ramnagar Fort riverfront',
  },
  {
    keywords: ['food', 'breakfast', 'kachori', 'jalebi', 'snack'],
    spec: 'assi-aarti-evening-p-2.jpeg|Banarasi street food vendors near the ghats',
  },
  {
    keywords: ['market', 'bazaar', 'shopping', 'souvenir'],
    spec: 'varanasi-ghat-boat-eve-p.jpeg|Evening bustle along Varanasi ghats',
  },
];

const PERIOD_IMAGE_SUGGESTIONS = {
  sunrise: 'varanasi-river-sunrise-boat-p.jpeg|Sunrise boat ride along the Ganga',
  morning: 'varanasi-ghat-early-morning.jpeg|Early morning rituals on the ghats',
  midday: 'varanasi-ghats-overview.jpeg|Panoramic view of Varanasi ghats',
  afternoon: 'varanasi-ghats-overview.jpeg|Panoramic view of Varanasi ghats',
  evening: 'ganga-aarti-ceremony-2025.jpg|Dashashwamedh Ganga Aarti at dusk',
  night: 'varanasi-night-boat-ghat-p.jpeg|Night cruise alongside illuminated ghats',
};

const GENERIC_IMAGE_TOKENS = new Set(['varanasi', 'kashi', 'day', 'tour', 'package', 'experience', 'highlight', 'travel', 'itinerary']);
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
let imageInventoryCache = null;

const sanitizeToken = (value) => {
  if (!value) return '';
  return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
};

const toTitleCase = (value) => (
  value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
);

const buildAltFromFilename = (baseName) => {
  if (!baseName) return null;
  const cleaned = baseName.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return null;
  return toTitleCase(cleaned);
};

const collectImageInventory = () => {
  const root = path.join(process.cwd(), 'public', 'images');
  const inventory = [];

  if (!fs.existsSync(root)) {
    return inventory;
  }

  const walk = (currentAbsolute, relativeSegments) => {
    let items;
    try {
      items = fs.readdirSync(currentAbsolute);
    } catch (err) {
      return;
    }

    items.forEach((item) => {
      if (!item || item.startsWith('.')) {
        return;
      }

      const absolutePath = path.join(currentAbsolute, item);
      let stats;
      try {
        stats = fs.statSync(absolutePath);
      } catch (err) {
        return;
      }

      if (stats.isDirectory()) {
        walk(absolutePath, [...relativeSegments, item]);
        return;
      }

      if (!stats.isFile()) {
        return;
      }

      const ext = path.extname(item).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(ext)) {
        return;
      }

      const baseName = path.basename(item, ext);
      const normalizedBase = baseName.toLowerCase();
      const tokenList = normalizedBase.split(/[^a-z0-9]+/).filter((segment) => segment && segment.length >= 3);
      const tokens = new Set(tokenList);
      const relativePath = [...relativeSegments, item].join(path.sep);
      const src = `/${path.join('images', relativePath).replace(/\\/g, '/')}`;
      const alt = buildAltFromFilename(baseName);

      inventory.push({
        src,
        baseName: normalizedBase,
        tokens,
        alt: alt || null,
      });
    });
  };

  walk(root, []);

  return inventory;
};

const getImageInventory = () => {
  if (imageInventoryCache) {
    return imageInventoryCache;
  }

  imageInventoryCache = collectImageInventory();
  return imageInventoryCache;
};

const selectInventoryImage = (title, description, period) => {
  const inventory = getImageInventory();
  if (!inventory || inventory.length === 0) {
    return null;
  }

  const rawTokens = [];

  const appendTokens = (value) => {
    if (!value) return;
    value.toLowerCase().split(/[^a-z0-9]+/).forEach((token) => {
      const normalised = sanitizeToken(token);
      if (!normalised || normalised.length < 3) return;
      rawTokens.push(normalised);
    });
  };

  if (period) {
    const periodToken = sanitizeToken(period);
    if (periodToken) {
      rawTokens.push(periodToken);
    }
  }

  appendTokens(title);
  appendTokens(description);

  if (rawTokens.length === 0) {
    return null;
  }

  const orderedTokens = [];
  const seen = new Set();
  rawTokens.forEach((token) => {
    if (GENERIC_IMAGE_TOKENS.has(token)) {
      return;
    }
    if (!seen.has(token)) {
      seen.add(token);
      orderedTokens.push(token);
    }
  });

  if (orderedTokens.length === 0) {
    return null;
  }

  orderedTokens.sort((a, b) => b.length - a.length);

  for (const token of orderedTokens) {
    const match = inventory.find((entry) => entry.tokens.has(token) || entry.baseName.includes(token));
    if (match) {
      return match;
    }
  }

  return null;
};

const resolveImageSpec = (rawSpec) => {
  if (!rawSpec) return null;

  if (resolvedImageCache.has(rawSpec)) {
    return resolvedImageCache.get(rawSpec);
  }

  const [pathSegmentRaw, ...altSegments] = rawSpec.split('|');
  const pathSegment = pathSegmentRaw?.replace(/['"]/g, '').trim();
  const alt = altSegments.length > 0 ? altSegments.join('|').replace(/['"]/g, '').trim() : null;

  if (!pathSegment) {
    return null;
  }

  if (/^(?:https?:)?\/\//i.test(pathSegment)) {
    return { src: pathSegment, alt };
  }

  let relativePath = pathSegment.replace(/^\/+/, '');
  if (!relativePath.startsWith('images/')) {
    relativePath = `images/${relativePath}`;
  }

  const fullPath = path.join(process.cwd(), 'public', relativePath);
  if (!fs.existsSync(fullPath)) {
    if (!missingImageMemo.has(relativePath)) {
      missingImageMemo.add(relativePath);
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[itinerary] Missing image asset referenced in itinerary: ${relativePath}`);
      }
    }
    resolvedImageCache.set(rawSpec, null);
    return null;
  }

  const resolved = {
    src: `/${relativePath.replace(/\\/g, '/')}`,
    alt: alt || null,
  };

  resolvedImageCache.set(rawSpec, resolved);
  return resolved;
};

const selectPeriodImage = (period) => {
  if (!period) return null;
  const spec = PERIOD_IMAGE_SUGGESTIONS[period.toLowerCase()];
  if (!spec) return null;
  return resolveImageSpec(spec);
};

const selectHeuristicImage = (title, description, period) => {
  const sample = [title, description].filter(Boolean).map((value) => value.toLowerCase()).join(' ');
  if (sample) {
    for (const entry of HEURISTIC_IMAGE_LIBRARY) {
      if (entry.keywords.some((keyword) => sample.includes(keyword))) {
        const resolved = resolveImageSpec(entry.spec);
        if (resolved?.src) {
          return resolved;
        }
      }
    }
  }

  const resolvedByPeriod = selectPeriodImage(period);
  if (resolvedByPeriod?.src) {
    return resolvedByPeriod;
  }

  return null;
};

const extractImageTokens = (value) => {
  if (!value) {
    return { text: value, image: null, imageAlt: null };
  }

  let image = null;
  let imageAlt = null;
  IMAGE_TOKEN_PATTERN.lastIndex = 0;
  const matches = [...value.matchAll(IMAGE_TOKEN_PATTERN)];

  for (const match of matches) {
    if (!match || match.length < 2) continue;
    if (!image) {
      const resolved = resolveImageSpec(match[1]?.trim());
      if (resolved?.src) {
        image = resolved.src;
        imageAlt = resolved.alt || null;
      }
    }
  }

  IMAGE_TOKEN_PATTERN.lastIndex = 0;
  const text = value.replace(IMAGE_TOKEN_PATTERN, ' ').replace(/\s{2,}/g, ' ').trim();

  return {
    text,
    image,
    imageAlt,
  };
};

const ITINERARY_HEADING_PATTERN = /(itinerar(?:y|ies)|day[-\s]?by[-\s]?day|timeline)/i;
const ITINERARY_FALLBACK_HEADING_PATTERN = /(\b\d+\s*[-–]\s*day\b|\bday\s+trip\b)/i;
const SEGMENT_DAY_PATTERN = /^day\s+\d+/i;
const SEGMENT_OPTION_PATTERN = /^(option|variant)\b/i;
const SEGMENT_TIME_PATTERN = /^(sunrise|sunset|morning|midday|afternoon|evening|night|dawn|dusk|twilight|pre[-\s]?dawn|late night)/i;

const PERIOD_TOKENS = {
  sunrise: ['sunrise', 'dawn', 'pre-dawn'],
  morning: ['morning', 'forenoon'],
  midday: ['midday', 'noon'],
  afternoon: ['afternoon', 'post-lunch'],
  evening: ['evening', 'dusk', 'twilight', 'sunset'],
  night: ['night', 'late night', 'midnight'],
};

const toPlainText = (node) => {
  if (!node) return '';
  if (node.type === 'text' || node.type === 'inlineCode') {
    return node.value || '';
  }
  if (Array.isArray(node.children)) {
    return node.children.map((child) => toPlainText(child)).join('');
  }
  if (typeof node.value === 'string') {
    return node.value;
  }
  return '';
};

const normaliseWhitespace = (value) => value.replace(/\s+/g, ' ').trim();

const looksLikeTableText = (value) => {
  if (!value) return false;
  const pipeCount = (value.match(/\|/g) || []).length;
  return pipeCount >= 4;
};

const matchesItineraryAnchor = (node) => (
  node.type === 'heading'
  && node.depth === 2
  && (() => {
    const text = toPlainText(node).trim();
    if (!text) return false;
    if (ITINERARY_HEADING_PATTERN.test(text)) return true;
    return ITINERARY_FALLBACK_HEADING_PATTERN.test(text);
  })()
);

const firstChild = (node) => (Array.isArray(node?.children) ? node.children[0] : null);

const paragraphStartsWithStrong = (paragraph) => {
  if (!paragraph || paragraph.type !== 'paragraph') return false;
  const child = firstChild(paragraph);
  if (!child) return false;
  if (child.type === 'strong') return true;
  if (child.type === 'link' && child.children?.[0]?.type === 'strong') return true;
  return false;
};

const cleanRemainder = (value) => value.replace(/^[-–—:;·\.,\s]+/, '').trim();

const detectPeriod = (token) => {
  if (!token) return null;
  const lowered = token.toLowerCase();
  return Object.entries(PERIOD_TOKENS).reduce((found, [period, variants]) => (
    found || (variants.some((variant) => lowered.includes(variant)) ? period : null)
  ), null);
};

const buildEvent = (leadingText, remainderText) => {
  const { text: cleanTitle, image: titleImage, imageAlt: titleImageAlt } = extractImageTokens(leadingText);
  const title = normaliseWhitespace(cleanTitle);
  if (!title) return null;

  let description = null;
  let image = titleImage || null;
  let imageAlt = titleImageAlt || null;

  if (remainderText) {
    const cleanedRemainder = cleanRemainder(remainderText);
    const { text: remainderClean, image: remainderImage, imageAlt: remainderImageAlt } = extractImageTokens(cleanedRemainder);
    const normalisedDescription = normaliseWhitespace(remainderClean);
    description = normalisedDescription || null;

    if (remainderImage && !image) {
      image = remainderImage;
      imageAlt = remainderImageAlt || imageAlt;
    }
  }

  const period = detectPeriod(title);

  if (!image) {
    const inventoryMatch = selectInventoryImage(title, description, period);
    if (inventoryMatch?.src) {
      image = inventoryMatch.src;
      imageAlt = imageAlt || inventoryMatch.alt || null;
    }
  }

  if (!image) {
    const heuristic = selectHeuristicImage(title, description, period);
    if (heuristic?.src) {
      image = heuristic.src;
      imageAlt = imageAlt || heuristic.alt || null;
    }
  }

  return {
    title,
    description,
    period: period || null,
    image: image || null,
    imageAlt: imageAlt || null,
  };
};

const extractEventFromParagraph = (paragraph) => {
  if (!paragraphStartsWithStrong(paragraph)) {
    return null;
  }

  const leadingNode = firstChild(paragraph);
  const leadingText = toPlainText(leadingNode).trim();
  const remainderNodes = paragraph.children.slice(1);
  const remainderText = toPlainText({ type: 'paragraph', children: remainderNodes });

  return buildEvent(leadingText, remainderText);
};

const LIST_SEPARATOR_PATTERNS = [
  /^(.*?)\s[-–—]\s(.*)$/, // hyphen/en dash/em dash with surrounding spaces
  /^(.*?):\s*(.*)$/, // colon separator
  /^(.*?)·\s*(.*)$/, // middle dot with optional trailing space
];

const extractEventFromListItem = (item) => {
  if (!item || !Array.isArray(item.children)) {
    return null;
  }

  const primary = item.children.find((child) => child.type === 'paragraph') || item.children[0];
  if (!primary) {
    return null;
  }

  if (primary.type === 'paragraph') {
    const direct = extractEventFromParagraph(primary);
    if (direct) {
      return direct;
    }
  }

  const text = normaliseWhitespace(toPlainText(primary));
  if (!text) {
    return null;
  }

  for (const pattern of LIST_SEPARATOR_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const [, rawTitle, rawDescription] = match;
      return buildEvent(rawTitle, rawDescription);
    }
  }

  return buildEvent(text, null);
};

const pushSegment = (collection, segment) => {
  if (!segment) return;
  const hasEvents = Array.isArray(segment.events) && segment.events.length > 0;
  if (!hasEvents) return;
  collection.push({
    label: segment.label || null,
    summary: segment.summary || null,
    events: segment.events,
    sourceRange: segment.sourceRange || null,
  });
};

const isSegmentHeading = (node) => {
  if (node.type !== 'heading') return false;
  const text = toPlainText(node).trim();
  if (!text) return false;
  if (node.depth >= 3) return true;
  if (SEGMENT_DAY_PATTERN.test(text)) return true;
  if (SEGMENT_OPTION_PATTERN.test(text)) return true;
  if (SEGMENT_TIME_PATTERN.test(text)) return true;
  return false;
};

const shouldStopParsing = (node) => {
  if (node.type !== 'heading') return false;
  const depth = node.depth || 0;
  if (depth <= 2 && !isSegmentHeading(node) && !matchesItineraryAnchor(node)) {
    return true;
  }
  return false;
};

const createSegment = (label, node) => ({
  label: normaliseWhitespace(label) || null,
  summary: null,
  events: [],
  sourceRange: {
    start: node?.position?.start?.offset ?? null,
    end: node?.position?.end?.offset ?? null,
  },
});

const extendSegmentRange = (segment, node) => {
  if (!segment || !node?.position) return;
  const { start, end } = node.position;
  if (start && typeof start.offset === 'number' && segment.sourceRange.start === null) {
    segment.sourceRange.start = start.offset;
  }
  if (end && typeof end.offset === 'number') {
    segment.sourceRange.end = end.offset;
  }
};

export const extractItineraryFromMarkdown = (markdown) => {
  if (!markdown) return null;

  const tree = remark().parse(markdown);
  const segments = [];
  const introParts = [];
  let timelineTitle = null;
  let parsing = false;
  let currentSegment = null;
  let startOffset = null;
  let endOffset = null;

  const markNode = (node) => {
    if (!node?.position) return;
    const { start, end } = node.position;
    if (start && typeof start.offset === 'number' && startOffset === null) {
      startOffset = start.offset;
    }
    if (end && typeof end.offset === 'number') {
      endOffset = end.offset;
    }
  };

  const flushSegment = () => {
    pushSegment(segments, currentSegment);
    currentSegment = null;
  };

  for (let index = 0; index < tree.children.length; index += 1) {
    const node = tree.children[index];

    if (!parsing) {
      if (matchesItineraryAnchor(node)) {
        parsing = true;
        timelineTitle = normaliseWhitespace(toPlainText(node)) || null;
        markNode(node);
        continue;
      }

      if (node.type === 'heading' && node.depth === 2 && isSegmentHeading(node)) {
        parsing = true;
        timelineTitle = timelineTitle || 'Detailed Itinerary';
        markNode(node);
        // fall through so the heading can be processed as a segment below
      } else {
        continue;
      }
    }

    if (shouldStopParsing(node)) {
      break;
    }

    if (node.type === 'heading' && isSegmentHeading(node)) {
      flushSegment();
      markNode(node);
      currentSegment = createSegment(toPlainText(node), node);
      extendSegmentRange(currentSegment, node);
      continue;
    }

    if (!currentSegment) {
      if (node.type === 'paragraph') {
        const text = normaliseWhitespace(toPlainText(node));
        if (text && !looksLikeTableText(text)) {
          introParts.push(text);
        }
        markNode(node);
        continue;
      }

      if (node.type === 'table') {
        markNode(node);
        continue;
      }

      continue;
    }

    if (node.type === 'paragraph') {
      extendSegmentRange(currentSegment, node);
      let handled = false;
      if (!currentSegment.summary && !paragraphStartsWithStrong(node)) {
        const candidateSummary = normaliseWhitespace(toPlainText(node)) || null;
        if (candidateSummary && !looksLikeTableText(candidateSummary)) {
          currentSegment.summary = candidateSummary;
          markNode(node);
          handled = true;
        }
      }

      if (!handled) {
        const event = extractEventFromParagraph(node);
        if (event) {
          currentSegment.events.push(event);
          markNode(node);
          handled = true;
        }
      }

      if (!handled) {
        markNode(node);
      }
      continue;
    }

    if (node.type === 'list') {
      extendSegmentRange(currentSegment, node);
      node.children.forEach((item) => {
        const event = extractEventFromListItem(item);
        if (event) {
          currentSegment.events.push(event);
        }
      });
      markNode(node);
      continue;
    }

    if (node.type === 'table') {
      extendSegmentRange(currentSegment, node);
      markNode(node);
      continue;
    }
  }

  flushSegment();

  if (segments.length === 0) {
    return null;
  }

  const itinerary = {
    title: timelineTitle,
    intro: introParts.length > 0 ? introParts.join(' ') : null,
    accentColor: null,
    days: segments,
  };

  const range = (typeof startOffset === 'number' && typeof endOffset === 'number' && endOffset > startOffset)
    ? { start: startOffset, end: endOffset }
    : null;

  return {
    itinerary,
    range,
  };
};

export default extractItineraryFromMarkdown;
