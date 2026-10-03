/**
 * Översätter id-konventionen i en ritad karta till kartkontraktets data-attribut
 * (docs/teknisk-profil.md §5.2). Körs med `pnpm map:annotate`. Attribut som redan
 * finns behålls, så det går att köra flera gånger.
 *
 * | id i ritningen              | blir                                           |
 * | --------------------------- | ---------------------------------------------- |
 * | `tent-<id>`                 | `data-place="<id>"`                            |
 * | `small-tent-<nr>`           | `data-place` för stället med `number` = nr     |
 * | `small-tent-<annat>`        | `data-decorative` + `data-category="small"`    |
 * | `label-<id>`                | `data-place="<id>" data-label`                 |
 * | `pin-<id>`                  | `data-place="<id>" data-pin`                   |
 * | `service-*` med `data-kind` | `data-layer` enligt `KIND_LAYERS`              |
 * | grupper i `GROUP_LAYERS`    | `data-layer`                                   |
 */
import { optimize, type XastElement } from 'svgo';
import type { Place } from './schema.ts';
import { MAP_ROOT_ID } from './svg.ts';

/** Id (eller id-prefix) på grupper och element som utgör ett lager */
export const GROUP_LAYERS: Record<string, string> = {
	'attraction-footprints': 'rides',
	'beer-bar-footprints': 'bars',
	'entry-exit-markers': 'gates',
	'festival-management': 'mgmt'
};

/** `data-kind` på tjänstemarkörer → lager (tabellen i §5) */
export const KIND_LAYERS: Record<string, string> = {
	wc: 'wc',
	accessible_wc: 'wc',
	universal_wc: 'wc',
	water: 'water',
	atm: 'atm',
	aid: 'safety',
	police: 'safety',
	safe: 'safety',
	info: 'info',
	luggage: 'info',
	luggage_rental: 'info',
	parking: 'info'
};

/** Kategori för onumrerade små tält, som blir dekor */
const DECORATIVE_CATEGORY = 'small';

export type AnnotateResult = { svg: string; report: string[] };

export function annotateMap(svg: string, places: Place[]): AnnotateResult {
	const ids = new Set(places.map((p) => p.id));
	const byNumber = new Map(places.filter((p) => p.number).map((p) => [p.number!, p.id]));
	const shapes = new Set<string>();
	const labels = new Set<string>();
	const report: string[] = [];

	const setPlace = (el: XastElement, id: string, source: string) => {
		if (!ids.has(id)) {
			report.push(`${source}: "${id}" finns inte i places.json`);
			return false;
		}
		el.attributes['data-place'] ??= id;
		return true;
	};

	function annotate(el: XastElement, isRoot: boolean) {
		const a = el.attributes;
		const id = a.id ?? '';
		let m: RegExpExecArray | null;

		if (isRoot) a.id = MAP_ROOT_ID;

		if ((m = /^tent-(.+)$/.exec(id))) {
			if (setPlace(el, m[1], id)) shapes.add(m[1]);
		} else if ((m = /^small-tent-(\d+)$/.exec(id))) {
			const place = byNumber.get(Number(m[1]));
			if (place) {
				setPlace(el, place, id);
				shapes.add(place);
			} else {
				report.push(`${id}: inget ställe har number ${m[1]}`);
			}
		} else if (/^small-tent-/.test(id) && el.name !== 'g') {
			a['data-decorative'] ??= '1';
			a['data-category'] ??= DECORATIVE_CATEGORY;
		} else if ((m = /^label-(.+)$/.exec(id))) {
			if (setPlace(el, m[1], id)) {
				a['data-label'] ??= '1';
				labels.add(m[1]);
			}
		} else if ((m = /^pin-(.+)$/.exec(id))) {
			if (setPlace(el, m[1], id)) {
				a['data-pin'] ??= '1';
				shapes.add(m[1]);
			}
		}

		if (/^service-/.test(id) && a['data-kind']) {
			const layer = KIND_LAYERS[a['data-kind']];
			if (layer) a['data-layer'] ??= layer;
			else report.push(`${id}: okänd data-kind "${a['data-kind']}" (lägg till i KIND_LAYERS)`);
		}
		const group = Object.keys(GROUP_LAYERS).find((g) => id === g || id.startsWith(`${g}-`));
		if (group) a['data-layer'] ??= GROUP_LAYERS[group];

		// Redan annoterade element räknas också
		const place = a['data-place'];
		if (place && !('data-decorative' in a)) ('data-label' in a ? labels : shapes).add(place);
	}

	const { data } = optimize(svg, {
		plugins: [
			{
				name: 'annotate',
				fn: () => ({
					element: {
						enter: (node, parent) => annotate(node, parent.type === 'root')
					}
				})
			}
		]
	});

	for (const p of places) {
		if (!shapes.has(p.id)) report.push(`${p.id}: saknar form (tent-${p.id} eller pin-${p.id})`);
		else if (!labels.has(p.id)) report.push(`${p.id}: saknar etikett (label-${p.id})`);
	}

	return { svg: data, report };
}
