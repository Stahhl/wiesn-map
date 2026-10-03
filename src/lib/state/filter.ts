/**
 * Filterlogiken från prototypen (`sizeOk`, `passes`, `matchIds`, `renderVals`) som
 * rena funktioner, så att den kan testas utan DOM (docs/teknisk-profil.md §6.1).
 */
import type { Category, Edition, Place } from '#lib/content/schema.ts';
import { sv } from '#lib/i18n/sv.ts';

export type Criteria = {
	/** `null` betyder alla kategorier */
	category: string | null;
	features: ReadonlySet<string>;
	mode: Edition['filters']['mode'];
};

export function inCategory(place: Place, category: string | null): boolean {
	return category === null || place.category === category;
}

export function passesFeatures(place: Place, criteria: Criteria): boolean {
	if (criteria.features.size === 0) return true;
	const has = (feature: string) => place.features.includes(feature);
	const wanted = [...criteria.features];
	return criteria.mode === 'any' ? wanted.some(has) : wanted.every(has);
}

export function matches(place: Place, criteria: Criteria): boolean {
	return inCategory(place, criteria.category) && passesFeatures(place, criteria);
}

/** Antal träffar per segment med aktuella filter. Nyckeln `null` är "Alla". */
export function countBySegment(
	places: Place[],
	categories: Category[],
	criteria: Criteria
): Map<string | null, number> {
	const counts = new Map<string | null, number>([[null, 0]]);
	for (const c of categories) counts.set(c.id, 0);
	for (const p of places) {
		if (!passesFeatures(p, criteria)) continue;
		counts.set(null, counts.get(null)! + 1);
		counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
	}
	return counts;
}

/** Ställen i kategoriernas ordning (stora före små), och annars i ordningen i places.json. */
export function sortByCategory(places: Place[], categories: Category[]): Place[] {
	const order = new Map(categories.map((c, i) => [c.id, i]));
	return places.toSorted((a, b) => order.get(a.category)! - order.get(b.category)!);
}

/** "5 tält med vin på menyn och bar", "1 stort tält med bar", "Inga små tält med bar" */
export function resultTitle(count: number, criteria: Criteria, edition: Edition): string {
	const category = edition.categories.find((c) => c.id === criteria.category);
	const noun = category
		? (count === 1 ? category.singular : category.label).toLocaleLowerCase('sv')
		: sv.allNoun;
	const join = criteria.mode === 'any' ? sv.or : sv.and;
	const what = edition.filters.items
		.filter((f) => criteria.features.has(f.id))
		.map((f) => f.label.toLocaleLowerCase('sv'))
		.join(join);
	const amount = count ? String(count) : sv.none;
	return what ? `${amount} ${noun} ${sv.with} ${what}` : `${amount} ${noun}`;
}
