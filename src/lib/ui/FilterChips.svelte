<!--
	Filter från edition.filters, plus "Rensa" när något är valt (§6.4).
-->
<script lang="ts">
	import type { Filter } from '#lib/content/schema.ts';
	import { sv } from '#lib/i18n/sv.ts';

	type Props = {
		items: Filter[];
		active: ReadonlySet<string>;
		ontoggle: (id: string) => void;
		onclear: () => void;
	};

	let { items, active, ontoggle, onclear }: Props = $props();
</script>

<div class="chips" role="group" aria-label={sv.filter}>
	<span class="label" aria-hidden="true">{sv.filter}</span>
	{#each items as item (item.id)}
		<button
			type="button"
			class="chip"
			aria-pressed={active.has(item.id)}
			onclick={() => ontoggle(item.id)}
		>
			<span class="mark" aria-hidden="true">{active.has(item.id) ? '✓' : ''}</span>
			<span>{item.label}</span>
		</button>
	{/each}
	{#if active.size}
		<button type="button" class="clear" onclick={onclear}>{sv.clear}</button>
	{/if}
</div>

<style>
	.chips {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 34px;
	}

	.label {
		margin-right: 2px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--subtle);
	}

	.chip {
		height: 34px;
		padding: 0 12px 0 10px;
		border-radius: 17px;
		border: 1px solid rgba(31, 35, 33, 0.16);
		background: #fff;
		color: var(--ink);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
		transition: all 0.15s;
	}

	.chip[aria-pressed='true'] {
		border-color: var(--ink);
		background: var(--ink);
		color: var(--paper);
	}

	.mark {
		width: 16px;
		height: 16px;
		border-radius: 8px;
		border: 1.5px solid currentColor;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		line-height: 1;
	}

	.clear {
		margin-left: auto;
		padding: 6px 2px;
		border: none;
		background: none;
		font-size: 14px;
		color: var(--muted);
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
