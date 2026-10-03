import { describe, expect, it } from 'vitest';
import { readContentFiles } from '../../../scripts/content-files.ts';
import { validateContent } from '#lib/content/validate.ts';
import { countBySegment, matches, resultTitle, sortByCategory, type Criteria } from './filter.ts';
import { kindLabel, placeFacts, placeLinks, placeTags, shortKindLabel } from './place.ts';

const { edition, places } = validateContent(readContentFiles()).content!.editions['2026'];
const byId = (id: string) => places.find((p) => p.id === id)!;

const criteria = (c: Partial<Criteria> = {}): Criteria => ({
	category: null,
	features: new Set(),
	mode: 'all',
	...c
});
const ids = (c: Criteria) => places.filter((p) => matches(p, c)).map((p) => p.id);

describe('filter', () => {
	it('räknar ställen per segment', () => {
		const counts = countBySegment(places, edition.categories, criteria());
		expect([...counts]).toEqual([
			[null, 39],
			['large', 18],
			['small', 21]
		]);
	});

	it('kräver alla valda filter i läget "all"', () => {
		const c = criteria({ features: new Set(['wine', 'bar']) });
		expect(ids(c)).toEqual(['marstall', 'kaefer', 'kufflers']);
		expect(countBySegment(places, edition.categories, c).get('small')).toBe(0);
	});

	it('räcker med ett av filtren i läget "any"', () => {
		const c = criteria({ features: new Set(['wine', 'bar']), mode: 'any' });
		const small = ids({ ...c, category: 'small' });
		expect(small).toEqual(['s1', 's2', 's7', 's9', 's12', 's15', 's17', 's20', 's21']);
	});

	it('kombinerar kategori och filter', () => {
		expect(ids(criteria({ category: 'small', features: new Set(['bar']) }))).toEqual([
			's7',
			's12',
			's15',
			's21'
		]);
	});

	it('sorterar träffar i kategoriernas ordning', () => {
		const sorted = sortByCategory(
			[byId('s1'), byId('marstall'), byId('s2'), byId('kaefer')],
			[...edition.categories]
		);
		expect(sorted.map((p) => p.id)).toEqual(['marstall', 'kaefer', 's1', 's2']);
	});

	it('formulerar resultattiteln', () => {
		const wineBar = new Set(['wine', 'bar']);
		expect(resultTitle(3, criteria({ features: wineBar }), edition)).toBe(
			'3 tält med vin på menyn och bar'
		);
		expect(resultTitle(9, criteria({ features: wineBar, mode: 'any' }), edition)).toBe(
			'9 tält med vin på menyn eller bar'
		);
		expect(
			resultTitle(1, criteria({ category: 'large', features: new Set(['bar']) }), edition)
		).toBe('1 stort tält med bar');
		expect(resultTitle(0, criteria({ category: 'small', features: wineBar }), edition)).toBe(
			'Inga små tält med vin på menyn och bar'
		);
	});
});

describe('place', () => {
	it('visar typ och nummer', () => {
		expect(kindLabel(byId('s7'), edition)).toBe('Litet tält · nr 7');
		expect(kindLabel(byId('hofbraeu'), edition)).toBe('Stort tält');
		expect(shortKindLabel(byId('s7'), edition)).toBe('Litet tält 7');
		expect(shortKindLabel(byId('tradition'), edition)).toBe('Stort tält · Oide Wiesn');
	});

	it('sätter taggar från filter och område, annars reservtaggen', () => {
		expect(placeTags(byId('marstall'), edition).map((t) => t.label)).toEqual([
			'Vin på menyn',
			'Bar'
		]);
		expect(placeTags(byId('tradition'), edition).map((t) => t.label)).toEqual([
			'Oide Wiesn',
			'Öl & mat'
		]);
		expect(placeTags(byId('hofbraeu'), edition)).toEqual([
			{ label: 'Öl & mat', bg: '#efece2', fg: '#4a4f4b' }
		]);
	});

	it('hoppar över fakta och länkar som saknas', () => {
		expect(placeFacts(byId('hofbraeu'), edition)).toEqual([
			{ label: 'Område', value: 'Wiesn' },
			{ label: 'Bryggeri', value: 'Hofbräu' },
			{ label: 'Platser', value: 'ca 10 000' }
		]);
		expect(placeFacts(byId('s3'), edition)).toEqual([{ label: 'Område', value: 'Wiesn' }]);
		expect(placeLinks(byId('hofbraeu'))).toEqual([]);

		const withLinks = {
			...byId('hofbraeu'),
			links: { ...byId('hofbraeu').links, instagram: 'https://www.instagram.com/hb_festzelt/' }
		};
		expect(placeLinks(withLinks)).toEqual([
			{
				kind: 'instagram',
				href: 'https://www.instagram.com/hb_festzelt/',
				label: 'Instagram',
				mono: 'IG',
				sub: 'instagram.com/hb_festzelt'
			}
		]);
	});
});
