export default function QuickFacts({ facts = [] }) {
  if (!facts || facts.length === 0) return null;

  return (
    <div className="my-8 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-100/60 px-5 py-3">
        <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <span className="font-semibold text-amber-900">Quick Facts</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-amber-100/40">
        {facts.map((fact, i) => (
          <div key={i} className="bg-white/80 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{fact.label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-800">{fact.value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}
