import { expect, test, type Page } from '@playwright/test';

/** Väntar tills kartan har fått sin första transform och tar emot tryck */
async function open(page: Page, path = '/') {
	await page.goto(path);
	await expect(page.locator('.map[data-ready]')).toBeAttached();
}

const shape = (page: Page, id: string) =>
	page.locator(`#wiesn-map [data-place="${id}"]:not([data-label])`).first();

const scale = (page: Page) =>
	page.locator('.map').evaluate((el) => Number(/scale\(([\d.]+)\)/.exec(el.style.transform)?.[1]));

test('ett tryck på ett tält öppnar detaljarket och bakåt stänger det', async ({ page }) => {
	await open(page);
	await shape(page, 'hofbraeu').click();

	const sheet = page.getByRole('dialog', { name: 'Hofbräu-Festzelt' });
	await expect(sheet).toBeInViewport();
	await expect(sheet.getByText('ca 10 000')).toBeVisible();
	await expect(page).toHaveURL('/?plats=hofbraeu');

	// Byte av ställe ersätter historikposten, så ett steg bakåt räcker
	await shape(page, 'augustiner').click();
	await expect(page.getByRole('dialog', { name: 'Augustiner-Festhalle' })).toBeInViewport();

	await page.goBack();
	await expect(page).toHaveURL('/');
	await expect(page.getByRole('dialog', { name: 'Augustiner-Festhalle' })).not.toBeInViewport();
});

test('filter visar träffar, räknar segmenten och anpassar kartan', async ({ page }) => {
	await open(page);
	const before = await scale(page);

	await page.getByRole('button', { name: 'Vin på menyn', exact: true }).click();
	const results = page.getByRole('region', { name: 'Träffar' });
	await expect(results.getByRole('heading')).toHaveText('28 tält med vin på menyn');
	await expect(page.getByRole('button', { name: 'Stora 10' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Små 18' })).toBeVisible();

	// Vintälten finns över hela området, så kartan zoomar in först när urvalet krymper
	await page.getByRole('button', { name: /^Små/ }).click();
	await page.getByRole('button', { name: 'Bar', exact: true }).click();
	await expect(results.getByRole('heading')).toHaveText('4 små tält med vin på menyn och bar');
	await expect.poll(() => scale(page)).toBeGreaterThan(before);

	await page.getByRole('group', { name: 'Filter' }).getByRole('button', { name: 'Rensa' }).click();
	await expect(results).not.toBeInViewport();
});

test('ett träffkort öppnar stället', async ({ page }) => {
	await open(page);
	await page.getByRole('button', { name: 'Bar', exact: true }).click();
	await page.getByRole('region', { name: 'Träffar' }).getByText('Marstall Festzelt').click();
	await expect(page.getByRole('dialog', { name: 'Marstall Festzelt' })).toBeInViewport();
});

test('en delad länk öppnar stället direkt', async ({ page }) => {
	await open(page, '/?plats=s13');
	const sheet = page.getByRole('dialog', { name: 'Münchner Knödelei' });
	await expect(sheet).toBeInViewport();
	await expect(sheet.getByText('Litet tält · nr 13')).toBeVisible();

	// Öppnad via länk: stäng ersätter posten i stället för att lämna sidan
	await sheet.getByRole('button', { name: 'Stäng' }).click();
	await expect(page).toHaveURL('/');
	await expect(sheet).not.toBeInViewport();
});

test('detaljarket visar länkar och var allergenerna finns', async ({ page }) => {
	await open(page, '/?plats=s13');
	const sheet = page.getByRole('dialog', { name: 'Münchner Knödelei' });
	await expect(sheet.getByRole('link', { name: 'Meny', exact: true })).toHaveAttribute(
		'href',
		/\.pdf$/
	);

	await sheet.getByText('Visa mer', { exact: true }).click();
	await expect(sheet.locator('dt:text-is("Allergener") + dd')).toHaveText('Märkta i menyn');
	await expect(sheet.getByRole('link', { name: /^oktoberfest\.de/ })).toHaveAttribute(
		'href',
		/^https:\/\/www\.oktoberfest\.de\/en\//
	);
});

test('detaljarket samlar sociala medier med egna ikoner', async ({ page }) => {
	await open(page, '/?plats=s5');
	const sheet = page.getByRole('dialog', { name: 'Goldener Hahn' });
	const social = sheet.getByRole('link', { name: /^(Instagram|Facebook|TikTok|YouTube)$/ });
	// Snabbknapparna i peek-läget är bara Meny, Webbplats och Boka bord
	await expect(sheet.locator('.quick a')).toHaveText(['Meny', 'Webbplats', 'Boka bord']);

	await sheet.getByText('Visa mer', { exact: true }).click();
	await expect(sheet.getByRole('heading', { name: 'Sociala medier' })).toBeVisible();
	await expect(social).toHaveCount(3);
	await expect(social.nth(0)).toHaveAccessibleName('Instagram');
	await expect(social.nth(0)).toHaveAttribute('href', /instagram\.com\/ablesgoldenerhahn/);
	await expect(social.nth(1)).toHaveAccessibleName('Facebook');
	await expect(social.nth(2)).toHaveAccessibleName('YouTube');
	await expect(social.nth(0).locator('svg path')).toHaveAttribute('fill', /^url\(#/);
});

test('en okänd plats i länken ignoreras', async ({ page }) => {
	await open(page, '/?plats=finns-inte');
	await expect(page).toHaveURL('/');
	for (const dialog of await page.locator('[role="dialog"]').all()) {
		await expect(dialog).not.toBeInViewport();
	}
});

test('lagerarket tänder och släcker lager', async ({ page }) => {
	await open(page);
	const wc = page.locator('#wiesn-map [data-layer="wc"]').first();
	await expect(wc).toBeHidden();

	await page.getByRole('button', { name: 'Lager' }).click();
	const sheet = page.getByRole('dialog', { name: 'Kartlager' });
	await expect(sheet).toBeInViewport();
	await sheet.getByRole('switch', { name: 'Toaletter' }).click();
	await expect(sheet.getByRole('switch', { name: 'Toaletter' })).toBeChecked();
	await sheet.getByRole('button', { name: 'Klar' }).click();

	await expect(sheet).not.toBeInViewport();
	await expect(wc).toBeVisible();
	await expect(page.getByRole('button', { name: 'Lager, 1 extra lager tända' })).toBeVisible();
});

test('zoomknapparna zoomar och "visa hela kartan" återställer', async ({ page }) => {
	await open(page);
	const start = await scale(page);
	await page.getByRole('button', { name: 'Zooma in' }).click();
	await expect.poll(() => scale(page)).toBeCloseTo(start * 1.6, 2);
	await page.getByRole('button', { name: 'Visa hela kartan' }).click();
	await expect.poll(() => scale(page)).toBeCloseTo(start, 2);
});

test.describe('desktop', () => {
	test.skip(({ isMobile }) => isMobile, 'mus och tangentbord');

	test('mushjulet zoomar runt pekaren', async ({ page }) => {
		await open(page);
		const start = await scale(page);
		const box = (await page.locator('.viewport').boundingBox())!;
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.wheel(0, -300);
		await expect.poll(() => scale(page)).toBeGreaterThan(start);
	});

	test('tangentbordet styr kartan och arken', async ({ page }) => {
		await open(page);
		const start = await scale(page);
		await page.keyboard.press('+');
		await expect.poll(() => scale(page)).toBeGreaterThan(start);
		await page.keyboard.press('0');
		await expect.poll(() => scale(page)).toBeCloseTo(start, 2);

		await shape(page, 'paulaner').focus();
		await page.keyboard.press('Enter');
		const sheet = page.getByRole('dialog', { name: 'Paulaner Festzelt' });
		await expect(sheet).toBeInViewport();
		await page.keyboard.press('Escape');
		await expect(sheet).not.toBeInViewport();
	});

	test('fungerar offline efter första besöket', async ({ page, context }) => {
		await open(page);
		await page.evaluate(() => navigator.serviceWorker.ready);
		await context.setOffline(true);
		await page.reload();
		await expect(page.getByRole('heading', { level: 1 })).toHaveText('Wiesn 2026');
		await expect(page.locator('.map[data-ready]')).toBeAttached();
		await context.setOffline(false);
	});

	test('har ett webbmanifest med ikoner', async ({ request }) => {
		const manifest = await (await request.get('/manifest.webmanifest')).json();
		expect(manifest).toMatchObject({ name: 'Wiesn-kartan', display: 'standalone' });
		for (const icon of manifest.icons) {
			expect((await request.get(icon.src)).ok()).toBe(true);
		}
	});
});
