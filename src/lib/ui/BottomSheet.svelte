<!--
	Generiskt ark som går att dra (§6.4, §7.1). Snappar till stängt, peek eller
	expanderat utifrån position och hastighet när fingret släpper. Bara rubrikdelen
	(`header`) går att dra i, så att innehållet kan skrolla.
-->
<script lang="ts" module>
	export type Snap = 'closed' | 'peek' | 'expanded';
</script>

<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { sv } from '#lib/i18n/sv.ts';

	type Props = {
		snap: Snap;
		label: string;
		onsnap: (snap: Snap) => void;
		/** Synlig höjd i peek-läget. Utan peek är arket antingen stängt eller öppet. */
		peek?: number;
		/** Arket går upp till toppen (detaljark), annars är det så högt som innehållet */
		fill?: boolean;
		/** Med scrim bakom, som stänger arket vid tryck */
		modal?: boolean;
		z: number;
		/** Arkets höjd i px, oavsett läge */
		height?: number;
		header: Snippet;
		children: Snippet;
	};

	let {
		snap,
		label,
		onsnap,
		peek,
		fill = false,
		modal = false,
		z,
		height = $bindable(0),
		header,
		children
	}: Props = $props();

	/** Förflyttning i px innan ett tryck blir en dragning */
	const DRAG_SLOP = 6;
	/** Så långt fram (ms) hastigheten projiceras när arket släpps */
	const PROJECT_MS = 200;
	/** Avstånd under nederkanten när arket är stängt, så att skuggan inte syns */
	const HIDDEN_GAP = 24;

	let el = $state<HTMLElement>();
	let dragY = $state<number | null>(null);

	const open = $derived(snap !== 'closed');

	function offset(s: Snap): number {
		if (s === 'expanded') return 0;
		if (s === 'peek' && peek !== undefined) return Math.max(0, height - peek);
		return height + HIDDEN_GAP;
	}

	const transform = $derived.by(() => {
		if (dragY !== null) return `translateY(${dragY}px)`;
		if (snap === 'expanded') return 'translateY(0)';
		if (snap === 'peek' && peek !== undefined) return `translateY(calc(100% - ${peek}px))`;
		return `translateY(calc(100% + ${HIDDEN_GAP}px))`;
	});

	type Drag = {
		id: number;
		y0: number;
		base: number;
		active: boolean;
		samples: { t: number; y: number }[];
	};
	let drag: Drag | null = null;
	let suppressClick = false;

	function down(e: PointerEvent) {
		if (e.button > 0 || !open || drag) return;
		drag = {
			id: e.pointerId,
			y0: e.clientY,
			base: offset(snap),
			active: false,
			samples: [{ t: e.timeStamp, y: e.clientY }]
		};
		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', up);
		window.addEventListener('pointercancel', up);
	}

	function move(e: PointerEvent) {
		if (!drag || e.pointerId !== drag.id) return;
		const dy = e.clientY - drag.y0;
		if (!drag.active && Math.abs(dy) < DRAG_SLOP) return;
		drag.active = true;
		const y = drag.base + dy;
		// Gummiband uppåt, stopp nedåt
		dragY = y < 0 ? y / 4 : Math.min(y, offset('closed'));
		drag.samples = [
			...drag.samples.filter((s) => e.timeStamp - s.t < 100),
			{ t: e.timeStamp, y: e.clientY }
		];
	}

	function up(e: PointerEvent) {
		if (!drag || e.pointerId !== drag.id) return;
		window.removeEventListener('pointermove', move);
		window.removeEventListener('pointerup', up);
		window.removeEventListener('pointercancel', up);

		const { active, samples } = drag;
		drag = null;
		if (!active || dragY === null) return;

		const first = samples[0];
		const last = samples.at(-1)!;
		const velocity = last.t > first.t ? (last.y - first.y) / (last.t - first.t) : 0;
		const projected = dragY + velocity * PROJECT_MS;

		const snaps: Snap[] =
			peek === undefined ? ['expanded', 'closed'] : ['expanded', 'peek', 'closed'];
		const target = snaps.reduce((best, s) =>
			Math.abs(offset(s) - projected) < Math.abs(offset(best) - projected) ? s : best
		);

		dragY = null;
		suppressClick = true;
		setTimeout(() => (suppressClick = false));
		if (target !== snap) onsnap(target);
	}

	function onclickcapture(e: MouseEvent) {
		if (!suppressClick) return;
		e.stopPropagation();
		e.preventDefault();
	}

	function toggle() {
		onsnap(snap === 'expanded' ? 'peek' : 'expanded');
	}

	// Fokus flyttas in i arket när det öppnas och tillbaka när det stängs
	let returnFocus: HTMLElement | null = null;
	$effect(() => {
		const isOpen = open;
		untrack(() => {
			if (!el) return;
			if (isOpen && !el.contains(document.activeElement)) {
				returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
				el.focus({ preventScroll: true });
			} else if (!isOpen && el.contains(document.activeElement)) {
				returnFocus?.focus({ preventScroll: true });
				returnFocus = null;
			}
		});
	});
</script>

{#if modal}
	<div
		class="scrim"
		class:shown={open}
		style:z-index={z - 1}
		aria-hidden="true"
		onclick={() => onsnap('closed')}
	></div>
{/if}

<div
	class="sheet"
	class:fill
	role="dialog"
	aria-label={label}
	aria-modal={modal || undefined}
	tabindex="-1"
	inert={!open}
	style:z-index={z}
	style:transform
	style:transition={dragY !== null ? 'none' : undefined}
	bind:this={el}
	bind:offsetHeight={height}
>
	<div class="grab" role="presentation" onpointerdown={down} {onclickcapture}>
		{#if peek === undefined}
			<div class="handle"><span></span></div>
		{:else}
			<button
				type="button"
				class="handle"
				aria-label={snap === 'expanded' ? sv.showLess : sv.showMore}
				onclick={toggle}
			>
				<span></span>
			</button>
		{/if}
		{@render header()}
	</div>
	{@render children()}
</div>

<style>
	.scrim {
		position: absolute;
		inset: 0;
		background: rgba(20, 22, 21, 0.32);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s;
	}

	.scrim.shown {
		opacity: 1;
		pointer-events: auto;
	}

	.sheet {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		max-height: 92%;
		display: flex;
		flex-direction: column;
		background: var(--paper);
		border-radius: var(--radius-sheet) var(--radius-sheet) 0 0;
		box-shadow: 0 -8px 30px rgba(30, 28, 20, 0.18);
		transition: transform 0.4s var(--ease);
		outline: none;
	}

	.sheet.fill {
		top: calc(var(--safe-top) + 6px);
		max-height: none;
	}

	.grab {
		flex: none;
		touch-action: none;
	}

	.handle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 22px;
		padding: 0;
		border: none;
		background: none;
		cursor: grab;
	}

	.handle span {
		width: 38px;
		height: 5px;
		border-radius: 3px;
		background: rgba(31, 35, 33, 0.18);
	}
</style>
