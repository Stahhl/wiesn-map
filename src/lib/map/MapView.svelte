<!--
	Kartan som inline-SVG. I det här steget visas den bara anpassad till ytan.
	Pan/zoom (panzoom.ts), styling per element (styling.ts) och val av ställe kommer
	i nästa steg (docs/teknisk-profil.md §6.3).
-->
<script lang="ts">
	let { svg }: { svg: string } = $props();
</script>

<div class="viewport">
	<!-- Kartan kommer från content/, är validerad vid build och saknar skript (§5). -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<div class="map">{@html svg}</div>
</div>

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

	.map {
		position: absolute;
		inset: calc(var(--safe-top) + 84px) 0 var(--safe-bottom);
	}

	.map :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
