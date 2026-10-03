<!--
	Kompass och gesttips under headern, zoomknappar nere till höger (§6.4).
-->
<script lang="ts">
	import { sv } from '#lib/i18n/sv.ts';

	type Props = {
		top: number;
		bottom: number;
		hint: boolean;
		/** Dolda när detaljarket täcker kartan */
		hidden: boolean;
		onzoomin: () => void;
		onzoomout: () => void;
		onfit: () => void;
	};

	let { top, bottom, hint, hidden, onzoomin, onzoomout, onfit }: Props = $props();
</script>

<div class="overlay" style:top="{top + 4}px">
	<div class="compass" role="img" aria-label={sv.north}>
		<span class="needle"></span>
		<span>N</span>
	</div>
	<p class="hint" class:shown={hint} aria-hidden={!hint}>
		<span class="touch">{sv.hintTouch}</span>
		<span class="mouse">{sv.hintMouse}</span>
	</p>
</div>

<div class="zoom" class:hidden inert={hidden} style:bottom="max(var(--safe-bottom), {bottom}px)">
	<button type="button" aria-label={sv.zoomIn} onclick={onzoomin}>+</button>
	<button type="button" aria-label={sv.zoomOut} onclick={onzoomout}>−</button>
	<button type="button" aria-label={sv.fitAll} onclick={onfit}>
		<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
			<path d="M2 6V2h4M12 2h4v4M16 12v4h-4M6 16H2v-4" />
		</svg>
	</button>
</div>

<style>
	.overlay {
		position: absolute;
		left: calc(var(--safe-left) + 12px);
		right: calc(var(--safe-right) + 12px);
		z-index: 3;
		display: flex;
		align-items: center;
		gap: 8px;
		pointer-events: none;
	}

	.compass {
		flex: none;
		width: 36px;
		height: 36px;
		border-radius: 18px;
		background: var(--paper);
		box-shadow: 0 2px 8px rgba(30, 28, 20, 0.14);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		font-weight: 700;
		line-height: 1;
	}

	.needle {
		width: 0;
		height: 0;
		margin-bottom: 1px;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-bottom: 8px solid #d6093b;
	}

	.hint {
		margin: 0;
		padding: 7px 12px;
		border-radius: 16px;
		background: rgba(31, 35, 33, 0.86);
		color: var(--paper);
		font-size: 12.5px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		opacity: 0;
		transition: opacity 0.4s;
	}

	.hint.shown {
		opacity: 1;
	}

	.mouse {
		display: none;
	}

	@media (hover: hover) and (pointer: fine) {
		.touch {
			display: none;
		}

		.mouse {
			display: inline;
		}
	}

	.zoom {
		position: absolute;
		right: calc(var(--safe-right) + 14px);
		z-index: 3;
		margin-bottom: 16px;
		display: flex;
		flex-direction: column;
		border-radius: 14px;
		background: var(--paper);
		box-shadow: 0 2px 10px rgba(30, 28, 20, 0.16);
		overflow: hidden;
		transition:
			bottom 0.35s var(--ease),
			opacity 0.2s;
	}

	.zoom.hidden {
		opacity: 0;
		pointer-events: none;
	}

	button {
		width: 44px;
		height: 44px;
		border: none;
		background: none;
		font-size: 22px;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button + button {
		border-top: 1px solid rgba(31, 35, 33, 0.08);
	}

	button:active {
		background: var(--ground);
	}

	@media (hover: hover) {
		button:hover {
			background: var(--ground);
		}
	}

	svg {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.7;
		stroke-linecap: round;
	}
</style>
