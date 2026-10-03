<!--
	Ny deploy (docs/teknisk-profil.md §8). SvelteKit kollar versionen var femte minut.
	Är inget ark öppet laddar appen om tyst nästa gång den kommer tillbaka från
	bakgrunden. Annars visas en diskret banner, så att ingen tappar det de tittar på.
-->
<script lang="ts">
	import { updated } from '$app/state';
	import { sv } from '#lib/i18n/sv.ts';

	let { busy }: { busy: boolean } = $props();

	$effect(() => {
		if (!updated.current || busy) return;
		const reload = () => {
			if (document.visibilityState === 'visible') location.reload();
		};
		document.addEventListener('visibilitychange', reload);
		return () => document.removeEventListener('visibilitychange', reload);
	});
</script>

{#if updated.current && busy}
	<div class="notice" role="status">
		<span>{sv.updateAvailable}</span>
		<button type="button" onclick={() => location.reload()}>{sv.update}</button>
	</div>
{/if}

<style>
	.notice {
		position: absolute;
		left: 50%;
		bottom: calc(var(--safe-bottom) + 16px);
		z-index: 9;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 6px 6px 6px 14px;
		border-radius: 20px;
		background: rgba(31, 35, 33, 0.92);
		color: var(--paper);
		font-size: 13.5px;
		white-space: nowrap;
		box-shadow: 0 6px 20px rgba(30, 28, 20, 0.25);
	}

	button {
		height: 30px;
		padding: 0 12px;
		border-radius: 15px;
		border: none;
		background: var(--paper);
		color: var(--ink);
		font-weight: 600;
		cursor: pointer;
	}
</style>
