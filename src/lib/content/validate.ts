/**
 * Validerar allt innehåll i `content/`: schema, korsreferenser och kartkontraktet.
 * Samma funktion körs av `pnpm content:check` och av bygget, så trasigt innehåll
 * aldrig når produktion.
 */
import * as v from 'valibot';
import {
	EditionSchema,
	PlacesSchema,
	SiteSchema,
	type EditionBundle,
	type Site
} from './schema.ts';
import { MAP_ROOT_ID, inspectMap, optimizeMap } from './svg.ts';

/** Filer relativt `content/`, t.ex. `editions/2026/edition.json` → filens text */
export type ContentFiles = Record<string, string>;

export type Issue = { file: string; message: string };

export type Content = {
	site: Site;
	editions: Record<string, EditionBundle>;
};

export type ValidationResult =
	{ ok: true; content: Content; issues: [] } | { ok: false; content: undefined; issues: Issue[] };

function parseJson(files: ContentFiles, file: string, issues: Issue[]): unknown {
	const text = files[file];
	if (text === undefined) {
		issues.push({ file, message: 'filen saknas' });
		return undefined;
	}
	try {
		return JSON.parse(text);
	} catch (e) {
		issues.push({ file, message: `ogiltig JSON: ${(e as Error).message}` });
		return undefined;
	}
}

function parseWith<T extends v.GenericSchema>(
	schema: T,
	value: unknown,
	file: string,
	issues: Issue[]
): v.InferOutput<T> | undefined {
	if (value === undefined) return undefined;
	const result = v.safeParse(schema, value);
	if (result.success) return result.output;
	for (const issue of result.issues) {
		const path = v.getDotPath(issue);
		issues.push({ file, message: path ? `${path}: ${issue.message}` : issue.message });
	}
	return undefined;
}

function duplicates(ids: string[]): string[] {
	const seen = new Set<string>();
	return [...new Set(ids.filter((id) => seen.has(id) || !seen.add(id)))];
}

export function validateContent(files: ContentFiles): ValidationResult {
	const issues: Issue[] = [];
	const site = parseWith(SiteSchema, parseJson(files, 'site.json', issues), 'site.json', issues);

	const editionIds = [
		...new Set(
			Object.keys(files)
				.map((f) => /^editions\/([^/]+)\/edition\.json$/.exec(f)?.[1])
				.filter((id): id is string => !!id)
		)
	];

	if (site && !editionIds.includes(site.currentEdition)) {
		issues.push({
			file: 'site.json',
			message: `currentEdition "${site.currentEdition}" finns inte i content/editions/`
		});
	}

	const editions: Record<string, EditionBundle> = {};

	for (const dirId of editionIds) {
		const dir = `editions/${dirId}`;
		const editionFile = `${dir}/edition.json`;
		const placesFile = `${dir}/places.json`;

		const edition = parseWith(
			EditionSchema,
			parseJson(files, editionFile, issues),
			editionFile,
			issues
		);
		const places = parseWith(
			PlacesSchema,
			parseJson(files, placesFile, issues),
			placesFile,
			issues
		);
		if (!edition || !places) continue;

		const before = issues.length;
		const issue = (file: string, message: string) => issues.push({ file, message });

		if (edition.id !== dirId) {
			issue(editionFile, `id "${edition.id}" matchar inte mappnamnet "${dirId}"`);
		}

		// Unika id:n
		const lists = {
			categories: edition.categories.map((c) => c.id),
			areas: edition.areas.map((a) => a.id),
			'filters.items': edition.filters.items.map((f) => f.id),
			layers: edition.layers.map((l) => l.id)
		};
		for (const [list, ids] of Object.entries(lists)) {
			for (const id of duplicates(ids))
				issue(editionFile, `${list}: id "${id}" förekommer flera gånger`);
		}
		for (const id of duplicates(places.map((p) => p.id))) {
			issue(placesFile, `id "${id}" förekommer flera gånger`);
		}

		// Referenser från places till edition
		const categories = new Set(lists.categories);
		const areas = new Set(lists.areas);
		const features = new Set(lists['filters.items']);
		for (const p of places) {
			if (!categories.has(p.category)) issue(placesFile, `${p.id}: okänd category "${p.category}"`);
			if (!areas.has(p.area)) issue(placesFile, `${p.id}: okänt area "${p.area}"`);
			for (const f of p.features) {
				if (!features.has(f)) issue(placesFile, `${p.id}: okänd feature "${f}"`);
			}
			if (p.allergenInfo === 'menu' && !p.links.menu) {
				issue(placesFile, `${p.id}: allergenInfo "menu" kräver links.menu`);
			}
		}

		// Kartkontraktet
		const mapFile = `${dir}/${edition.map.file}`;
		const svg = files[mapFile];
		if (svg === undefined) {
			issue(mapFile, 'kartfilen saknas');
			continue;
		}

		let map: ReturnType<typeof inspectMap>;
		try {
			map = inspectMap(svg);
		} catch (e) {
			issue(mapFile, `kunde inte läsa SVG: ${(e as Error).message}`);
			continue;
		}

		if (map.rootId !== MAP_ROOT_ID) issue(mapFile, `<svg> ska ha id="${MAP_ROOT_ID}"`);
		if (!map.viewBox) issue(mapFile, '<svg> saknar giltig viewBox');
		for (const f of map.forbidden) issue(mapFile, `förbjudet innehåll: ${f}`);

		const placeIds = new Set(places.map((p) => p.id));
		for (const p of places) {
			if (!map.shapes.has(p.id))
				issue(mapFile, `place "${p.id}" saknar form (data-place) i kartan`);
		}
		for (const id of new Set([...map.shapes.keys(), ...map.labels])) {
			if (!placeIds.has(id)) {
				issue(
					mapFile,
					`data-place="${id}" finns inte i places.json (markera dekor med data-decorative)`
				);
			}
		}
		for (const c of map.decorativeCategories) {
			if (!categories.has(c)) issue(mapFile, `data-category="${c}" finns inte i categories`);
		}

		const layerIds = new Set(lists.layers);
		for (const id of map.layers) {
			if (!layerIds.has(id))
				issue(mapFile, `data-layer="${id}" finns inte i edition.json → layers`);
		}
		for (const id of layerIds) {
			if (!map.layers.has(id))
				issue(editionFile, `lagret "${id}" används inte i ${edition.map.file}`);
		}

		for (const layer of edition.layers) {
			if (layer.symbol && !map.symbols.has(layer.symbol)) {
				issue(editionFile, `layers.${layer.id}: symbolen "${layer.symbol}" finns inte i kartan`);
			}
		}
		for (const ref of map.uses) {
			if (!map.symbols.has(ref))
				issue(mapFile, `<use href="#${ref}"> pekar på en symbol som saknas`);
		}

		if (issues.length === before && map.viewBox) {
			editions[dirId] = { edition, places, map: optimizeMap(svg), viewBox: map.viewBox };
		}
	}

	if (issues.length || !site) {
		return { ok: false, content: undefined, issues };
	}
	return { ok: true, content: { site, editions }, issues: [] };
}

export function formatIssues(issues: Issue[]): string {
	const byFile = Map.groupBy(issues, (i) => i.file);
	return [...byFile]
		.map(([file, list]) => [`content/${file}`, ...list.map((i) => `  • ${i.message}`)].join('\n'))
		.join('\n\n');
}
