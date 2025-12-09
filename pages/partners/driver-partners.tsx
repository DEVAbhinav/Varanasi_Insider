import React from "react";
import Head from "next/head";

const drivers = [
  {
    name: "Mishra Ji",
    role: "Airport & Bus Expert",
    badges: ["Police Verified", "Fog-Ready", "Jetty Escort"],
    languages: "Hindi, Broken English",
    years: "7 yrs",
    photo: "/images/profile/mishra-ji.jpeg",
  },
  {
    name: "Rajan Ji",
    role: "Calm and composed & City Tours",
    badges: ["Calm", "Family oriented"],
    languages: "Hindi, English",
    years: "5 yrs",
  },
  {
    name: "Ravi Ji",
    role: "Outstation & Pilgrimage",
    badges: ["Prayagraj/Ayodhya", "Tempo Traveller", "First Aid"],
    languages: "Hindi, English, Bhojpuri",
    years: "5 yrs",
  },
];

const heroStats = [
  { label: "Drivers Verified", value: "180+" },
  { label: "Daily Airport Runs", value: "120+" },
  { label: "Jetty Handovers", value: "60+/day" },
  { label: "Years on Road", value: "Up to 15" },
];

export default function DriverPartnersPage() {
  return (
    <>
      <Head>
        <title>Kashi Taxi Driver Partners | Verified & Celebrated</title>
        <meta
          name="description"
          content="Meet the verified Kashi Taxi driver partners. Photos, badges, routes, and how to join the photo wall."
        />
      </Head>
      <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-50 min-h-screen">
        <section className="relative overflow-hidden px-6 py-16 sm:py-20 lg:py-24">
          <div className="absolute inset-0 opacity-30" aria-hidden>
            <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-cyan-500 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-amber-400 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-6xl grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-amber-200 ring-1 ring-white/20">
                Driver Partners · Human-first
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Meet the Faces Behind Every Safe, On-Time Kashi Taxi Ride
              </h1>
              <p className="text-lg text-slate-200/90 max-w-2xl">
                This page is a spotlight for our partners—police-verified drivers who handle airport fog mornings, Tent City jetty handoffs, women-first rides, and outstation pilgrimages. Add your photo and badges so guests know exactly who is driving them.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/919450301573?text=Add%20my%20driver%20profile"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-slate-900 font-semibold shadow-lg shadow-amber-400/30 hover:-translate-y-0.5 transition"
                >
                  Submit your photo via WhatsApp
                </a>
                <a
                  href="mailto:support@kashitaxi.in?subject=Driver%20profile%20update"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-white hover:bg-white/10 transition"
                >
                  Email ops for updates
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-5">
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <div className="text-sm text-slate-200/80">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-16 sm:pb-20 lg:pb-28">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">Photo Wall (Add Yours)</h2>
              <p className="text-slate-200/90 max-w-3xl">
                We publish names, badges, and languages so guests can see the humans behind the wheel. Send a clear headshot and we will add you on the next refresh.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {drivers.map((driver) => (
                <div
                  key={driver.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30 backdrop-blur"
                >
                  {driver.photo ? (
                    <img
                      src={driver.photo}
                      alt={`${driver.name} photo`}
                      className="aspect-[4/3] w-full rounded-xl object-cover border border-white/10"
                      loading="lazy"
                    />
                  ) : (
                    <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-slate-200/80 text-sm">
                      Photo coming soon
                    </div>
                  )}
                  <div className="mt-4 space-y-1">
                    <div className="text-lg font-semibold text-white">{driver.name}</div>
                    <div className="text-sm text-amber-200/90">{driver.role}</div>
                    <div className="text-sm text-slate-200/80">{driver.languages} · {driver.years}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {driver.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/15"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-16 sm:pb-20 lg:pb-28 bg-white/5 ring-1 ring-white/5">
          <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">What Drivers Get</h2>
              <ul className="space-y-2 text-slate-200/90">
                <li>Fair, on-time payouts with transparent ledger.</li>
                <li>Priority rosters for badge-complete drivers (airport, Tent City, women-first).</li>
                <li>Night pickup allowances for late flights and festival surges.</li>
                <li>Route upskilling: Ravidas Ghat jetty drills, fog playbook, guest etiquette.</li>
                <li>Access to tempo traveller, Innova, and premium sedan jobs as you level up.</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">What Guests See</h2>
              <ul className="space-y-2 text-slate-200/90">
                <li>Driver name, photo, languages, and verification badges before pickup.</li>
                <li>Vehicle plate, make, cleanliness checklist, and live tracking link.</li>
                <li>Badge requests honored: women-first, fog expert, tempo traveller lead.</li>
                <li>Dispatcher on call during ride; silent-word escalation ready.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 sm:pb-24">
          <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 p-8 shadow-2xl shadow-amber-500/30 text-slate-900">
            <h2 className="text-2xl sm:text-3xl font-bold">Add Your Photo & Routes</h2>
            <p className="mt-2 text-lg">Send your headshot, years driving, languages, and top 3 routes. We update weekly.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://wa.me/919450301573?text=Add%20my%20driver%20profile"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-amber-100 font-semibold shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition"
              >
                WhatsApp ops now
              </a>
              <a
                href="mailto:support@kashitaxi.in?subject=Driver%20profile%20update"
                className="inline-flex items-center gap-2 rounded-full border border-slate-900/40 px-4 py-2 text-slate-900 font-semibold hover:bg-white/40 transition"
              >
                Email your details
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
