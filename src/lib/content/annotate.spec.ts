import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { readContentFiles } from '../../../scripts/content-files.ts';
import { annotateMap } from './annotate.ts';
import { inspectMap } from './svg.ts';
import { validateContent } from './validate.ts';

const files = readContentFiles();
const { places } = validateContent(files).content!.editions['2026'];
const source = readFileSync(
	new URL('../../../docs/wiesn_2026_north_up.svg', import.meta.url),
	'utf8'
);

describe('annotateMap', () => {
	it('översätter id-konventionen i originalritningen', () => {
		const { svg, report } = annotateMap(source, places);
		const map = inspectMap(svg);

		expect(map.rootId).toBe('wiesn-map');
		expect(svg).toMatch(/id="tent-hofbraeu"[^>]*data-place="hofbraeu"/);
		expect(svg).toMatch(/id="small-tent-7"[^>]*data-place="s7"/);
		expect(svg).toMatch(
			/id="small-tent-unnumbered"[^>]*data-decorative="1"[^>]*data-category="small"/
		);
		expect([...map.layers].sort()).toEqual(
			['atm', 'bars', 'gates', 'info', 'mgmt', 'rides', 'safety', 'water', 'wc'].sort()
		);
		// Alla ställen har en form. Etiketter saknar id i originalet och rapporteras.
		expect(places.every((p) => map.shapes.has(p.id))).toBe(true);
		expect(report).toContain('hofbraeu: saknar etikett (label-hofbraeu)');
		expect(report.some((r) => r.includes('saknar form'))).toBe(false);
	});

	it('känner igen etiketter och nålar med id', () => {
		const svg = source
			.replace('<circle cx="295" cy="610"', '<circle id="pin-s1" cx="295" cy="610"')
			.replace('<text x="269.0" y="150.0"', '<text id="label-marstall" x="269.0" y="150.0"');
		const { svg: out } = annotateMap(svg, places);
		expect(out).toMatch(/id="pin-s1"[^>]*data-place="s1"[^>]*data-pin="1"/);
		expect(out).toMatch(/id="label-marstall"[^>]*data-place="marstall"[^>]*data-label="1"/);
	});

	it('ändrar inget i en karta som redan är annoterad', () => {
		const current = files['editions/2026/map.svg'];
		const { svg, report } = annotateMap(current, places);
		expect(inspectMap(svg)).toEqual(inspectMap(current));
		expect(report).toEqual([]);
	});

	it('rapporterar id:n som inte finns i datan', () => {
		const { report } = annotateMap(source.replace('id="tent-kaefer"', 'id="tent-kafer"'), places);
		expect(report).toContain('tent-kafer: "kafer" finns inte i places.json');
		expect(report).toContain('kaefer: saknar form (tent-kaefer eller pin-kaefer)');
	});
});
