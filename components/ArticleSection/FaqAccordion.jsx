import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FaqAccordion({ items = [] }) {
  const validItems = (items || [])
    .map((item) => ({
      question: item.question || item.q,
      answer: item.answer || item.a,
    }))
    .filter((item) => item.question && item.answer);

  if (validItems.length === 0) return null;

  return (
    <section className="my-10">
      <h2 className="mb-4 text-2xl font-bold text-slate-900" style={{ fontFamily: 'Inter, Helvetica Neue, sans-serif' }}>
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {validItems.map(({ question, answer }, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-b border-slate-100 last:border-0">
            <AccordionTrigger className="px-5 py-4 text-left text-[15px] font-semibold text-slate-800 hover:no-underline hover:bg-slate-50 transition-colors">
              {question}
            </AccordionTrigger>
            <AccordionContent className="px-5 text-[15px] leading-relaxed text-slate-600">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
