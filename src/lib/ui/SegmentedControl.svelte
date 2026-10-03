<!--
	"Alla" plus en knapp per kategori, med antal träffar (§6.4).
-->
<script lang="ts" module>
	export type Segment = {
		/** `null` = alla */
		id: string | null;
		label: string;
		/** CSS-bakgrund för färgrutan */
		swatch: string;
		round: boolean;
		count: number;
	};
</script>

<script lang="ts">
	import { sv } from '#lib/i18n/sv.ts';

	type Props = { segments: Segment[]; value: string | null; onchange: (id: string | null) => void };

	let { segments, value, onchange }: Props = $props();
</script>

<div class="segments" role="group" aria-label={sv.segmentsLabel} style:--n={segments.length}>
	{#each segments as seg (seg.id)}
		<button type="button" aria-pressed={seg.id === value} onclick={() => onchange(seg.id)}>
			<span class="swatch" class:round={seg.round} style:background={seg.swatch}></span>
			<span>{seg.label}</span>
			<span class="count">{seg.count}</span>
		</button>
	{/each}
</div>

<style>
	.segments {
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		gap: 2px;
		padding: 3px;
		border-radius: 12px;
		background: var(--sand);
	}

	button {
		height: 34px;
		border: none;
		border-radius: 9px;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
		transition:
			background 0.15s,
			box-shadow 0.15s;
	}

	button[aria-pressed='true'] {
		background: var(--paper);
		box-shadow: 0 1px 3px rgba(30, 28, 20, 0.14);
	}

	.swatch {
		flex: none;
		width: 8px;
		height: 8px;
		border-radius: 2px;
	}

	.swatch.round {
		border-radius: 50%;
	}

	.count {
		color: var(--subtle);
		font-weight: 500;
		font-variant-numeric: tabular-nums;
	}
</style>
