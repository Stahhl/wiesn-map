<!--
	Titel, lagerknapp, segment och filter (§6.4). Headerns underkant mäts och blir
	kartans övre inset (`bottom`), så att kartan aldrig hamnar under den.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { sv } from '#lib/i18n/sv.ts';

	type Props = {
		title: string;
		subtitle: string;
		/** Antal lager tända utöver standardvalet */
		badge: number;
		onlayers: () => void;
		/** Avstånd från appens topp till headerns underkant, i px */
		bottom?: number;
		children: Snippet;
	};

	let { title, subtitle, badge, onlayers, bottom = $bindable(0), children }: Props = $props();

	function measure(el: HTMLElement) {
		const update = () => (bottom = el.offsetTop + el.offsetHeight);
		const ro = new ResizeObserver(update);
		ro.observe(el);
		if (el.offsetParent) ro.observe(el.offsetParent);
		return () => ro.disconnect();
	}
</script>

<header class="header" {@attach measure}>
	<div class="top">
		<div class="titles">
			<h1>{title}</h1>
			<p>{subtitle}</p>
		</div>
		<button
			type="button"
			class="layers"
			onclick={onlayers}
			aria-haspopup="dialog"
			aria-label={badge ? `${sv.layers}, ${sv.layersBadge(badge)}` : undefined}
		>
			<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
				<path d="M9 2 16 6 9 10 2 6Z" />
				<path d="M2 9.5 9 13.5 16 9.5" />
				<path d="M2 12.8 9 16.8 16 12.8" />
			</svg>
			<span>{sv.layers}</span>
			{#if badge}
				<span class="badge" aria-hidden="true">{badge}</span>
			{/if}
		</button>
	</div>
	{@render children()}
</header>

<style>
	.header {
		position: absolute;
		top: calc(var(--safe-top) + 8px);
		left: calc(var(--safe-left) + 10px);
		right: calc(var(--safe-right) + 10px);
		z-index: 4;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 12px;
		border-radius: 20px;
		background: rgba(255, 254, 249, 0.93);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		box-shadow:
			0 8px 24px -8px rgba(30, 28, 20, 0.25),
			0 0 0 1px rgba(31, 35, 33, 0.06);
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.titles {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	h1 {
		margin: 0;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	p {
		margin: 0;
		font-size: 12.5px;
		color: var(--muted);
	}

	.layers {
		flex: none;
		height: 40px;
		padding: 0 12px 0 10px;
		border: none;
		border-radius: 12px;
		background: var(--sand);
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 600;
	}

	@media (hover: hover) {
		.layers:hover {
			background: #e6e2d5;
		}
	}

	.layers svg {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.6;
		stroke-linejoin: round;
	}

	.badge {
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		border-radius: 9px;
		background: var(--ink);
		color: var(--paper);
		font-size: 11px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
