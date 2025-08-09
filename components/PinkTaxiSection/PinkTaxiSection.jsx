// components/PinkTaxiSection/PinkTaxiSection.jsx
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sunrise, Moon } from 'lucide-react';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

// Micro-motion preset
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
  viewport: { once: true, margin: "-80px" },
};

export default function PinkTaxiSection() {
  return (
    <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Top promo banner */}
        <motion.div {...fadeUp} className="mb-8 overflow-hidden rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50">
          <div className="grid items-center gap-4 p-4 sm:grid-cols-[1.4fr_.9fr] sm:p-5">
            <div>
              <p className="text-sm font-medium text-pink-900">For women, by women</p>
              <h3 className="mt-1 text-lg font-semibold text-pink-900">Pink Taxi — women‑only rides with trained lady drivers</h3>
              <p className="mt-1 text-sm text-pink-800/90">Safe airport transfers, local darshan & shopping runs. Early‑morning and late‑night pickups on request.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="/pink-taxi-varanasi" className="inline-flex items-center justify-center rounded-md bg-pink-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-pink-700">Learn more</a>
                <a href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md bg-pink-50 px-3 py-2 text-sm font-medium text-pink-900 ring-1 ring-pink-200 hover:bg-pink-100">Book on WhatsApp</a>
              </div>
            </div>
            <div className="relative hidden h-36 w-full sm:block md:h-40">
              <Image src="/images/lady-taxi.jpeg" alt="Pink Taxi Varanasi" fill sizes="(min-width: 768px) 40vw, 100vw" className="rounded-xl object-cover" />
            </div>
          </div>
        </motion.div>

        {/* Detailed card */}
        <motion.div id="pink-taxi" {...fadeUp}>
          <Card className="rounded-2xl border-2">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">Women‑only</Badge>
                <CardTitle className="text-lg">Pink Taxi (women‑only; lady driver)</CardTitle>
              </div>
              <div className="hidden items-center gap-2 text-slate-600 md:flex">
                <Sunrise className="h-4 w-4 text-amber-600" />
                <span>Early morning safe pickups</span>
                <Moon className="h-4 w-4 text-amber-600" />
                <span>Late nights on request</span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 p-5 pt-0 text-sm text-slate-600 md:grid-cols-[1.2fr_.9fr]">
              <p>
                Travelling solo or with kids? Choose Pink Taxi—our women‑only service with trained lady drivers for airport transfers, local darshan and shopping runs. Pre‑book on WhatsApp. More: {" "}
                <a href="/pink-taxi-varanasi" className="text-amber-700 underline">Pink Taxi Varanasi</a>
              </p>
              <div className="relative hidden h-36 w-full md:block lg:h-40">
                <Image src="/images/solo-femal-traveller-varanasi.jpeg" alt="Women traveller in Varanasi" fill sizes="(min-width: 1024px) 40vw, 100vw" className="rounded-xl object-cover" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
