// components/PinkTaxiSection/PinkTaxiSection1.jsx
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

export default function PinkTaxiSection1() {
  return (
    <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 py-8 relative z-20 mt-4 md:mt-0">
      <div className="mx-auto max-w-6xl px-4">
        {/* Main Pink Taxi card with "Pink Taxi (women‑only; lady driver)" text */}
        <motion.div id="pink-taxi" {...fadeUp}>
          <Card className="rounded-2xl border-2">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">Women‑only</Badge>
                <CardTitle className="text-lg">Pink Taxi (women‑only; lady driver)</CardTitle>
              </div>
              <div className="hidden items-center gap-2 text-slate-600 md:flex">
                <Sunrise className="h-4 w-4 text-orange-500" />
                <span>Early morning safe pickups</span>
                <Moon className="h-4 w-4 text-orange-500" />
                <span>Late nights on request</span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 p-5 pt-0 text-sm text-slate-600 md:grid-cols-[1.2fr_.9fr]">
              <p>
                Travelling solo or with kids? Choose Pink Taxi—our women‑only service with trained lady drivers for airport transfers, local darshan and shopping runs. Pre‑book on WhatsApp. More: {" "}
                <a href="/pink-taxi-varanasi" className="text-orange-600 underline">Pink Taxi Varanasi</a>
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
