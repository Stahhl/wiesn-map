<!--
	Mobil: fyller skärmen. Desktop: samma app i en telefonram (docs/teknisk-profil.md §7).
	Allt inuti positioneras `absolute` mot `.shell`, aldrig `fixed`, så att komponenterna
	fungerar likadant i båda lägena. Safe-area läses via --safe-* och blir fast luft i ramen.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	// Safari zoomar annars hela sidan vid nyp utanför kartan (§7.1)
	$effect(() => {
		const stop = (e: Event) => e.preventDefault();
		document.addEventListener('gesturestart', stop);
		return () => document.removeEventListener('gesturestart', stop);
	});
</script>

<div class="stage">
	<div class="shell">
		{@render children()}
	</div>
</div>

<style>
	.stage {
		height: 100%;
	}

	.shell {
		--safe-top: env(safe-area-inset-top, 0px);
		--safe-right: env(safe-area-inset-right, 0px);
		--safe-bottom: env(safe-area-inset-bottom, 0px);
		--safe-left: env(safe-area-inset-left, 0px);

		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		isolation: isolate;
		background: var(--paper);
	}

	@media (min-width: 600px) and (hover: hover) and (pointer: fine) {
		.stage {
			display: grid;
			place-items: center;
			padding: 24px;
			background: var(--page);
		}

		.shell {
			--safe-top: 16px;
			--safe-right: 0px;
			--safe-bottom: 12px;
			--safe-left: 0px;

			width: 410px;
			height: min(864px, calc(100dvh - 48px));
			border: 10px solid var(--frame);
			border-radius: 56px;
			box-shadow:
				0 30px 60px -20px rgba(30, 28, 20, 0.35),
				0 0 0 1px rgba(0, 0, 0, 0.2);
		}
	}
</style>
