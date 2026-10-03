import { describe, expect, it } from 'vitest';
import { readContentFiles } from '../../../scripts/content-files.ts';
import { validateContent, type ContentFiles } from './validate.ts';

const real = readContentFiles();

/** Kopia av det riktiga innehållet med en ändring i en fil. */
function withChange(file: string, change: (text: string) => string): ContentFiles {
	return { ...real, [file]: change(real[file]) };
}

function withJson<T>(file: string, change: (data: T) => unknown): ContentFiles {
	return withChange(file, (text) => JSON.stringify(change(JSON.parse(text) as T)));
}

function messages(files: ContentFiles): string[] {
	return validateContent(files).issues.map((i) => `${i.file}: ${i.message}`);
}

const EDITION = 'editions/2026/edition.json';
const PLACES = 'editions/2026/places.json';
const MAP = 'editions/2026/map.svg';

describe('validateContent', () => {
	it('godkänner innehållet i content/', () => {
		const result = validateContent(real);
		expect(result.issues).toEqual([]);
		expect(result.ok).toBe(true);

		const bundle = result.content!.editions['2026'];
		expect(bundle.places).toHaveLength(39);
		expect(bundle.places.filter((p) => p.category === 'small')).toHaveLength(21);
		expect(bundle.map).toMatch(/^<svg[^>]+id="wiesn-map"/);
	});

	it('fyller i saknade valfria fält med null', () => {
		const place = validateContent(real).content!.editions['2026'].places[0];
		expect(place.hours).toBeNull();
		expect(place.links.tiktok).toBeNull();
		expect(place.image).toBeNull();
	});

	it('behåller kontraktets attribut och tar bort ritverktygets i den optimerade kartan', () => {
		const map = validateContent(real).content!.editions['2026'].map;
		expect(map.match(/data-place="/g)).toHaveLength(real[MAP].match(/data-place="/g)!.length);
		expect(map).toContain('data-layer="rides"');
		expect(map).toContain('href="#icon-wc"');
		expect(map).not.toContain('data-source-x');
		expect(map).not.toContain('xlink:');
	});

	it('rapporterar ogiltig JSON med filnamn', () => {
		expect(messages(withChange(PLACES, (t) => t.slice(0, -5)))).toEqual([
			expect.stringMatching(/^editions\/2026\/places\.json: ogiltig JSON/)
		]);
	});

	it('rapporterar schemafel med sökväg', () => {
		const files = withJson(PLACES, (places: { seats: unknown }[]) => {
			places[0].seats = 'ca 4 200';
			return places;
		});
		expect(messages(files)).toEqual([expect.stringContaining('places.json: 0.seats:')]);
	});

	it('rapporterar okända fält (stavfel)', () => {
		const files = withJson(PLACES, (places: Record<string, unknown>[]) => {
			places[0].brewry = 'Spaten';
			return places;
		});
		expect(messages(files)).toEqual([expect.stringContaining('0.brewry')]);
	});

	it('rapporterar dubbletter och okända referenser i places', () => {
		const files = withJson(PLACES, (places: Record<string, unknown>[]) => {
			places[1].id = places[0].id;
			places[2].features = ['wifi'];
			places[3].area = 'okand';
			places[4].allergenInfo = 'menu';
			places[4].links = {};
			return places;
		});
		const m = messages(files);
		expect(m).toContain(`${PLACES}: id "marstall" förekommer flera gånger`);
		expect(m).toContain(`${PLACES}: hofbraeu: okänd feature "wifi"`);
		expect(m).toContain(`${PLACES}: hacker: okänt area "okand"`);
		expect(m).toContain(`${PLACES}: schottenhamel: allergenInfo "menu" kräver links.menu`);
		// armbrust har nu ingen post kvar i places.json, men en form i kartan
		expect(m).toContain(
			`${MAP}: data-place="armbrust" finns inte i places.json (markera dekor med data-decorative)`
		);
	});

	it('rapporterar ställen som saknar form i kartan', () => {
		const files = withChange(MAP, (svg) => svg.replace(/data-place="kaefer"/g, 'data-x="kaefer"'));
		expect(messages(files)).toEqual([`${MAP}: place "kaefer" saknar form (data-place) i kartan`]);
	});

	it('rapporterar lager som saknas i edition.json respektive i kartan', () => {
		const files = withChange(MAP, (svg) =>
			svg.replaceAll('data-layer="mgmt"', 'data-layer="scen"')
		);
		expect(messages(files)).toEqual([
			`${MAP}: data-layer="scen" finns inte i edition.json → layers`,
			`${EDITION}: lagret "mgmt" används inte i map.svg`
		]);
	});

	it('rapporterar symboler som saknas', () => {
		const files = withJson(EDITION, (edition: { layers: { symbol?: string }[] }) => {
			edition.layers[2].symbol = 'icon-saknas';
			return edition;
		});
		expect(messages(files)).toEqual([
			`${EDITION}: layers.gates: symbolen "icon-saknas" finns inte i kartan`
		]);
	});

	it('stoppar skript, händelseattribut och externa länkar i kartan', () => {
		const files = withChange(MAP, (svg) =>
			svg.replace(
				'</svg>',
				'<script>alert(1)</script><rect onclick="x()"/><use href="https://example.com/a.svg#x"/></svg>'
			)
		);
		const m = messages(files);
		expect(m).toContain(`${MAP}: förbjudet innehåll: <script> är inte tillåtet`);
		expect(m).toContain(`${MAP}: förbjudet innehåll: attributet onclick på <rect>`);
		expect(m).toContain(
			`${MAP}: förbjudet innehåll: extern länk href="https://example.com/a.svg#x" på <use>`
		);
	});

	it('kräver att currentEdition finns', () => {
		const files = withJson('site.json', (site: object) => ({ ...site, currentEdition: '2030' }));
		expect(messages(files)).toEqual([
			'site.json: currentEdition "2030" finns inte i content/editions/'
		]);
	});
});
