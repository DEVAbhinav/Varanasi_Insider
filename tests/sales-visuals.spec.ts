import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pages = JSON.parse(fs.readFileSync(path.join(root, 'data/sales-visual-pages.json'), 'utf8'));
const assets = JSON.parse(fs.readFileSync(path.join(root, 'data/sales-visual-assets.json'), 'utf8'));

test('sales visual manifest is complete and Cloudinary-backed', () => {
  expect(pages).toHaveLength(50);
  expect(assets).toHaveLength(100);
  expect(new Set(assets.map((asset: any) => asset.route)).size).toBe(50);

  for (const page of pages) {
    const pageAssets = assets.filter((asset: any) => asset.route === page.route);
    expect(pageAssets, page.route).toHaveLength(2);
  }

  for (const asset of assets) {
    expect(asset.bytes, asset.id).toBeLessThan(250 * 1024);
    expect(asset.cloudinaryBytes, asset.id).toBeLessThan(250 * 1024);
    expect(asset.cloudinaryUrl, asset.id).toMatch(/^https:\/\/res\.cloudinary\.com\/dkntlqbwr\/image\/upload\/f_auto,q_auto:good\//);
    expect(asset.alt, asset.id).toBeTruthy();
    expect(asset.caption, asset.id).toBeTruthy();
    expect(asset.credit, asset.id).toContain('kashitaxi.in');
    expect(fs.existsSync(path.join(root, 'public', asset.localPath)), asset.id).toBe(true);
  }
});

test('markdown and custom pages integrate every visual exactly once', () => {
  for (const page of pages) {
    if (page.source) {
      const markdown = fs.readFileSync(path.join(root, page.source), 'utf8');
      const pageAssets = assets.filter((asset: any) => asset.route === page.route);
      for (const asset of pageAssets) {
        const count = (markdown.match(new RegExp(`data-sales-visual="${asset.id}"`, 'g')) || []).length;
        expect(count, asset.id).toBe(1);
        expect(markdown, asset.id).toContain(asset.cloudinaryUrl);
      }
    }
  }

  const bikePage = fs.readFileSync(path.join(root, 'pages/bike-rentals-varanasi.js'), 'utf8');
  const pinkPage = fs.readFileSync(path.join(root, 'pages/pink-taxi-varanasi.js'), 'utf8');
  expect(bikePage).toContain('route="/bike-rentals-varanasi"');
  expect(pinkPage).toContain('route="/pink-taxi-varanasi"');
});
