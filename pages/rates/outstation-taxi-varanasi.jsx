import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Car,
  Bus,
  Gauge,
  Clock,
  Route,
  Calculator,
  BadgeCheck,
  Phone,
  MessageCircle,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import JsonLd from "@/components/JsonLd/JsonLd";
import FareCalculator from "@/components/FareCalculator/FareCalculator";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
  viewport: { once: true, margin: "-80px" },
};

// --- Consolidated KashiTaxi.in rates (Aug 2025) ---
const KASHITAXI_RATES = [
  { vehicle: "Indica", airport: 850, p8: 1500, p12: 2000, perKm: 10, notes: "Min 250 km/day outstation; driver night ₹300 after 9 pm" },
  { vehicle: "Indigo", airport: 750, p8: 1400, p12: 1700, perKm: 8.5, notes: "Small sedan; 250 km minimum" },
  { vehicle: "Swift Dzire", airport: 900, p8: 1800, p12: 2200, perKm: 11, notes: "Popular 4‑seater" },
  { vehicle: "Honda Amaze", airport: 1000, p8: 2000, p12: 2500, perKm: 12, notes: "Roomier sedan" },
  { vehicle: "Ertiga (7‑seater)", airport: 1150, p8: 2000, p12: 2800, perKm: 14, notes: "Small groups; 250 km min" },
  { vehicle: "Toyota Innova", airport: 1250, p8: 2500, p12: 3000, perKm: 15, notes: "6/7‑seater SUV" },
  { vehicle: "Toyota Crysta", airport: 1500, p8: 2800, p12: 3500, perKm: 17, notes: "Premium SUV" },
  { vehicle: "Honda City", airport: 1800, p8: 3000, p12: 4000, perKm: 18, notes: "Premium sedan" },
  { vehicle: "Tempo Traveller (10–17)", airport: 2500, p8: 5500, p12: 6500, perKm: 25, notes: "Ideal for large families" },
];

const ONEWAY = [
  { to: "Vindhyachal", km: 80, hr: "~2 hr", fare: 1600, img: "/images/Vindhyachal1.jpg" },
  { to: "Prayagraj (Allahabad)", km: 120, hr: "~3 hr", fare: 2500, img: "/images/prayagraj.jpg" },
  { to: "Ayodhya", km: 200, hr: "4–5 hr", fare: 6500, img: "/images/AyodhyaTaxi1.jpg" },
  { to: "Bodhgaya", km: 250, hr: "6–7 hr", fare: 7000, img: "/images/GayaTaxi.jpg" },
  { to: "Lucknow", km: 300, hr: "6–7 hr", fare: 8500, img: "/images/vnsayopyg.png" },
];

const DEALS = [
  { type: "Sedan (Dzire/Etios)", round: 12, oneWay: 16, note: "Round‑trip excludes night/tolls; one‑way all‑inclusive." },
  { type: "SUV (Ertiga/Innova)", round: 14, oneWay: 22, note: "+₹2/km beyond daily 300 km limit." },
  { type: "Innova Crysta", round: 20, oneWay: 30, note: "Premium comfort." },
];

// Site constants for SEO
const SITE = "https://www.kashitaxi.in";
const PAGE_URL = `${SITE}/rates/outstation-taxi-varanasi`;
const OG_IMG = `${SITE}/images/varanasi-hero.png`;

// Page JSON-LD (Breadcrumb + WebPage + FAQ)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE}/` },
        { "@type": "ListItem", "position": 2, "name": "Outstation Taxi Rates (Varanasi)" }
      ]
    },
    {
      "@type": "WebPage",
      "@id": PAGE_URL,
      "url": PAGE_URL,
      "name": "Varanasi Outstation Taxi Rates, Deals & Online Booking Guide (2025)",
      "description": "Compare Varanasi outstation taxi per‑km rates, one‑way cab fares and round‑trip deals. 2025 guide with cheap sedan & SUV prices, tempo traveller costs and a fare calculator.",
      "inLanguage": "en-IN",
      "isPartOf": { "@id": `${SITE}/#website` },
      "about": { "@id": `${SITE}/#org` }
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the minimum km for outstation taxis from Varanasi?",
          "acceptedAnswer": { "@type": "Answer", "text": "Most operators charge a minimum 250 km/day for outstation trips. If your itinerary is shorter, you may still pay for the minimum run." }
        },
        {
          "@type": "Question",
          "name": "Are tolls and driver night charges included in the per‑km rate?",
          "acceptedAnswer": { "@type": "Answer", "text": "Typically no. Per‑km rates mostly include fuel. Budget extra for tolls, state taxes, parking and driver night allowances (about ₹300–₹350/night)." }
        },
        {
          "@type": "Question",
          "name": "Which is the cheapest cab type for outstation?",
          "acceptedAnswer": { "@type": "Answer", "text": "For 2–4 travellers, Indigo/Indica/Dzire class sedans offer the lowest price (₹8.5–₹11/km). For 5–7 travellers, Ertiga/Innova SUVs balance cost and comfort (₹14–₹18/km)." }
        },
        {
          "@type": "Question",
          "name": "Can I book one‑way taxis from Varanasi?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. One‑way fares are convenient for point‑to‑point trips to Ayodhya, Prayagraj, Bodhgaya, Lucknow and more. Per‑km is usually higher than round‑trip because the cab returns empty." }
        }
      ]
    }
  ]
};

// Internal links for one-way cards
const ROUTE_LINKS = {
  "Vindhyachal": "/en/varanasi-to-vindhyachal",
  "Prayagraj (Allahabad)": "/en/varanasi-to-prayagraj",
  "Ayodhya": "/en/varanasi-to-ayodhya",
  "Bodhgaya": "/en/varanasi-to-gaya-bodh-gaya-tour-package",
  "Lucknow": "/en/lucknow-to-varanasi-taxi-fare"
};

export default function OutstationTaxiGuide() {
  return (
    <>
      <Head>
        <title>Varanasi Outstation Taxi Rates, Deals & Online Booking Guide (2025)</title>
        <meta
          name="description"
          content="Compare Varanasi outstation taxi per‑km rates, one‑way cab fares and round‑trip deals. 2025 guide with cheap sedan & SUV prices, tempo traveller costs and a fare calculator."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta name="robots" content="index, follow" />
        {/* Open Graph */}
        <meta property="og:title" content="Varanasi Outstation Taxi Rates, Deals & Online Booking Guide (2025)" />
        <meta property="og:description" content="Compare Varanasi outstation taxi per‑km rates, one‑way cab fares and round‑trip deals. 2025 guide with cheap sedan & SUV prices, tempo traveller costs and a fare calculator." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={OG_IMG} />
        <meta property="og:site_name" content="Kashi Taxi" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Varanasi Outstation Taxi Rates, Deals & Online Booking Guide (2025)" />
        <meta name="twitter:description" content="Compare Varanasi outstation taxi per‑km rates, one‑way cab fares and round‑trip deals. 2025 guide with cheap sedan & SUV prices, tempo traveller costs and a fare calculator." />
        <meta name="twitter:image" content={OG_IMG} />
        <JsonLd data={jsonLd} />
      </Head>

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/varanasi-hero.png" alt="Varanasi Ghats" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-amber-900/30" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <motion.h1 {...fadeUp} className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
            Varanasi Outstation Taxi Rates, Deals & Online Booking Guide (2025)
          </motion.h1>
          <motion.p {...fadeUp} className="mt-3 max-w-3xl text-white/90 md:text-lg">
            Find the <strong>cheapest outstation cabs</strong>, compare <strong>per‑km taxi rates</strong>, book <strong>one‑way</strong> or <strong>round‑trip</strong> rides and estimate your <strong>trip cost</strong> in seconds. From Prayagraj to Lucknow, we’ve got you covered.
          </motion.p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-2xl bg-emerald-600 hover:bg-emerald-700">
              <a href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-5 w-5"/> WhatsApp for a quote</a>
            </Button>
            <Button asChild size="lg" variant="secondary" className="rounded-2xl bg-amber-50/90 text-amber-950 hover:bg-amber-100">
              <a href="tel:+919450301573"><Phone className="mr-2 h-5 w-5"/> Call now</a>
            </Button>
          </div>
        </div>
      </section>

      {/* STICKY TABS */}
      <div className="sticky top-14 z-40 border-b bg-white/90 backdrop-blur">
        <nav className="mx-auto max-w-6xl px-4">
          <ul className="flex flex-wrap gap-2 py-2 text-sm">
            {[
              { id: "overview", label : "Rates overview", icon: IndianRupee },
              { id: "rates", label: "Our rates", icon: Gauge },
              { id: "oneway", label: "One‑way fares", icon: Route },
              { id: "deals", label: "Round‑trip deals", icon: BadgeCheck },
              { id: "calc", label: "Fare calculator", icon: Calculator },
              { id: "faqs", label: "FAQs", icon: ChevronDown },
            ].map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-amber-900 ring-1 ring-amber-200 hover:bg-amber-100">
                  <t.icon className="h-4 w-4"/> {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* OVERVIEW CARDS */}
      <motion.section id="overview" {...fadeUp} className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold tracking-tight">Varanasi outstation taxi per‑km rate – what to expect</h2>
        <p className="mt-2 text-slate-600">Rates vary by vehicle and operator. Fuel is usually included; <em>tolls, parking, state tax and driver night charges</em> are typically extra. Use these ballpark ranges to benchmark quotes.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[{label:"Sedan (Indigo/Dzire)", range:"₹8.5–₹13/km", img:"/images/seden.png"},{label:"SUV (Ertiga/Innova)", range:"₹14–₹18/km", img:"/images/xuv.png"},{label:"Tempo Traveller", range:"₹25–₹30/km", img:"/images/tempo-travellar-outside-front-p.jpeg"},{label:"Luxury", range:"₹50+/km", img:"/images/luxuryCar.png"}].map((c)=> (
            <Card key={c.label} className="overflow-hidden border-2">
              <div className="relative h-36 w-full bg-white">
                <Image src={c.img} alt={c.label} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-contain p-2"/>
              </div>
              <CardHeader className="pb-1"><CardTitle className="text-base">{c.label}</CardTitle></CardHeader>
              <CardContent className="text-sm text-slate-600">Typical outstation rate: <span className="font-semibold text-amber-800">{c.range}</span></CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* OUR RATES (single table, no external providers) */}
      <motion.section id="rates" {...fadeUp} className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="text-2xl font-semibold tracking-tight">Kashi Taxi outstation rates (2025)</h2>
        <p className="mt-2 text-slate-600">Transparent fares by vehicle class. Fuel included; add <em>tolls, state tax, parking</em> and any <em>driver night</em> charges if applicable.</p>
        <div className="mt-4">
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Kashitaxi.in — Standard rate card</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="py-2 pr-3">Vehicle</th>
                    <th className="py-2 pr-3">Airport</th>
                    <th className="py-2 pr-3">8 hr/80 km</th>
                    <th className="py-2 pr-3">12 hr/200 km</th>
                    <th className="py-2 pr-3">Outstation (₹/km)</th>
                    <th className="py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {KASHITAXI_RATES.map((r) => (
                    <tr key={r.vehicle} className="border-b/50">
                      <td className="py-2 pr-3 font-medium text-slate-800">{r.vehicle}</td>
                      <td className="py-2 pr-3">₹{r.airport.toLocaleString("en-IN")}</td>
                      <td className="py-2 pr-3">₹{r.p8.toLocaleString("en-IN")}</td>
                      <td className="py-2 pr-3">₹{r.p12.toLocaleString("en-IN")}</td>
                      <td className="py-2 pr-3">₹{r.perKm}/km</td>
                      <td className="py-2 text-slate-600">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Cheapest callouts (optional helpers) */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[{t:"Cheapest sedans",d:"Indigo/Indica from ₹8.5–₹10/km"},{t:"Value SUVs",d:"Ertiga/Innova from ₹14–₹15/km"},{t:"Group travel",d:"Tempo Traveller from ₹25/km"}].map((c)=> (
            <Card key={c.t} className="border bg-amber-50/40">
              <CardContent className="p-4 text-sm"><span className="font-semibold text-amber-900">{c.t}:</span> {c.d}</CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* ONE-WAY FARES – visual cards */}
      <motion.section id="oneway" {...fadeUp} className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold tracking-tight">Popular one‑way taxi fares from Varanasi</h2>
        <p className="mt-2 text-slate-600">Indicative sedan prices; tolls and state taxes may be extra depending on operator and route.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ONEWAY.map((d) => {
            const href = ROUTE_LINKS[d.to];
            return (
              <Card key={d.to} className="overflow-hidden border">
                {href ? (
                  <Link href={href} aria-label={`Read guide: ${d.to}`}>
                    <div className="relative h-40 w-full">
                      <Image src={d.img} alt={d.to} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"/>
                      <div className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-xs font-medium text-slate-900 ring-1 ring-white/70">{d.km} km • {d.hr}</div>
                    </div>
                  </Link>
                ) : (
                  <div className="relative h-40 w-full">
                    <Image src={d.img} alt={d.to} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"/>
                    <div className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-xs font-medium text-slate-900 ring-1 ring-white/70">{d.km} km • {d.hr}</div>
                  </div>
                )}
                <CardHeader className="pb-1">
                  <CardTitle className="text-base">
                    {href ? (
                      <Link href={href} className="hover:underline">{d.to}</Link>
                    ) : (
                      d.to
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between p-4 pt-0 text-sm">
                  <span className="text-slate-600">One‑way fare (sedan)</span>
                  <span className="font-semibold text-amber-800">₹{d.fare.toLocaleString("en-IN")}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.section>

      {/* ROUND-TRIP DEALS */}
      <motion.section id="deals" {...fadeUp} className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold tracking-tight">Round‑trip cab deals vs one‑way rates</h2>
        <p className="mt-2 text-slate-600">Round‑trip bookings usually have a lower per‑km rate; one‑way rides bundle more inclusions. Compare before you book.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2 pr-3">Cab type</th>
                <th className="py-2 pr-3">Round‑trip rate (₹/km)</th>
                <th className="py-2 pr-3">One‑way rate (₹/km)</th>
                <th className="py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {DEALS.map((r)=> (
                <tr key={r.type} className="border-b/50">
                  <td className="py-2 pr-3 font-medium text-slate-800">{r.type}</td>
                  <td className="py-2 pr-3">₹{r.round}/km</td>
                  <td className="py-2 pr-3">₹{r.oneWay}/km</td>
                  <td className="py-2 text-slate-600">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* CALCULATOR */}
      <motion.section id="calc" {...fadeUp} className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-amber-700"/>
          <h2 className="text-2xl font-semibold tracking-tight">Outstation taxi fare calculator</h2>
        </div>
        <FareCalculator />
      </motion.section>

      {/* FAQS (brief, SEO friendly) */}
      <motion.section id="faqs" {...fadeUp} className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold tracking-tight">FAQs — Varanasi outstation taxi booking</h2>
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="f1">
            <AccordionTrigger>What is the minimum km for outstation taxis from Varanasi?</AccordionTrigger>
            <AccordionContent>Most operators charge a <strong>minimum 250 km/day</strong> for outstation trips. If your itinerary is shorter, you may still pay for the minimum run.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="f2">
            <AccordionTrigger>Are tolls and driver night charges included in the per‑km rate?</AccordionTrigger>
            <AccordionContent>Typically <strong>no</strong>. Per‑km rates mostly include fuel. Budget extra for <em>tolls, state taxes, parking</em> and <em>driver night allowances</em> (about ₹300–₹350/night).</AccordionContent>
          </AccordionItem>
          <AccordionItem value="f3">
            <AccordionTrigger>Which is the cheapest cab type for outstation?</AccordionTrigger>
            <AccordionContent>For 2–4 travellers, <strong>Indigo/Indica/Dzire</strong> class sedans offer the lowest price (₹8.5–₹11/km). For 5–7 travellers, <strong>Ertiga/Innova</strong> SUVs balance cost and comfort (₹14–₹18/km).</AccordionContent>
          </AccordionItem>
          <AccordionItem value="f4">
            <AccordionTrigger>Can I book one‑way taxis from Varanasi?</AccordionTrigger>
            <AccordionContent>Yes. One‑way fares are convenient for point‑to‑point trips to <em>Ayodhya, Prayagraj, Bodhgaya, Lucknow</em> and more. Per‑km is usually higher than round‑trip because the cab returns empty.</AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-2xl bg-emerald-600 hover:bg-emerald-700"><a href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4"/> WhatsApp for best deal</a></Button>
          <Button asChild variant="secondary" className="rounded-2xl bg-amber-50 text-amber-950 hover:bg-amber-100"><a href="tel:+919450301573"><Phone className="mr-2 h-4 w-4"/> Call now</a></Button>
        </div>
        <p className="mt-4 text-xs text-slate-500">Last updated: August 2025</p>
      </motion.section>
    </>
  );
}
