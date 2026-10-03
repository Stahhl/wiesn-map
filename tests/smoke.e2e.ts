import { expect, test } from '@playwright/test';

test('visar aktuell upplaga med karta', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Wiesn 2026');
	await expect(page.locator('svg#wiesn-map')).toBeVisible();
	await expect(page.locator('#wiesn-map [data-place]:not([data-label])')).toHaveCount(60);
});

test('fyller skärmen på mobil och visas i en ram på desktop', async ({ page, isMobile }) => {
	await page.goto('/');
	const viewport = page.viewportSize()!;
	const shell = await page.locator('.shell').boundingBox();

	if (isMobile) {
		expect(shell).toMatchObject({ x: 0, y: 0, width: viewport.width, height: viewport.height });
	} else {
		expect(shell!.width).toBe(410);
		expect(shell!.x).toBeCloseTo((viewport.width - 410) / 2, 0);
	}

	const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
	expect(scrollWidth).toBeLessThanOrEqual(viewport.width);
});

test.describe('API v1', () => {
	test.skip(({ isMobile }) => isMobile, 'räcker att köra en gång');

	test('current.json pekar på aktuell upplaga', async ({ request }) => {
		const res = await request.get('/api/v1/current.json');
		expect(await res.json()).toEqual({
			schemaVersion: 1,
			currentEdition: '2026',
			editions: [{ id: '2026', href: '/api/v1/editions/2026.json' }]
		});
	});

	test('upplagan innehåller data och länk till kartan', async ({ request }) => {
		const data = await (await request.get('/api/v1/editions/2026.json')).json();
		expect(data.schemaVersion).toBe(1);
		expect(data.edition.id).toBe('2026');
		expect(data.places).toHaveLength(39);

		const map = await request.get(data.map);
		expect(map.headers()['content-type']).toContain('image/svg+xml');
		expect(await map.text()).toContain('id="wiesn-map"');
	});
});
