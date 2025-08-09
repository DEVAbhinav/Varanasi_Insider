// components/PinkTaxiSection/PinkTaxiSection2.jsx
import { motion } from 'framer-motion';
import Image from 'next/image';

// Micro-motion preset
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
  viewport: { once: true, margin: "-80px" },
};

export default function PinkTaxiSection2() {
  return (
    <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 py-6">
      <div className="mx-auto max-w-6xl px-4">
        {/* Promotional banner */}
        <motion.div {...fadeUp} className="overflow-hidden rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50">
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
      </div>
    </section>
  );
}
