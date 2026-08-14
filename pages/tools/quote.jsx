import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Calculator } from "lucide-react";

// Client-only: the builder restores a draft from localStorage on mount.
const QuoteBuilder = dynamic(
  () => import("@/components/QuoteBuilder/QuoteBuilder"),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-400">
        Loading…
      </div>
    ),
  },
);

/** Internal sales tool — never indexed, no site chrome, no distractions. */
export default function QuoteToolPage() {
  return (
    <>
      <Head>
        <title>Kashi Taxi Quote Builder</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <main className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur print:hidden">
          <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
            <Calculator className="h-5 w-5 text-amber-600" />
            <h1 className="text-base font-bold tracking-tight text-slate-900">
              Kashi Taxi Quote Builder
            </h1>
          </div>
        </header>
        <QuoteBuilder />
      </main>
    </>
  );
}
