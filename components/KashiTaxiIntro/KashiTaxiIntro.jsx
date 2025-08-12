import React from "react";
import Image from "next/image";
// Removed framer-motion to reduce JS cost
import {
  Phone,
  MessageCircle,
  Car,
  MapPin,
  Clock,
  ShieldCheck,
  IndianRupee,
  PlaneLanding,
  Moon,
  Sunrise,
  HeartHandshake,
  UserCheck,
  Languages,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

// Beautiful, production‑ready KashiTaxiIntro with saffron/peach palette
// – Uses shadcn/ui + lucide + next/image (animations removed for performance)
// – No JSON‑LD (you already emit it at page level)
// – Keeps your IDs/links/phone numbers
export default function KashiTaxiIntro() {
  return (
    <section
      aria-label="Kashi Taxi – Varanasi cab service"
      className="relative bg-gradient-to-b from-white via-white to-orange-50/30"
    >
      {/* TOP: intro + actions */}
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 motion-safe:md:animate-in motion-safe:md:fade-in motion-safe:md:slide-in-from-bottom-2 md:duration-500 md:ease-out md:[will-change:transform]">
        <div className="grid items-start gap-8 md:grid-cols-[1.25fr_.9fr]">
          {/* left: text */}
          <div>
            <h2 id="overview" className="text-3xl font-semibold tracking-tight md:text-4xl">
              Kashi Taxi – 24×7 Varanasi Taxi Service (Airport, Local & Outstation)
            </h2>
            <p className="mt-3 text-base text-slate-600 md:text-lg">
              <strong>Book a cab in Varanasi in 60 seconds.</strong> Clean AC cars, polite drivers, on‑time pickups—from airport arrivals to temple darshan and outstation trips.
            </p>

            {/* trust chips */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-800 ring-1 ring-purple-200">
                <Clock className="h-3 w-3"/> 24×7 service
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-800 ring-1 ring-purple-200">
                <ShieldCheck className="h-3 w-3"/> Transparent pricing
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-800 ring-1 ring-purple-200">
                <Languages className="h-3 w-3"/> Hindi / English
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-800 ring-1 ring-purple-200">
                <UserCheck className="h-3 w-3"/> Verified drivers
              </span>
            </div>

            {/* actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                <a href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp +91-99354-74730">
                  <MessageCircle className="mr-2 h-5 w-5"/> WhatsApp Us
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-2xl border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100">
                <a href="tel:+919450301573" aria-label="Call now +91-94503-01573">
                  <Phone className="mr-2 h-5 w-5"/> Call Now
                </a>
              </Button>
            </div>
          </div>

          {/* right: step card */}
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">How booking works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {[
                  { t: "Message/Call", d: "Share date, time, route, headcount, bags." },
                  { t: "Quote & confirm", d: "Exact fare with inclusions/exclusions." },
                  { t: "Driver details", d: "Car number + phone before pickup." },
                  { t: "Ride & pay", d: "UPI/cash at trip end; invoice on request." },
                ].map((s, i) => (
                  <li key={s.t} className="flex gap-3">
                    <span className="mt-[3px] text-orange-600"><CheckCircle2 className="h-5 w-5"/></span>
                    <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">{i+1}. {s.t}:</span> {s.d}</p>
                  </li>
                ))}
              </ol>
              <Separator className="my-4"/>
              <p className="text-sm text-slate-600">
                <strong>Book now:</strong> WhatsApp <a className="text-orange-700 underline" href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer">+91-99354-74730</a> · Call <a className="text-orange-700 underline" href="tel:+919450301573">+91-94503-01573</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* STICKY SECTION TABS */}
      <div className="sticky top-16 z-30 border-y bg-gradient-to-r from-orange-50/90 via-orange-50/90 to-rose-50/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <nav aria-label="Jump to sections" className="mx-auto max-w-6xl px-4">
          <ul className="flex flex-wrap gap-2 py-3">
            <li>
              <a href="#fares" className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-orange-900 ring-1 ring-orange-200 shadow-sm hover:bg-orange-50 hover:ring-orange-300">
                <IndianRupee className="h-4 w-4 text-orange-600"/> Fares
              </a>
            </li>
            <li>
              <a href="#routes" className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-orange-900 ring-1 ring-orange-200 shadow-sm hover:bg-orange-50 hover:ring-orange-300">
                <MapPin className="h-4 w-4 text-orange-600"/> Routes
              </a>
            </li>
            <li>
              <a href="#how-to-book" className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-orange-900 ring-1 ring-orange-200 shadow-sm hover:bg-orange-50 hover:ring-orange-300">
                <Phone className="h-4 w-4 text-orange-600"/> How to book
              </a>
            </li>
            <li>
              <a href="#faqs" className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-orange-900 ring-1 ring-orange-200 shadow-sm hover:bg-orange-50 hover:ring-orange-300">
                <ShieldCheck className="h-4 w-4 text-orange-600"/> FAQs
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* FARES */}
      <section id="fares" className="mx-auto max-w-6xl px-4 pt-10 md:pt-16 pb-6 motion-safe:md:animate-in motion-safe:md:fade-in motion-safe:md:slide-in-from-bottom-2 md:duration-500 md:ease-out md:[will-change:transform]">
        <div className="mb-2 flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-orange-600"/>
          <h3 className="text-2xl font-semibold tracking-tight">Transparent taxi fares (2025)</h3>
        </div>
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-rose-500"/>
        <p className="mt-3 text-slate-600">No guesswork—clear fare breakup with tolls/parking/night charges informed in advance.</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Varanasi Airport (VNS) ↔ City",
              price: "Sedan ₹850–950 · SUV ₹1200–1350",
              meta: "Meet & greet at Arrival Gate 2",
              links: [
                { href: "/en/varanasi-airport-taxi-guide", label: "Guide" },
                { href: "/en/varanasi-airport-taxi-price-guide", label: "Price details" },
              ],
              icon: PlaneLanding,
            },
            {
              title: "Local Kashi Darshan (8 hr / 80 km)",
              price: "from ₹2200",
              meta: "Assi, Vishwanath Corridor, Dashashwamedh, Sarnath",
              links: [{ href: "/en/varanasi-day-tour-cab-charges", label: "Local Day Taxi (fares)" }],
              icon: Car,
            },
            {
              title: "Varanasi ↔ Ayodhya",
              price: "₹2500–13000 (one‑way to 2D/1N round trip)",
              meta: "Ram Mandir, Saryu Aarti",
              links: [{ href: "/en/varanasi-to-ayodhya", label: "Varanasi to Ayodhya" }],
              icon: BadgeCheck,
            },
            {
              title: "Varanasi ↔ Prayagraj (Allahabad)",
              price: "₹2000–5500",
              meta: "Triveni Sangam day trip",
              links: [{ href: "/en/varanasi-to-prayagraj", label: "Varanasi to Prayagraj" }],
              icon: MapPin,
            },
            {
              title: "Varanasi ↔ Gaya & Bodh Gaya",
              price: "₹9000–13000 (2D/1N to 3D/2N package)",
              meta: "Mahabodhi Temple, Pind Daan at Vishnupad",
              links: [{ href: "/en/varanasi-to-gaya-bodh-gaya-tour-package", label: "Kashi Gaya spiritual route" }],
              icon: HeartHandshake,
            },
            {
              title: "Varanasi ↔ Vindhyachal",
              price: "₹2000–2500 (same‑day return)",
              meta: "Maa Vindhyavasini Shakti Peeth darshan",
              links: [{ href: "/en/varanasi-to-vindhyachal", label: "Vindhyachal tour guide" }],
              icon: Sunrise,
            },
          ].map((c, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-orange-100 transition-all hover:shadow-md hover:ring-orange-300/70"
            >
              {/* card image */}
              <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-orange-100">
                <Image
                  src={
                    i === 0
                      ? "/images/airport-taxi-600x400.jpeg"
                      : i === 1
                      ? "/images/varanasi-ghats-overview.jpeg"
                      : i === 2
                      ? "/images/AyodhyaTaxi1.jpg"
                      : i === 3
                      ? "/images/sangam-600x400.jpeg"
                      : i === 4
                      ? "/images/blogGaya.png"
                      : "/images/blogVindhyachal.png"
                  }
                  alt={
                    i === 0
                      ? "Varanasi airport taxi"
                      : i === 1
                      ? "Kashi Darshan local tour"
                      : i === 2
                      ? "Varanasi to Ayodhya taxi"
                      : i === 3
                      ? "Prayagraj Triveni Sangam"
                      : i === 4
                      ? "Varanasi to Gaya Bodh Gaya tour"
                      : "Varanasi to Vindhyachal Shakti Peeth"
                  }
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <c.icon className="h-5 w-5"/>
                </span>
                <CardTitle className="text-base md:text-lg">{c.title}</CardTitle>
              </div>
              <CardContent className="mt-3 space-y-2 p-0 text-sm text-slate-600">
                <div className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-900 ring-1 ring-orange-200">
                  {c.price}
                </div>
                <p>{c.meta}</p>
                <div className="flex flex-wrap gap-3 pt-1">
                  {c.links.map((l) => (
                    <a key={l.href} href={l.href} className="text-orange-700 underline underline-offset-4 hover:text-orange-800">{l.label}</a>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* tip */}
        <div role="note" className="mt-6 rounded-md border border-orange-200 bg-orange-50 p-4 text-sm">
          <p>
            <strong>Tip:</strong> Early‑morning Subah‑e‑Banaras aarti? We do reliable 4:30–5:30 AM pickups. See timings: {" "}
            <a className="text-orange-700 underline" href="/en/assi-ghat-aarti-timings-2025">Assi Ghat Aarti Timings 2025</a>
          </p>
        </div>
      </section>

      {/* ROUTES */}
      <section id="routes" className="mx-auto max-w-6xl px-4 py-10 motion-safe:md:animate-in motion-safe:md:fade-in motion-safe:md:slide-in-from-bottom-2 md:duration-500 md:ease-out md:[will-change:transform]">
        <div className="mb-2 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-600"/>
          <h3 className="text-2xl font-semibold tracking-tight">Popular routes & day trips</h3>
        </div>
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-rose-500"/>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Card className="rounded-2xl border-2">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">City & Half‑Day</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              <ul className="list-disc space-y-1 pl-5">
                <li>Airport ↔ Assi / Godowlia / Cantt / BHU</li>
                <li>Sarnath half‑day tour</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-2">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Outstation & Circuits</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              <ul className="list-disc space-y-1 pl-5">
                <li>Outstation: Bodh Gaya / Gaya, Vindhyachal, Chunar Fort, Jaunpur, Mirzapur</li>
                <li>Temple circuits: Kashi–Ayodhya–Prayagraj (custom itineraries)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-kashi-taxi" className="mx-auto max-w-6xl px-4 py-10 motion-safe:md:animate-in motion-safe:md:fade-in motion-safe:md:slide-in-from-bottom-2 md:duration-500 md:ease-out md:[will-change:transform]">
        <h3 className="text-2xl font-semibold tracking-tight">Why travellers choose Kashi Taxi</h3>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Local, trusted & responsive", desc: "Varanasi‑based team that actually picks up the phone—day or night." },
            { icon: Clock, title: "On‑time, every time", desc: "Driver tracking + buffer time for airport pickups." },
            { icon: Car, title: "Clean cars & courteous drivers", desc: "Verified licenses; Hindi/English support." },
            { icon: IndianRupee, title: "Clear pricing", desc: "No hidden add‑ons; full fare breakup shared before you ride." },
            { icon: MessageCircle, title: "Easy booking", desc: "WhatsApp confirmation + driver/vehicle number in advance." },
            { icon: HeartHandshake, title: "Help for pilgrims", desc: "Nearest ghat access guidance & luggage assistance." },
          ].map((f) => (
            <Card key={f.title} className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-orange-100">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <f.icon className="h-5 w-5"/>
                </span>
                <CardTitle className="text-base">{f.title}</CardTitle>
              </div>
              <CardContent className="mt-2 p-0 text-sm text-slate-600">{f.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* AIRPORT PICKUP */}
      <section id="airport-pickup" className="mx-auto max-w-6xl px-4 py-10 motion-safe:md:animate-in motion-safe:md:fade-in motion-safe:md:slide-in-from-bottom-2 md:duration-500 md:ease-out md:[will-change:transform]">
        <div className="mb-2 flex items-center gap-2">
          <PlaneLanding className="h-5 w-5 text-orange-600"/>
          <h3 className="text-2xl font-semibold tracking-tight">Varanasi Airport pickup—how it works</h3>
        </div>
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-rose-500"/>
        <p className="mt-3 text-slate-600">
          Your driver waits near Arrival Gate 2 with your nameboard. First 15 minutes of parking included; if your flight is delayed, we adjust the pickup and keep you posted. We’ll help with luggage and coordinate the best drop gate for the ghats (cars can’t enter some lanes—our team guides you to the nearest point). {" "}
          <a href="/en/varanasi-airport-taxi-guide" className="text-orange-700 underline">Learn more</a>.
        </p>
      </section>

      {/* SERVICE AREAS */}
      <section id="service-areas" className="mx-auto max-w-6xl px-4 py-10 motion-safe:md:animate-in motion-safe:md:fade-in motion-safe:md:slide-in-from-bottom-2 md:duration-500 md:ease-out md:[will-change:transform]">
        <h3 className="text-2xl font-semibold tracking-tight">Service areas in Varanasi</h3>
        <p className="text-slate-600">Assi Ghat, Dashashwamedh, Godowlia, Chowk, Lahurabir, Sigra/Chetganj, BHU, Lanka, Cantonment, Sarnath, Babatpur Airport (VNS) and all major hotels, homestays and hostels.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Assi Ghat","Dashashwamedh","Godowlia","Chowk","Lahurabir","Sigra","Chetganj","BHU","Lanka","Cantonment","Sarnath","Babatpur Airport"].map((t) => (
            <span key={t} className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-900">{t}</span>
          ))}
        </div>
      </section>

      {/* HOW TO BOOK */}
      <section id="how-to-book" className="mx-auto max-w-6xl px-4 py-10 motion-safe:md:animate-in motion-safe:md:fade-in motion-safe:md:slide-in-from-bottom-2 md:duration-500 md:ease-out md:[will-change:transform]">
        <h3 className="text-2xl font-semibold tracking-tight">How to book (simple steps)</h3>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <ol className="list-decimal space-y-3 pl-5 text-slate-600">
            <li><strong>Message/Call:</strong> Share date, time, route, headcount, bags.</li>
            <li><strong>Quote & confirm:</strong> We send the exact fare with inclusions/exclusions.</li>
            <li><strong>Driver details:</strong> Car number + phone before pickup.</li>
            <li><strong>Ride & pay:</strong> UPI/cash at trip end; invoice on request.</li>
          </ol>
          <Card className="rounded-2xl border-2">
            <CardContent className="flex flex-wrap items-center gap-3 p-4">
              <Button asChild className="rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                <a href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp +91-99354-74730">
                  <MessageCircle className="mr-2 h-4 w-4"/> WhatsApp Us
                </a>
              </Button>
              <Button asChild variant="secondary" className="rounded-2xl border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100">
                <a href="tel:+919450301573" aria-label="Call now +91-94503-01573">
                  <Phone className="mr-2 h-4 w-4"/> Call Now
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQS */}
      <section id="faqs" className="mx-auto max-w-6xl px-4 py-10 motion-safe:md:animate-in motion-safe:md:fade-in motion-safe:md:slide-in-from-bottom-2 md:duration-500 md:ease-out md:[will-change:transform]">
        <h3 className="text-2xl font-semibold tracking-tight">FAQs</h3>
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>Are tolls/parking included?</AccordionTrigger>
            <AccordionContent>
              We state inclusions up‑front. Airport parking (first 15 min) is included for pickups; longer waits are billed at actuals.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Do you operate late nights/early mornings?</AccordionTrigger>
            <AccordionContent>
              Yes—24×7. Night charges (if any) are shared in the quote before you confirm.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I do Ayodhya as a day trip?</AccordionTrigger>
            <AccordionContent>
              Possible but tight. We recommend 2 days/1 night for unhurried darshan and evening aarti.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Can you pick from the ghats?</AccordionTrigger>
            <AccordionContent>
              Cars can’t reach many ghats. We coordinate the nearest pickup point and help with directions.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Do drivers speak English?</AccordionTrigger>
            <AccordionContent>
              Most are Hindi + basic English; full English‑speaking drivers available on request.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ABOUT / FOOTER CTA */}
      <section id="about" className="mx-auto max-w-6xl px-4 pb-12 motion-safe:md:animate-in motion-safe:md:fade-in motion-safe:md:slide-in-from-bottom-2 md:duration-500 md:ease-out md:[will-change:transform]">
        <h3 className="text-2xl font-semibold tracking-tight">About Kashi Taxi (Vinayak Travels Tour)</h3>
        <p className="mt-2 text-slate-600">
          We’re a Varanasi‑based taxi operator helping pilgrims and travellers with airport transfers, local sightseeing and outstation trips across Uttar Pradesh and Bihar. Our focus is simple: safe, clean, punctual rides with honest pricing and real, local support.
        </p>
        <p className="mt-2 text-sm">
          More: <a className="text-orange-700 underline" href="/en/about">About us</a> · <a className="text-orange-700 underline" href="/en/contact">Contact</a>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
            <a href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4"/> WhatsApp Us</a>
          </Button>
          <Button asChild variant="secondary" className="rounded-2xl border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100">
            <a href="tel:+919450301573"><Phone className="mr-2 h-4 w-4"/> Call Now</a>
          </Button>
        </div>
        <p className="mt-4 text-xs text-slate-500">Last updated: August 2025</p>
      </section>
    </section>
  );
}
