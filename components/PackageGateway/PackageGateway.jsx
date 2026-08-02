import Image from 'next/image';
import Link from 'next/link';
import { Check, MessageCircle, Sparkles } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/contact';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PACKAGE_NEEDS = [
  'Stay and private cab arranged together',
  'Temple visits, Ganga Aarti and boat rides',
  'Comfortable pace for families and elders',
  'Optional Ayodhya, Prayagraj or Gaya days',
];

export default function PackageGateway() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-cyan-50/40 to-white py-14 md:py-16">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-amber-200/25 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <Card className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl border-cyan-100 shadow-lg md:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[300px] overflow-hidden md:min-h-full">
            <Image
              src="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Ganga-boat-birds-ghats-morning-l.jpg"
              alt="Morning boat on the Ganga with Varanasi ghats in the background"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200">
                Stay · cab · sightseeing
              </p>
              <p className="mt-2 text-xl font-bold leading-snug md:text-2xl">
                Share your dates and group size. We shape a simple day-by-day plan.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-9 lg:p-10">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Full trip packages
            </Badge>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight text-slate-950 md:text-3xl">
              Planning a full trip to Varanasi?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Looking for a hotel, temple visits, boat rides and a private cab in one plan?
              Start here for 2, 3 or 4 day options shaped around your family and arrival time.
            </p>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {PACKAGE_NEEDS.map((need) => (
                <div key={need} className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-medium leading-snug text-slate-700">{need}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="lg">
                <Link
                  href="/en/packages/varanasi-tour-package"
                  data-cta-id="home_single_package_gateway"
                  data-cta-location="home_package_gateway"
                  data-page-type="generic_taxi_owner"
                  data-intent-cluster="tour_package"
                  data-service-type="package"
                >
                  See Varanasi tour packages
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <a
                  href={getWhatsAppUrl('Hi, I need help planning a Varanasi package. Travelers: __, Dates: __, Nights: __, Hotel needed: __, Places: __.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta-id="home_package_whatsapp"
                  data-cta-location="home_package_gateway"
                  data-page-type="generic_taxi_owner"
                  data-intent-cluster="tour_package"
                  data-service-type="package"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Plan on WhatsApp
                </a>
              </Button>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Just need a cab? Stay on this page and request a taxi quote above.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
