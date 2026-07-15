// components/commerce/ItineraryAccordion.jsx
// Day-by-day / segment itinerary using the shared accordion primitive.

import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function ItineraryAccordion({ itinerary = [], className = '' }) {
  if (!itinerary?.length) return null;
  return (
    <Accordion type="single" collapsible className={className} defaultValue="itin-0">
      {itinerary.map((seg, i) => (
        <AccordionItem key={i} value={`itin-${i}`}>
          <AccordionTrigger className="text-left">
            <span className="font-medium">
              {(seg.label || seg.day) && (
                <span className="mr-2 text-primary">{seg.label || seg.day}</span>
              )}
              {seg.title}
            </span>
          </AccordionTrigger>
          {seg.detail && <AccordionContent>{seg.detail}</AccordionContent>}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
