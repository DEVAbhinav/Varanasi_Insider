import { extractHeadings } from '@/lib/markdown';
import TableOfContents from './TableOfContents';
import QuickFacts from './QuickFacts';
import FaqAccordion from './FaqAccordion';

/**
 * Shared content-enhancement wrapper.
 *
 * Drop this into any page renderer to get TOC, Quick Facts and FAQ accordion
 * without duplicating the heading-extraction / body-FAQ-detection logic.
 *
 * Usage (inline — after first content block):
 *   <ContentEnhancements.Inline html={fullHtml} quickFacts={data.quickFacts} />
 *
 * Usage (bottom — before CTA):
 *   <ContentEnhancements.Bottom html={fullHtml} faqSchema={data.faqSchema} />
 */

function useEnhancementData(html) {
  const headings = extractHeadings(html || '');
  const bodyHasFaq = /<h[23][^>]*>.*?(?:FAQs?|Frequently Asked|अक्सर पूछे|सामान्य सवाल|आम सवाल)/i.test(html || '');
  return { headings, bodyHasFaq };
}

/** Renders Quick Facts + TOC — place after the first ArticleSection block. */
export function InlineEnhancements({ html, quickFacts }) {
  const { headings } = useEnhancementData(html);
  return (
    <>
      <TableOfContents headings={headings} />
      {quickFacts?.length > 0 && <QuickFacts facts={quickFacts} />}
    </>
  );
}

/** Renders FAQ accordion — place before CTA. Skips if body already has FAQ. */
export function BottomEnhancements({ html, faqSchema }) {
  const { bodyHasFaq } = useEnhancementData(html);
  if (!faqSchema?.length || bodyHasFaq) return null;
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-3xl">
        <FaqAccordion items={faqSchema} />
      </div>
    </div>
  );
}

const ContentEnhancements = { Inline: InlineEnhancements, Bottom: BottomEnhancements };
export default ContentEnhancements;
