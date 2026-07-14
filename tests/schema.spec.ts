import { test, expect } from '@playwright/test';

const slug = 'varanasi-airport-to-banaras-railway-station-taxi';
const pagePath = `/en/city/varanasi/taxi/${slug}`;

const parseSchemas = async (page) => {
  return page.$$eval('script[type="application/ld+json"]', (nodes) => {
    return nodes.map((node) => {
      try {
        return JSON.parse(node.textContent || '{}');
      } catch (err) {
        return null;
      }
    }).filter(Boolean);
  });
};

test('Banaras Station page exposes Service + FAQ schema', async ({ page, baseURL }) => {
  const url = `${baseURL}${pagePath}`;
  await page.goto(url, { waitUntil: 'networkidle' });

  const schemas = await parseSchemas(page);
  expect(schemas.length).toBeGreaterThan(0);

  const typeSet = new Set<string>();
  for (const schema of schemas) {
    if (schema['@graph'] && Array.isArray(schema['@graph'])) {
      schema['@graph'].forEach((node) => {
        if (typeof node['@type'] === 'string') {
          typeSet.add(node['@type']);
        }
      });
    } else if (typeof schema['@type'] === 'string') {
      typeSet.add(schema['@type']);
    }
  }

  expect(typeSet.has('Service')).toBeTruthy();
  expect(typeSet.has('FAQPage')).toBeTruthy();
});
