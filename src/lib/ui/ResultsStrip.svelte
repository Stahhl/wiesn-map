<!--
	Träffarna för aktiva filter som ett horisontellt band (§6.4), eller ett tips och
	"Rensa" när inget matchar. Höjden mäts och blir kartans nedre inset.
-->
<script lang="ts">
	import type { Edition, Place } from '#lib/content/schema.ts';
	import { sv } from '#lib/i18n/sv.ts';
	import { categoryOf, shortKindLabel } from '#lib/state/place.ts';

	type Props = {
		shown: boolean;
		title: string;
		results: Place[];
		edition: Edition;
		onselect: (id: string) => void;
		onclear: () => void;
		height?: number;
	};

	let {
		shown,
		title,
		results,
		edition,
		onselect,
		onclear,
		height = $bindable(0)
	}: Props = $props();
</script>

<section
	class="strip"
	class:shown
	inert={!shown}
	aria-label={sv.results}
	bind:offsetHeight={height}
>
	<div class="head">
		<h2 aria-live="polite">{title}</h2>
		{#if results.length}<span>{sv.tapForInfo}</span>{/if}
	</div>

	{#if results.length}
		<ul class="list">
			{#each results as place (place.id)}
				{@const category = categoryOf(place, edition)}
				<li>
					<button type="button" onclick={() => onselect(place.id)}>
						<span class="kind">
							<span
								class="swatch"
								class:round={category.shape === 'round'}
								style:background={category.color}
							></span>
							<span class="kind-label">{shortKindLabel(place, edition)}</span>
						</span>
						<span class="name">{place.name}</span>
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="empty">
			<p>{sv.noResultsHint}</p>
			<button type="button" onclick={onclear}>{sv.clear}</button>
		</div>
	{/if}
</section>

<style>
	.strip {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 4;
		padding: 14px 0 calc(var(--safe-bottom) + 14px);
		background: var(--paper);
		border-radius: 22px 22px 0 0;
		box-shadow: 0 -6px 24px rgba(30, 28, 20, 0.12);
		transform: translateY(calc(100% + 24px));
		transition: transform 0.35s var(--ease);
	}

	.strip.shown {
		transform: translateY(0);
	}

	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 0 18px 10px;
	}

	h2 {
		margin: 0;
		font-size: 15px;
		font-weight: 700;
	}

	.head span {
		flex: none;
		font-size: 12.5px;
		color: var(--muted);
	}

	.list {
		display: flex;
		gap: 10px;
		margin: 0;
		padding: 0 18px 2px;
		list-style: none;
		overflow-x: auto;
		overscroll-behavior: contain;
		touch-action: pan-x;
		scrollbar-width: none;
	}

	.list::-webkit-scrollbar {
		display: none;
	}

	.list button {
		width: 180px;
		padding: 11px 12px;
		border-radius: 14px;
		border: 1px solid var(--line);
		background: #fff;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 6px;
		text-align: left;
	}

	@media (hover: hover) {
		.list button:hover {
			border-color: rgba(31, 35, 33, 0.3);
		}
	}

	.kind {
		display: flex;
		align-items: center;
		gap: 6px;
		width: 100%;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
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

	.kind-label,
	.name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.name {
		width: 100%;
		font-size: 14.5px;
		font-weight: 650;
		line-height: 1.2;
	}

	.empty {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 0 18px;
	}

	.empty p {
		margin: 0;
		font-size: 13.5px;
		color: var(--muted);
	}

	.empty button {
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
</style>
