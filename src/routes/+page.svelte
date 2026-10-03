<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { page } from '$app/state';
	import { sv } from '#lib/i18n/sv.ts';
	import MapView from '#lib/map/MapView.svelte';
	import { AppState } from '#lib/state/app.svelte.ts';
	import {
		closeLayers,
		closePlace,
		openLayers,
		openPlace,
		placeFromUrl,
		restorePlace
	} from '#lib/state/history.ts';
	import AppShell from '#lib/ui/AppShell.svelte';
	import FilterChips from '#lib/ui/FilterChips.svelte';
	import Header from '#lib/ui/Header.svelte';
	import LayersSheet from '#lib/ui/LayersSheet.svelte';
	import PlaceSheet from '#lib/ui/PlaceSheet.svelte';
	import ResultsStrip from '#lib/ui/ResultsStrip.svelte';
	import SegmentedControl, { type Segment } from '#lib/ui/SegmentedControl.svelte';
	import UpdateNotice from '#lib/ui/UpdateNotice.svelte';

	let { data } = $props();

	// Sidan är förrenderad med en enda upplaga, så data byts aldrig under sidans livstid
	const app = new AppState(untrack(() => data));
	const { edition } = app;

	let headerBottom = $state(0);
	let resultsHeight = $state(0);
	let sheetInset = $state(0);

	/** Kartans fria yta: under headern och ovanför ark eller resultatband */
	const top = $derived(headerBottom ? headerBottom + 6 : 0);
	const bottom = $derived(app.selected ? sheetInset : app.filtersActive ? resultsHeight : 0);

	/** "Alla" får en ruta med alla kategoriers färger */
	function splitSwatch(colors: string[]): string {
		const step = 100 / colors.length;
		const stops = colors.map((c, i) => `${c} ${i * step}% ${(i + 1) * step}%`);
		return `linear-gradient(135deg, ${stops.join(', ')})`;
	}

	const segments: Segment[] = $derived([
		{
			id: null,
			label: sv.all,
			swatch: splitSwatch(edition.categories.map((c) => c.color)),
			round: false,
			count: app.counts.get(null) ?? 0
		},
		...edition.categories.map((c) => ({
			id: c.id,
			label: c.short,
			swatch: c.color,
			round: c.shape === 'round',
			count: app.counts.get(c.id) ?? 0
		}))
	]);

	// Historiken bestämmer valt ställe och lagerarket (history.ts)
	$effect(() => {
		const place = page.state.place ?? null;
		const id = place && app.byId.has(place) ? place : null;
		untrack(() => {
			if (app.selected === id) return;
			app.selected = id;
			app.expanded = false;
			if (id) app.hint = false;
		});
	});

	$effect(() => {
		app.layersOpen = !!page.state.layers;
	});

	onMount(() => {
		const id = placeFromUrl();
		if (id) restorePlace(app.byId.has(id) ? id : null);
	});

	/** Segment och filter stänger ett öppet ställe, som i prototypen */
	function changeFilter(change: () => void) {
		change();
		closePlace();
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		if (app.layersOpen) closeLayers();
		else if (app.selected) closePlace();
	}
</script>

<svelte:window {onkeydown} />

<svelte:head>
	<title>{edition.title} · {sv.appName}</title>
	<meta name="description" content={sv.description} />
</svelte:head>

<AppShell>
	<Header
		title={edition.title}
		subtitle={edition.subtitle}
		badge={app.extraLayers}
		onlayers={openLayers}
		bind:bottom={headerBottom}
	>
		<SegmentedControl
			{segments}
			value={app.category}
			onchange={(id) => changeFilter(() => (app.category = id))}
		/>
		{#if edition.filters.items.length}
			<FilterChips
				items={edition.filters.items}
				active={app.features}
				ontoggle={(id) => changeFilter(() => app.toggleFeature(id))}
				onclear={() => changeFilter(() => app.clearFilters())}
			/>
		{/if}
	</Header>

	<MapView
		svg={data.map}
		viewBox={data.viewBox}
		{app}
		{top}
		{bottom}
		onselect={(id) => (id ? openPlace(id) : closePlace())}
	/>

	<ResultsStrip
		shown={app.filtersActive && !app.selected}
		title={app.resultTitle}
		results={app.results}
		{edition}
		onselect={openPlace}
		onclear={() => changeFilter(() => app.clearFilters())}
		bind:height={resultsHeight}
	/>

	<PlaceSheet
		place={app.selectedPlace}
		{edition}
		expanded={app.expanded}
		onexpand={(expanded) => (app.expanded = expanded)}
		onclose={closePlace}
		bind:inset={sheetInset}
	/>

	<LayersSheet
		open={app.layersOpen}
		{edition}
		layers={app.layers}
		ontoggle={(id) => app.toggleLayer(id)}
		onclose={closeLayers}
	/>

	<UpdateNotice busy={app.selected !== null || app.layersOpen} />
</AppShell>
