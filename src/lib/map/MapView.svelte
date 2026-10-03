<!--
	Kartan som inline-SVG med gester (panzoom.ts), styling per element (styling.ts) och
	val av ställe (docs/teknisk-profil.md §6.3). SVG:n finns redan i den förrenderade
	HTML:en, så kartan syns innan JavaScript har laddats.
-->
<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import type { EditionBundle } from '#lib/content/schema.ts';
	import { sv } from '#lib/i18n/sv.ts';
	import type { AppState } from '#lib/state/app.svelte.ts';
	import { inCategory } from '#lib/state/filter.ts';
	import MapControls from './MapControls.svelte';
	import { PanZoom } from './panzoom.ts';
	import { prepareMap, styleMap } from './styling.ts';
	import type { Frame } from './transform.ts';

	type Props = {
		svg: string;
		viewBox: EditionBundle['viewBox'];
		app: AppState;
		/** Yta som täcks av headern, i px från toppen */
		top: number;
		/** Yta som täcks av ark eller resultatband, i px från botten */
		bottom: number;
		onselect: (id: string | null) => void;
	};

	let { svg, viewBox, app, top, bottom, onselect }: Props = $props();

	/** Ett tryck utanför former väljer närmaste ställe inom så här många px */
	const NEAREST_PX = 22;
	/** Ställen som inte matchar filtret räknas som så här mycket längre bort */
	const NON_MATCH_PENALTY = 8;
	const ZOOM_STEP = 1.6;
	const PAN_STEP = 80;

	let viewport = $state<HTMLDivElement>();
	let mapEl = $state<HTMLDivElement>();
	let svgEl = $state<SVGSVGElement>();
	let pz = $state<PanZoom>();
	let width = $state(0);
	let height = $state(0);

	const frame: Frame = $derived({
		width,
		height,
		mapWidth: width,
		mapHeight: (width * viewBox[3]) / viewBox[2],
		top,
		bottom,
		maxScale: app.edition.map.maxZoom
	});

	function shapes(ids: ReadonlySet<string>): Element[] {
		if (!svgEl) return [];
		return [...svgEl.querySelectorAll('[data-place]:not([data-label])')].filter((el) =>
			ids.has(el.getAttribute('data-place')!)
		);
	}

	function focusPlace(id: string, animate: boolean) {
		const box = pz?.boxOf(shapes(new Set([id])));
		if (box) pz!.focusBox(box, animate);
	}

	/** Närmaste ställe i aktuellt segment, prototypens `nearest()` */
	function nearest(cx: number, cy: number): string | null {
		let best: string | null = null;
		let bestDistance = NEAREST_PX;
		for (const el of svgEl?.querySelectorAll('[data-place]:not([data-label])') ?? []) {
			const place = app.byId.get(el.getAttribute('data-place')!);
			if (!place || !inCategory(place, app.category)) continue;
			const r = el.getBoundingClientRect();
			const distance =
				Math.hypot(Math.max(r.left - cx, 0, cx - r.right), Math.max(r.top - cy, 0, cy - r.bottom)) +
				(app.filtersActive && !app.matchIds.has(place.id) ? NON_MATCH_PENALTY : 0);
			if (distance < bestDistance) {
				bestDistance = distance;
				best = place.id;
			}
		}
		return best;
	}

	function onTap(target: Element, cx: number, cy: number) {
		const el = target.closest('[data-place]:not([data-label])');
		let id = el?.getAttribute('data-place') ?? null;
		const place = id ? app.byId.get(id) : undefined;
		if (!place || !inCategory(place, app.category)) id = nearest(cx, cy);

		if (id) {
			app.hint = false;
			onselect(id);
		} else if (app.selected) {
			onselect(null);
		}
	}

	onMount(() => {
		svgEl = mapEl!.querySelector('svg')!;
		prepareMap(svgEl, app.byId);
		pz = new PanZoom(viewport!, mapEl!, {
			frame: () => frame,
			onTap,
			onGesture: () => (app.hint = false)
		});
		return () => pz?.destroy();
	});

	// Styling per element följer state
	$effect(() => {
		if (!svgEl) return;
		styleMap(svgEl, {
			places: app.byId,
			category: app.category,
			matches: app.matchIds,
			filtersActive: app.filtersActive,
			selected: app.selected,
			layers: app.layers,
			layerConfig: app.edition.layers,
			dimOpacity: app.edition.map.dimOpacity
		});
	});

	// Kameran följer val, filter och fri yta, som prototypens componentDidUpdate
	type Snapshot = {
		selected: string | null;
		filterKey: string;
		filtersActive: boolean;
		top: number;
		bottom: number;
		width: number;
		height: number;
	};
	let previous: Snapshot | null = null;

	$effect(() => {
		const now: Snapshot = {
			selected: app.selected,
			filterKey: app.filterKey,
			filtersActive: app.filtersActive,
			top,
			bottom,
			width,
			height
		};
		if (!pz || !width || !height || !top) return;
		untrack(() => follow(now, previous));
		previous = now;
	});

	function follow(now: Snapshot, prev: Snapshot | null) {
		if (!pz) return;
		if (!prev) {
			pz.fitAll(false);
			if (now.selected) focusPlace(now.selected, false);
			return;
		}
		const insetChanged = now.top !== prev.top || now.bottom !== prev.bottom;
		if (now.selected && (now.selected !== prev.selected || insetChanged)) {
			// Ett nytt val, eller ett ark som bytt höjd: stället ska synas mitt i den fria ytan
			return focusPlace(now.selected, true);
		}

		if (now.filterKey !== prev.filterKey && !now.selected && app.edition.map.autoFit) {
			if (now.filtersActive && app.matching.length) {
				const box = pz.boxOf(shapes(app.matchIds));
				if (box) return pz.fitBox(box);
			} else if (!now.filtersActive && prev.filtersActive) {
				return pz.fitAll();
			}
		}

		const resized = now.width !== prev.width || now.height !== prev.height;
		if (resized || insetChanged) pz.refresh(!resized);
	}

	function onkeydown(e: KeyboardEvent) {
		if (!pz || e.metaKey || e.ctrlKey || e.altKey || app.layersOpen) return;
		const target = e.target instanceof Element ? e.target : null;

		const place = target?.closest('#wiesn-map [data-place]')?.getAttribute('data-place');
		if (place && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			onselect(place);
			return;
		}

		// Piltangenter bara när fokus inte ligger i ett ark eller en knapp
		const onMap = !target || target === document.body || !!viewport?.contains(target);
		const action: Record<string, () => void> = {
			'+': () => pz!.zoomBy(ZOOM_STEP),
			'=': () => pz!.zoomBy(ZOOM_STEP),
			'-': () => pz!.zoomBy(1 / ZOOM_STEP),
			'0': () => pz!.fitAll(),
			...(onMap && {
				ArrowLeft: () => pz!.panBy(PAN_STEP, 0),
				ArrowRight: () => pz!.panBy(-PAN_STEP, 0),
				ArrowUp: () => pz!.panBy(0, PAN_STEP),
				ArrowDown: () => pz!.panBy(0, -PAN_STEP)
			})
		};
		const run = action[e.key];
		if (run) {
			e.preventDefault();
			app.hint = false;
			run();
		}
	}
</script>

<svelte:window {onkeydown} />

<div
	class="viewport"
	role="region"
	aria-label={sv.mapLabel}
	bind:this={viewport}
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<!-- Kartan kommer från content/, är validerad vid build och saknar skript (§5). -->
	<div class="map" style:--aspect="{viewBox[2]} / {viewBox[3]}" bind:this={mapEl}>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html svg}
	</div>
</div>

<MapControls
	{top}
	{bottom}
	hint={app.hint}
	hidden={app.selected !== null}
	onzoomin={() => pz?.zoomBy(ZOOM_STEP)}
	onzoomout={() => pz?.zoomBy(1 / ZOOM_STEP)}
	onfit={() => pz?.fitAll()}
/>

<style>
	.viewport {
		position: absolute;
		inset: 0;
		overflow: hidden;
		background: var(--ground);
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
	}

	@media (hover: hover) and (pointer: fine) {
		.viewport {
			cursor: grab;
		}

		.viewport:global([data-dragging]) {
			cursor: grabbing;
		}
	}

	.map {
		position: absolute;
		left: 0;
		top: 0;
		transform-origin: 0 0;
		background: var(--paper);
		box-shadow: 0 0 0 1px rgba(31, 35, 33, 0.06);
	}

	/* Innan PanZoom har tagit över: ungefär samma läge som "visa hela kartan" */
	.map:not([data-ready]) {
		left: 50%;
		top: calc(var(--safe-top) + 162px);
		height: calc(100% - var(--safe-top) - 178px);
		max-width: 100%;
		aspect-ratio: var(--aspect);
		transform: translateX(-50%);
	}

	.map :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}

	.map :global([data-place]) {
		cursor: pointer;
		transition: opacity 0.25s ease;
	}

	.map :global([data-place]:focus) {
		outline: none;
	}

	.map :global([data-place]:focus-visible) {
		outline: 2px solid var(--ink);
		outline-offset: 2px;
	}

	.map :global([data-layer]) {
		transition: opacity 0.2s ease;
	}

	.map :global(:is([data-label], [data-layer], [data-decorative])) {
		pointer-events: none;
	}
</style>
