/**
 * Ritar appikonerna i static/icons/ från static/icons/icon.svg med Chromium från
 * Playwright. PNG-filerna checkas in, så skriptet behöver bara köras när ikonen
 * ändras: `pnpm icons`.
 */
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const DIR = new URL('../static/icons/', import.meta.url);
const BACKGROUND = '#fffef9';

const svg = readFileSync(new URL('icon.svg', DIR));
const src = `data:image/svg+xml;base64,${svg.toString('base64')}`;

/** Maskerbara ikoner beskärs av systemet, så motivet krymps in i den säkra zonen. */
const icons = [
	{ file: 'icon-192.png', size: 192, inset: 0 },
	{ file: 'icon-512.png', size: 512, inset: 0 },
	{ file: 'maskable-512.png', size: 512, inset: 0.12 },
	{ file: 'apple-touch-icon.png', size: 180, inset: 0 }
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const { file, size, inset } of icons) {
	await page.setViewportSize({ width: size, height: size });
	const pad = Math.round(size * inset);
	await page.setContent(
		`<body style="margin:0;background:${BACKGROUND}">` +
			`<img src="${src}" style="display:block;width:${size - 2 * pad}px;margin:${pad}px">`
	);
	await page.locator('img').evaluate((img: HTMLImageElement) => img.decode());
	await page.screenshot({ path: new URL(file, DIR).pathname });
	console.log(`✓ static/icons/${file}`);
}

await browser.close();
