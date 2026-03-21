import Head from 'next/head';
import SidebarBookingWidget from '@/components/BookingWidget/SidebarBookingWidget';

export default function ChatGptQuoteWidgetPage() {
  return (
    <>
      <Head>
        <title>Varanasi Insider Quote Widget</title>
        <meta
          name="description"
          content="Lead capture widget for ChatGPT-assisted taxi quote handoff."
        />
      </Head>

      <main className="min-h-screen bg-slate-100 p-4 md:p-6">
        <div className="mx-auto max-w-md">
          <div className="mb-4 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-900 to-teal-800 p-5 text-white shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              ChatGPT App
            </p>
            <h1 className="mt-2 text-2xl font-bold">Quick Taxi Lead Handoff</h1>
            <p className="mt-2 text-sm text-cyan-50">
              This is the existing sidebar booking widget, exposed on its own route so the MCP app can reference it.
            </p>
          </div>

          <SidebarBookingWidget
            pageTitle="ChatGPT App Quote Widget"
            pageUrl="/chatgpt-app/quote-widget"
          />
        </div>
      </main>
    </>
  );
}
