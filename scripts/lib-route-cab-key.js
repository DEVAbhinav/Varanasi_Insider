// CommonJS mirror of routeBlockKey() in lib/ctaBlocks.js.
// Must produce identical keys so generated {{CTA:ROUTE_CAB_<ID>}} shortcodes
// resolve to the blocks registered at runtime. Keep in sync.
function routeBlockKey(id) {
  return `ROUTE_CAB_${String(id).toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
}

// CommonJS mirror of routeHeroKey() in lib/ctaBlocks.js. Directional hero
// fare-card widget keyed ROUTE_HERO_<ID>_<OUT|IN>. Keep in sync.
function routeHeroKey(id, dir) {
  const base = `ROUTE_HERO_${String(id).toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
  return dir ? `${base}_${dir === 'out' ? 'OUT' : 'IN'}` : base;
}
module.exports = { routeBlockKey, routeHeroKey };
