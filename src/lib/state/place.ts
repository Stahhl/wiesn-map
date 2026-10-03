/**
 * Hur ett ställe presenteras i resultatbandet och detaljarket. Allt härleds från
 * edition.json, och fält som saknas (`null`) hoppas över.
 */
import type { Edition, Place } from '#lib/content/schema.ts';
import { sv } from '#lib/i18n/sv.ts';

export type Tag = { label: string; bg: string; fg: string };
export type Fact = { label: string; value: string };
export type LinkKind = keyof Place['links'];
export type PlaceLink = { kind: LinkKind; href: string; label: string; mono: string; sub: string };

export function categoryOf(place: Place, edition: Edition) {
	return edition.categories.find((c) => c.id === place.category)!;
}

export function areaOf(place: Place, edition: Edition) {
	return edition.areas.find((a) => a.id === place.area)!;
}

/** "Litet tält · nr 7" i detaljarket */
export function kindLabel(place: Place, edition: Edition): string {
	const { singular } = categoryOf(place, edition);
	return place.number ? `${singular} · ${sv.number} ${place.number}` : singular;
}

/** "Litet tält 7" eller "Stort tält · Oide Wiesn" i resultatbandet */
export function shortKindLabel(place: Place, edition: Edition): string {
	const { singular } = categoryOf(place, edition);
	const area = areaOf(place, edition);
	if (place.number) return `${singular} ${place.number}`;
	return area.tag ? `${singular} · ${area.label}` : singular;
}

/** Filtertaggar, sedan områdets tagg. Utan filtertaggar visas `fallbackTag`. */
export function placeTags(place: Place, edition: Edition): Tag[] {
	const tags: Tag[] = edition.filters.items
		.filter((f) => place.features.includes(f.id))
		.map((f) => ({ label: f.label, ...f.tag }));
	const area = areaOf(place, edition);
	if (area.tag) tags.push({ label: area.label, ...area.tag });
	const fallback = edition.filters.fallbackTag;
	if (!place.features.length && fallback) tags.push(fallback);
	return tags;
}

export function placeFacts(place: Place, edition: Edition): Fact[] {
	const facts: (Fact | null)[] = [
		{ label: sv.area, value: areaOf(place, edition).label },
		place.brewery ? { label: sv.brewery, value: place.brewery } : null,
		place.seats ? { label: sv.seats, value: sv.seatsValue(place.seats) } : null,
		place.hours ? { label: sv.hours, value: sv.hoursValue(place.hours) } : null
	];
	return facts.filter((f) => f !== null);
}

const LINK_ORDER: LinkKind[] = ['menu', 'website', 'instagram', 'facebook', 'booking'];

export function placeLinks(place: Place): PlaceLink[] {
	return LINK_ORDER.flatMap((kind) => {
		const href = place.links[kind];
		if (!href) return [];
		const url = new URL(href);
		const sub = (url.hostname + url.pathname).replace(/^www\./, '').replace(/\/$/, '');
		return [{ kind, href, sub, ...sv.links[kind] }];
	});
}
