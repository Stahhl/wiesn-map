/**
 * Appens state med runes (docs/teknisk-profil.md §6.1). Logiken bor i filter.ts och
 * place.ts, och här kopplas den ihop med reaktiviteten.
 *
 * `selected` och `layersOpen` speglar historiken (history.ts). Ändra dem via
 * `openPlace`/`closePlace` och `openLayers`/`closeLayers`, så att bakåtknappen fungerar.
 */
import { SvelteSet } from 'svelte/reactivity';
import type { EditionBundle, Place } from '#lib/content/schema.ts';
import { countBySegment, matches, resultTitle, sortByCategory, type Criteria } from './filter.ts';

export class AppState {
	readonly edition: EditionBundle['edition'];
	readonly places: Place[];
	readonly byId: ReadonlyMap<string, Place>;

	/** Valt segment, `null` = alla */
	category = $state<string | null>(null);
	features = new SvelteSet<string>();
	selected = $state<string | null>(null);
	expanded = $state(false);
	layersOpen = $state(false);
	layers = $state<Record<string, boolean>>({});
	/** Tipset om gester visas tills kartan rörts första gången */
	hint = $state(true);

	// `$derived.by`, eftersom edition och places sätts först i konstruktorn
	readonly criteria: Criteria = $derived.by(() => ({
		category: this.category,
		features: this.features,
		mode: this.edition.filters.mode
	}));
	readonly filtersActive = $derived(this.features.size > 0);
	/** Ändras när kategori eller filter ändras. Kartan anpassar sig då efter träffarna. */
	readonly filterKey = $derived(`${this.category}|${[...this.features].sort().join()}`);
	readonly matching = $derived.by(() => this.places.filter((p) => matches(p, this.criteria)));
	// Byggs om när träffarna ändras och muteras aldrig, så ett vanligt Set räcker
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	readonly matchIds: ReadonlySet<string> = $derived(new Set(this.matching.map((p) => p.id)));
	readonly counts = $derived.by(() =>
		countBySegment(this.places, this.edition.categories, this.criteria)
	);
	readonly results = $derived.by(() => sortByCategory(this.matching, this.edition.categories));
	readonly resultTitle = $derived.by(() =>
		resultTitle(this.matching.length, this.criteria, this.edition)
	);
	readonly selectedPlace = $derived.by(() =>
		this.selected ? (this.byId.get(this.selected) ?? null) : null
	);
	/** Antal lager som är tända utöver standardvalet, för badgen på lagerknappen */
	readonly extraLayers = $derived.by(
		() => this.edition.layers.filter((l) => !l.default && this.layers[l.id]).length
	);

	constructor({ edition, places }: Pick<EditionBundle, 'edition' | 'places'>) {
		this.edition = edition;
		this.places = places;
		// Ställena ändras aldrig under sidans livstid
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		this.byId = new Map(places.map((p) => [p.id, p]));
		this.layers = Object.fromEntries(edition.layers.map((l) => [l.id, l.default]));
	}

	toggleFeature(id: string) {
		if (!this.features.delete(id)) this.features.add(id);
	}

	clearFilters() {
		this.features.clear();
	}

	toggleLayer(id: string) {
		this.layers[id] = !this.layers[id];
	}
}
