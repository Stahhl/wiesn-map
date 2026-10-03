<!--
	Teckenförklaring och lagertoggles (§6.4). Ikonerna är kartans egna `<symbol>`,
	som finns i dokumentet eftersom kartan är inline.
-->
<script lang="ts">
	import type { Edition } from '#lib/content/schema.ts';
	import { sv } from '#lib/i18n/sv.ts';
	import BottomSheet from './BottomSheet.svelte';

	type Props = {
		open: boolean;
		edition: Edition;
		layers: Readonly<Record<string, boolean>>;
		ontoggle: (id: string) => void;
		onclose: () => void;
	};

	let { open, edition, layers, ontoggle, onclose }: Props = $props();

	const legendAreas = $derived(edition.areas.filter((a) => a.legend));
</script>

<BottomSheet
	snap={open ? 'expanded' : 'closed'}
	onsnap={(s) => s === 'closed' && onclose()}
	modal
	z={7}
	label={sv.layersTitle}
>
	{#snippet header()}
		<div class="head">
			<div>
				<h2>{sv.layersTitle}</h2>
				<p>{sv.layersSubtitle}</p>
			</div>
			<button type="button" class="done" onclick={onclose}>{sv.done}</button>
		</div>
	{/snippet}

	<div class="body">
		<section>
			<h3>{sv.legendTitle}</h3>
			<ul class="legend">
				{#each edition.categories as category (category.id)}
					<li>
						<span
							class="swatch"
							class:round={category.shape === 'round'}
							style:background={category.color}
						></span>
						{category.label}
					</li>
				{/each}
				{#each legendAreas as area (area.id)}
					<li>
						<span
							class="swatch"
							style:background={area.legend!.fill}
							style:box-shadow="inset 0 0 0 1.4px {area.legend!.stroke}"
						></span>
						{area.label}
					</li>
				{/each}
			</ul>
		</section>

		<section>
			<h3>{sv.showOnMap}</h3>
			<ul class="layers">
				{#each edition.layers as layer (layer.id)}
					<li>
						<button
							type="button"
							role="switch"
							aria-checked={!!layers[layer.id]}
							onclick={() => ontoggle(layer.id)}
						>
							<span class="icon" aria-hidden="true">
								{#if layer.symbol}
									<svg width="20" height="20" viewBox="0 0 20 20">
										<use href="#{layer.symbol}" />
									</svg>
								{:else}
									<span class="swatch" style:background={layer.swatch}></span>
								{/if}
							</span>
							<span class="label">{layer.label}</span>
							<span class="toggle"><span></span></span>
						</button>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</BottomSheet>

<style>
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 0 18px 6px;
	}

	h2 {
		margin: 0;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	p {
		margin: 2px 0 0;
		font-size: 12.5px;
		color: var(--muted);
	}

	.done {
		flex: none;
		height: 36px;
		padding: 0 14px;
		border-radius: 18px;
		border: none;
		background: var(--ink);
		color: var(--paper);
		font-weight: 600;
		cursor: pointer;
	}

	.body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 8px 18px calc(var(--safe-bottom) + 24px);
		display: flex;
		flex-direction: column;
		gap: 16px;
		scrollbar-width: none;
	}

	.body::-webkit-scrollbar {
		display: none;
	}

	section {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	h3 {
		margin: 0;
		font-size: 11.5px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--subtle);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.legend {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}

	.legend li {
		padding: 10px;
		border-radius: 12px;
		background: var(--sand-2);
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 13px;
		font-weight: 600;
	}

	.legend .swatch {
		width: 16px;
		height: 16px;
		border-radius: 3px;
	}

	.swatch.round {
		border-radius: 50%;
	}

	.layers {
		border-radius: 16px;
		background: #fff;
		border: 1px solid var(--line);
	}

	.layers li + li {
		border-top: 1px solid rgba(31, 35, 33, 0.08);
	}

	.layers button {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		min-height: 50px;
		padding: 0 14px;
		border: none;
		background: none;
		cursor: pointer;
		text-align: left;
	}

	.icon {
		flex: none;
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon .swatch {
		width: 16px;
		height: 16px;
		border-radius: 3px;
	}

	.label {
		flex: 1;
		font-size: 15px;
		font-weight: 500;
	}

	.toggle {
		flex: none;
		width: 44px;
		height: 26px;
		padding: 2px;
		border-radius: 13px;
		background: rgba(31, 35, 33, 0.16);
		transition: background 0.2s;
	}

	.toggle span {
		display: block;
		width: 22px;
		height: 22px;
		border-radius: 11px;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: transform 0.2s;
	}

	[aria-checked='true'] .toggle {
		background: var(--ok);
	}

	[aria-checked='true'] .toggle span {
		transform: translateX(18px);
	}
</style>
