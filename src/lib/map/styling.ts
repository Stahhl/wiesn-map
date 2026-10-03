/**
 * Styling per kartelement utifrån state, prototypens `applyMap()` (docs/teknisk-profil.md
 * §6.3). Bara kontraktets attribut används (§5), så en ny årskarta fungerar utan kodändring.
 */
import type { Layer, Place } from '#lib/content/schema.ts';

export type MapStyle = {
	places: ReadonlyMap<string, Place>;
	/** Valt segment, `null` = alla */
	category: string | null;
	/** Ställen som passerar segment och filter */
	matches: ReadonlySet<string>;
	filtersActive: boolean;
	selected: string | null;
	layers: Readonly<Record<string, boolean>>;
	layerConfig: readonly Layer[];
	dimOpacity: number;
};

const INK = '#1f2321';
/** Opacitet för lager med `dimWhenFocused` när ett filter är aktivt eller ett ställe valt */
const LAYER_DIM = 0.3;
/** Nålar växer så här mycket när de väljs (7 → 9,5 i prototypen) */
const PIN_GROWTH = 9.5 / 7;

type Original = { r: string | null; stroke: string | null; strokeWidth: string | null };
const originals = new WeakMap<Element, Original>();

function original(el: Element): Original {
	let o = originals.get(el);
	if (!o) {
		o = {
			r: el.getAttribute('r'),
			stroke: el.getAttribute('stroke'),
			strokeWidth: el.getAttribute('stroke-width')
		};
		originals.set(el, o);
	}
	return o;
}

function restore(el: Element, name: string, value: string | null) {
	if (value === null) el.removeAttribute(name);
	else el.setAttribute(name, value);
}

/**
 * Engångsförberedelse: den första formen per ställe blir en knapp för tangentbord och
 * skärmläsare. Etiketterna döljs för skärmläsare, eftersom formen redan har namnet.
 */
export function prepareMap(svg: SVGSVGElement, places: ReadonlyMap<string, Place>) {
	svg.setAttribute('role', 'group');
	const seen = new Set<string>();
	for (const el of svg.querySelectorAll('[data-place]')) {
		const id = el.getAttribute('data-place')!;
		if (el.hasAttribute('data-label') || seen.has(id)) {
			el.setAttribute('aria-hidden', 'true');
			continue;
		}
		seen.add(id);
		el.setAttribute('role', 'button');
		el.setAttribute('tabindex', '0');
		el.setAttribute('aria-label', places.get(id)?.name ?? id);
	}
}

export function styleMap(svg: SVGSVGElement, s: MapStyle) {
	for (const el of svg.querySelectorAll<SVGElement>('[data-place], [data-decorative]')) {
		const id = el.getAttribute('data-place');
		const place = id ? s.places.get(id) : undefined;

		let visible: boolean;
		let on: boolean;
		let match = false;
		if (place) {
			visible = s.category === null || place.category === s.category;
			match = s.matches.has(place.id);
			on = s.filtersActive ? match : visible;
		} else {
			// Dekor följer sin kategori men är aldrig en träff
			const category = el.getAttribute('data-category');
			visible = s.category === null || category === s.category;
			on = visible && !s.filtersActive;
		}

		el.style.opacity = on ? '' : String(s.dimOpacity);
		if (el.hasAttribute('data-label') || !place) continue;

		el.style.pointerEvents = visible ? '' : 'none';
		if (el.hasAttribute('tabindex')) el.setAttribute('tabindex', visible ? '0' : '-1');

		const selected = s.selected === place.id;
		const highlighted = s.filtersActive && match;
		const o = original(el);

		if (el.hasAttribute('data-pin')) {
			if (o.r !== null) el.setAttribute('r', String(selected ? Number(o.r) * PIN_GROWTH : o.r));
			if (selected || highlighted) {
				el.setAttribute('stroke', INK);
				el.setAttribute('stroke-width', selected ? '2.2' : '1.4');
			} else {
				restore(el, 'stroke', o.stroke);
				restore(el, 'stroke-width', o.strokeWidth);
			}
		} else {
			el.style.stroke = selected || highlighted ? INK : '';
			el.style.strokeWidth = selected ? '3.6' : highlighted ? '1.8' : '';
			el.style.strokeLinejoin = selected || highlighted ? 'round' : '';
		}
	}

	const focused = s.filtersActive || s.selected !== null;
	const dimmed = new Set(s.layerConfig.filter((l) => l.dimWhenFocused).map((l) => l.id));
	for (const el of svg.querySelectorAll<SVGElement>('[data-layer]')) {
		const id = el.getAttribute('data-layer')!;
		el.style.display = s.layers[id] ? '' : 'none';
		if (dimmed.has(id)) el.style.opacity = focused ? String(LAYER_DIM) : '';
	}
}
