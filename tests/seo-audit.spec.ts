import { expect, test } from '@playwright/test';

const TARGET_PATHS = [
  '/en/city/varanasi/events/siberian-birds-winter-events-varanasi',
  '/en/nag-nathaiya-festival-varanasi-2025',
  '/en/navratri-in-vindhyachal-practical-guide',
];

type JsonLdNode = Record<string, unknown>;

const flattenNodes = (rawSchemas: JsonLdNode[]) => {
  const nodes: JsonLdNode[] = [];
  rawSchemas.forEach((schema) => {
    if (Array.isArray(schema['@graph'])) {
      (schema['@graph'] as JsonLdNode[]).forEach((node) => nodes.push(node));
      return;
    }
    nodes.push(schema);
  });
  return nodes;
};

test.describe('SEO audit for flagged URLs', () => {
  test('renders exactly one canonical link', async ({ page, baseURL }) => {
    for (const path of TARGET_PATHS) {
      const url = `${baseURL}${path}`;
      await page.goto(url, { waitUntil: 'networkidle' });

      const canonicalCount = await page.locator('head link[rel="canonical"]').count();
      expect.soft(canonicalCount, `${path} should have one canonical tag`).toBe(1);
    }
  });

  test('JSON-LD has no malformed URLs and valid Event nodes', async ({ page, baseURL }) => {
    for (const path of TARGET_PATHS) {
      const url = `${baseURL}${path}`;
      await page.goto(url, { waitUntil: 'networkidle' });

      const rawSchemas = await page.$$eval('script[type="application/ld+json"]', (scripts) => (
        scripts.map((script) => {
          try {
            return JSON.parse(script.textContent || '{}');
          } catch {
            return null;
          }
        }).filter(Boolean)
      ));

      const schemas = rawSchemas as JsonLdNode[];
      expect.soft(schemas.length, `${path} should output JSON-LD`).toBeGreaterThan(0);

      const nodes = flattenNodes(schemas);

      const malformedUrls = JSON.stringify(nodes).match(/https:\/\/www\.kashitaxi\.inhttps:\/\//g) || [];
      expect.soft(malformedUrls.length, `${path} has malformed JSON-LD URLs`).toBe(0);

      const eventNodes = nodes.filter((node) => {
        const type = node['@type'];
        return Array.isArray(type) ? type.includes('Event') : type === 'Event';
      });

      for (const eventNode of eventNodes) {
        const name = eventNode.name;
        const startDate = eventNode.startDate;
        const location = eventNode.location;

        expect.soft(typeof name === 'string' && name.trim().length > 0, `${path} Event.name missing`).toBeTruthy();
        expect.soft(typeof startDate === 'string' && startDate.trim().length > 0, `${path} Event.startDate missing`).toBeTruthy();
        expect.soft(Boolean(location), `${path} Event.location missing`).toBeTruthy();
      }
    }
  });
});
