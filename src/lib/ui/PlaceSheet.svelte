<!--
	Detaljark för ett ställe (§6.4): typ, namn, taggar och snabblänkar i peek-läget,
	fakta och alla länkar när arket dras upp. Det som saknas i datan visas inte.
-->
<script lang="ts" module>
	/** Synlig höjd i peek-läget */
	export const PEEK = 300;
</script>

<script lang="ts">
	import type { Edition, Place } from '#lib/content/schema.ts';
	import { sv } from '#lib/i18n/sv.ts';
	import { categoryOf, kindLabel, placeFacts, placeLinks, placeTags } from '#lib/state/place.ts';
	import BottomSheet, { type Snap } from './BottomSheet.svelte';

	type Props = {
		place: Place | null;
		edition: Edition;
		expanded: boolean;
		onexpand: (expanded: boolean) => void;
		onclose: () => void;
		/** Hur mycket av kartan arket täcker när det inte är expanderat */
		inset?: number;
	};

	let { place, edition, expanded, onexpand, onclose, inset = $bindable(0) }: Props = $props();

	// Innehållet ligger kvar medan arket glider ut
	let last: Place | null = null;
	const shown = $derived.by(() => (place ? (last = place) : last));

	const category = $derived(shown && categoryOf(shown, edition));
	const tags = $derived(shown ? placeTags(shown, edition) : []);
	const facts = $derived(shown ? placeFacts(shown, edition) : []);
	const links = $derived(shown ? placeLinks(shown) : []);
	/** Snabbknapparna i peek-läget */
	const quick = $derived(links.filter((l) => ['menu', 'website', 'instagram'].includes(l.kind)));

	/**
	 * Med länkar eller beskrivning har arket ett peek-läge och kan dras upp. Annars får
	 * allt plats direkt, och arket blir bara så högt som innehållet.
	 */
	const hasMore = $derived(links.length > 0 || !!shown?.description);
	const snap: Snap = $derived(place ? (hasMore && !expanded ? 'peek' : 'expanded') : 'closed');

	let height = $state(0);
	$effect(() => {
		inset = hasMore ? PEEK : height;
	});

	function onsnap(s: Snap) {
		if (s === 'closed') onclose();
		else onexpand(s === 'expanded');
	}
</script>

<BottomSheet
	{snap}
	{onsnap}
	peek={hasMore ? PEEK : undefined}
	fill={hasMore}
	z={5}
	label={shown?.name ?? ''}
	bind:height
>
	{#snippet header()}
		{#if shown && category}
			<div class="head">
				<div class="titles">
					<div class="kind">
						<span
							class="swatch"
							class:round={category.shape === 'round'}
							style:background={category.color}
						></span>
						{kindLabel(shown, edition)}
					</div>
					<h2>{shown.name}</h2>
				</div>
				<button type="button" class="close" aria-label={sv.close} onclick={onclose}>
					<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
						<path d="M2 2l8 8M10 2l-8 8" />
					</svg>
				</button>
			</div>

			<ul class="tags">
				{#each tags as tag (tag.label)}
					<li style:background={tag.bg} style:color={tag.fg}>{tag.label}</li>
				{/each}
			</ul>

			{#if quick.length}
				<div class="quick">
					{#each quick as link, i (link.kind)}
						<a href={link.href} class:primary={i === 0} target="_blank" rel="noopener">
							{link.label}
						</a>
					{/each}
				</div>
			{/if}

			{#if hasMore}
				<button
					type="button"
					class="more"
					aria-expanded={expanded}
					onclick={() => onexpand(!expanded)}
				>
					{expanded ? sv.showLess : sv.showMore}
				</button>
			{/if}
		{/if}
	{/snippet}

	<div class="body" class:scroll={expanded || !hasMore}>
		{#if shown}
			<dl class="facts">
				{#each facts as fact (fact.label)}
					<div>
						<dt>{fact.label}</dt>
						<dd>{fact.value}</dd>
					</div>
				{/each}
			</dl>

			{#if shown.description}
				<p class="description">{shown.description}</p>
			{/if}

			{#if links.length}
				<section class="links">
					<h3>{sv.linksTitle}</h3>
					{#each links as link (link.kind)}
						<a href={link.href} target="_blank" rel="noopener">
							<span class="mono" aria-hidden="true">{link.mono}</span>
							<span class="text">
								<span class="label">{link.label}</span>
								<span class="sub">{link.sub}</span>
							</span>
							<span class="arrow" aria-hidden="true">↗</span>
						</a>
					{/each}
				</section>
			{/if}
		{/if}
	</div>
</BottomSheet>

<style>
	.head {
		padding: 2px 18px 0;
		display: flex;
		gap: 12px;
		align-items: flex-start;
	}

	.titles {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.kind {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 11.5px;
		font-weight: 600;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.swatch {
		width: 10px;
		height: 10px;
		border-radius: 2px;
	}

	.swatch.round {
		border-radius: 50%;
	}

	h2 {
		margin: 0;
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.15;
		text-wrap: pretty;
	}

	.close {
		flex: none;
		width: 32px;
		height: 32px;
		border-radius: 16px;
		border: none;
		background: var(--sand);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close svg {
		stroke: var(--ink);
		stroke-width: 1.8;
		stroke-linecap: round;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 0;
		padding: 12px 18px 0;
		list-style: none;
	}

	.tags li {
		height: 26px;
		padding: 0 10px;
		border-radius: 13px;
		font-size: 12.5px;
		font-weight: 600;
		display: flex;
		align-items: center;
	}

	.quick {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
		padding: 16px 18px 0;
	}

	.quick a {
		height: 46px;
		border-radius: 14px;
		border: 1px solid rgba(31, 35, 33, 0.14);
		background: #fff;
		color: var(--ink);
		font-size: 14.5px;
		font-weight: 600;
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.quick a.primary {
		border-color: var(--ink);
		background: var(--ink);
		color: var(--paper);
	}

	.more {
		display: flex;
		align-items: center;
		justify-content: center;
		width: calc(100% - 36px);
		height: 36px;
		margin: 12px 18px 0;
		border: none;
		background: none;
		color: var(--muted);
		font-size: 13.5px;
		cursor: pointer;
	}

	.body {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		padding: 16px 18px calc(var(--safe-bottom) + 24px);
		display: flex;
		flex-direction: column;
		gap: 18px;
		scrollbar-width: none;
		overscroll-behavior: contain;
	}

	.body.scroll {
		overflow-y: auto;
	}

	.body::-webkit-scrollbar {
		display: none;
	}

	.facts {
		flex: none;
		margin: 0;
		border-radius: 16px;
		border: 1px solid var(--line);
		background: #fff;
	}

	.facts div {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 12px 14px;
		font-size: 14px;
	}

	.facts div + div {
		border-top: 1px solid rgba(31, 35, 33, 0.08);
	}

	dt {
		color: var(--muted);
	}

	dd {
		margin: 0;
		font-weight: 600;
		text-align: right;
	}

	.description {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.5;
	}

	.links {
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

	.links a {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
		border-radius: 14px;
		background: var(--sand-2);
		color: var(--ink);
		text-decoration: none;
	}

	.mono {
		flex: none;
		width: 32px;
		height: 32px;
		border-radius: 9px;
		background: var(--paper);
		border: 1px solid var(--line);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: 700;
	}

	.text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.label {
		font-size: 14.5px;
		font-weight: 600;
	}

	.sub {
		font-size: 12.5px;
		color: var(--muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.arrow {
		color: var(--subtle);
	}
</style>
