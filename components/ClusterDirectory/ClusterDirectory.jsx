import { useMemo, useState } from 'react';
import clsx from 'clsx';

const fallbackTabs = [{ id: 'all', label: 'All Destinations' }];

const buildGroupedEntries = (entries = [], tabs = fallbackTabs) => {
  const tabMap = new Map();
  tabs.forEach((tab) => {
    if (tab?.id) {
      tabMap.set(tab.id, []);
    }
  });

  const defaultTabId = tabs[0]?.id || 'all';

  entries.forEach((entry) => {
    if (!entry) return;
    const tabId = entry.tab && tabMap.has(entry.tab) ? entry.tab : defaultTabId;
    const bucket = tabMap.get(tabId) || [];
    bucket.push(entry);
    tabMap.set(tabId, bucket);
  });

  return { tabMap, defaultTabId };
};

export default function ClusterDirectory({ title, description, tabs = [], entries = [] }) {
  const effectiveTabs = tabs.length ? tabs : fallbackTabs;
  const { tabMap, defaultTabId } = useMemo(
    () => buildGroupedEntries(entries, effectiveTabs),
    [entries, effectiveTabs]
  );

  const initialTab = effectiveTabs.some((tab) => tab?.id === defaultTabId)
    ? defaultTabId
    : effectiveTabs[0]?.id;

  const [activeTab, setActiveTab] = useState(initialTab);
  const activeEntries = tabMap.get(activeTab) || tabMap.get(defaultTabId) || [];

  return (
    <section className="mt-10 rounded-[32px] border border-cyan-100 bg-gradient-to-b from-cyan-50 via-white to-emerald-50/60 p-8 shadow-[0_25px_60px_rgba(14,116,144,0.12)]">
      <div className="text-center">
        {title && (
          <h2 className="text-2xl font-bold text-slate-900">
            {title}
          </h2>
        )}
        {description && (
          <p className="mx-auto mt-3 max-w-3xl text-base text-slate-600">
            {description}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {effectiveTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={clsx(
              'rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-wide shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
              activeTab === tab.id
                ? 'border-transparent bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-cyan-500/40'
                : 'border-cyan-200 bg-white text-slate-700 hover:border-cyan-400'
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {activeEntries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/90 p-8 text-center text-slate-500">
            <p>New routes drop here soon. Stay tuned!</p>
          </div>
        )}

        {activeEntries.map((entry) => (
          <a
            key={`${entry.tab}-${entry.slug}`}
            href={entry.href}
            className="group flex flex-col overflow-hidden rounded-2xl border border-cyan-100 bg-white/90 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl"
          >
            {entry.image && (
              <div className="h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={entry.image}
                  alt={entry.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex h-full flex-col p-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {entry.title}
              </h3>
              {entry.description && (
                <p className="mt-2 text-sm text-slate-600">
                  {entry.description}
                </p>
              )}
              {entry.metaLine && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {entry.metaLine}
                </p>
              )}
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-cyan-600">
                View guide
                <svg
                  className="ml-2 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L12 7.414V17a1 1 0 11-2 0V7.414L5.707 9.707A1 1 0 014.293 8.293l5-5z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
