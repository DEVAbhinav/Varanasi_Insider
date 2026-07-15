// components/commerce/PolkaOverlay.jsx
// Reusable brand polka-dot texture layer, matching the homepage hero and the
// site StickyContactBar. Purely decorative — sits behind content on an aqua
// gradient band. Render inside a `relative overflow-hidden` parent.

import React from 'react';

export default function PolkaOverlay({ className = '', opacity = 0.22 }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage: `
          radial-gradient(circle at 15% 25%, rgba(255,255,255,1) 3px, transparent 3px),
          radial-gradient(circle at 45% 15%, rgba(255,255,255,1) 2.5px, transparent 2.5px),
          radial-gradient(circle at 75% 35%, rgba(255,255,255,1) 3.5px, transparent 3.5px),
          radial-gradient(circle at 25% 65%, rgba(255,255,255,1) 3px, transparent 3px),
          radial-gradient(circle at 85% 75%, rgba(255,255,255,1) 2.7px, transparent 2.7px),
          radial-gradient(circle at 55% 50%, rgba(255,255,255,1) 3.2px, transparent 3.2px),
          radial-gradient(circle at 10% 85%, rgba(255,255,255,1) 3px, transparent 3px),
          radial-gradient(circle at 90% 15%, rgba(255,255,255,1) 2.5px, transparent 2.5px),
          radial-gradient(circle at 35% 90%, rgba(255,255,255,1) 3.3px, transparent 3.3px),
          radial-gradient(circle at 65% 8%, rgba(255,255,255,1) 2.8px, transparent 2.8px)
        `,
        backgroundSize: '340px 340px',
        backgroundPosition: '0 0',
      }}
    />
  );
}
