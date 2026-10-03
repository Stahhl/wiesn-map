/**
 * Läser och optimerar kartans SVG vid build. Kontraktet beskrivs i
 * docs/teknisk-profil.md §5.
 */
import { optimize, type XastElement, type XastParent, type XastRoot } from 'svgo';

export const MAP_ROOT_ID = 'wiesn-map';

export type MapInfo = {
	rootId: string | undefined;
	viewBox: [number, number, number, number] | undefined;
	/** `data-place` på klickbara former (etiketter räknas inte) */
	shapes: Map<string, number>;
	/** `data-place` på etiketter (`data-label`) */
	labels: Set<string>;
	/** `data-category` på dekor utan data (`data-decorative`) */
	decorativeCategories: Set<string>;
	layers: Set<string>;
	symbols: Set<string>;
	/** Interna referenser från `<use href="#…">` */
	uses: Set<string>;
	/** Beskrivningar av förbjudet innehåll, tomt om allt är i sin ordning */
	forbidden: string[];
};

/** Parsar SVG med SVGO:s parser utan att ändra något. */
export function parseSvg(svg: string): XastRoot {
	let ast: XastRoot | undefined;
	optimize(svg, {
		plugins: [
			{
				name: 'capture-ast',
				fn: (root) => {
					ast = root;
					return null;
				}
			}
		]
	});
	if (!ast) throw new Error('kunde inte läsa SVG');
	return ast;
}

function* walk(node: XastParent): Generator<XastElement> {
	for (const child of node.children) {
		if (child.type === 'element') {
			yield child;
			yield* walk(child);
		}
	}
}

const FORBIDDEN_ELEMENTS = new Set(['script', 'foreignObject', 'iframe', 'embed', 'object']);

export function inspectMap(svg: string): MapInfo {
	const root = parseSvg(svg);
	const svgEl = root.children.find((c): c is XastElement => c.type === 'element');

	const info: MapInfo = {
		rootId: svgEl?.attributes.id,
		viewBox: undefined,
		shapes: new Map(),
		labels: new Set(),
		decorativeCategories: new Set(),
		layers: new Set(),
		symbols: new Set(),
		uses: new Set(),
		forbidden: []
	};

	if (!svgEl || svgEl.name !== 'svg') {
		info.forbidden.push('filen saknar ett <svg>-element');
		return info;
	}

	const vb = svgEl.attributes.viewBox
		?.trim()
		.split(/[\s,]+/)
		.map(Number);
	if (vb?.length === 4 && vb.every(Number.isFinite) && vb[2] > 0 && vb[3] > 0) {
		info.viewBox = vb as MapInfo['viewBox'];
	}

	for (const el of [svgEl, ...walk(svgEl)]) {
		const a = el.attributes;

		if (FORBIDDEN_ELEMENTS.has(el.name)) info.forbidden.push(`<${el.name}> är inte tillåtet`);

		for (const [name, value] of Object.entries(a)) {
			if (/^on/i.test(name)) info.forbidden.push(`attributet ${name} på <${el.name}>`);
			if ((name === 'href' || name === 'xlink:href') && !value.startsWith('#')) {
				info.forbidden.push(`extern länk ${name}="${value}" på <${el.name}>`);
			}
			if (/url\(\s*['"]?(?!#)/i.test(value)) {
				info.forbidden.push(`extern url() i ${name} på <${el.name}>`);
			}
		}

		if (el.name === 'style') {
			const css = el.children.map((c) => ('value' in c ? c.value : '')).join('');
			if (/@import/i.test(css)) info.forbidden.push('@import i <style>');
			if (/url\(\s*['"]?(?!#)/i.test(css)) info.forbidden.push('extern url() i <style>');
		}

		if (el.name === 'symbol' && a.id) info.symbols.add(a.id);

		const href = a.href ?? a['xlink:href'];
		if (el.name === 'use' && href?.startsWith('#')) info.uses.add(href.slice(1));

		if (a['data-layer']) info.layers.add(a['data-layer']);

		if ('data-decorative' in a) {
			if (a['data-category']) info.decorativeCategories.add(a['data-category']);
			continue;
		}

		const place = a['data-place'];
		if (place) {
			if ('data-label' in a) info.labels.add(place);
			else info.shapes.set(place, (info.shapes.get(place) ?? 0) + 1);
		}
	}

	return info;
}

/**
 * Optimerar kartan för leverans. Försiktig konfiguration: id, klasser, `<style>` och
 * kontraktets `data-*` behålls. Bara metadata och attribut från ritverktyget tas bort.
 */
export function optimizeMap(svg: string): string {
	return optimize(svg, {
		multipass: false,
		plugins: [
			'removeDoctype',
			'removeXMLProcInst',
			'removeComments',
			'removeMetadata',
			'removeEditorsNSData',
			'removeUnusedNS',
			'removeXlink',
			'cleanupNumericValues',
			{
				name: 'removeAttrs',
				params: { attrs: ['data-source-.*', 'data-display-.*'] }
			}
		]
	}).data;
}
