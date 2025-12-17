export default function Home() {
  return (
    <main>
      <section style={{ padding: '64px 24px', maxWidth: 960, margin: '0 auto', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <p style={{ color: '#2b6cb0', fontWeight: 700, marginBottom: 8 }}>bharat-tourism</p>
        <h1 style={{ fontSize: 48, lineHeight: 1.1, margin: '0 0 24px' }}>
          New travel stories for India
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: '#334155', margin: '0 0 32px' }}>
          This is a placeholder Next.js app scoped to its own folder for Azure Static Web Apps deployment.
          Add your pages, API routes, and assets here without affecting the primary site.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <a
            href="https://learn.microsoft.com/azure/static-web-apps/"
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              padding: '12px 18px',
              borderRadius: 10,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Azure SWA docs
          </a>
          <a
            href="https://nextjs.org/docs"
            style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'underline' }}
          >
            Next.js docs
          </a>
        </div>
      </section>
    </main>
  );
}
