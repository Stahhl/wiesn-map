<!--
	Rubrik och undertitel. Lagerknapp, segment och filterchips kommer i nästa steg (§6.4).
-->
<script lang="ts">
	let { title, subtitle }: { title: string; subtitle: string } = $props();
</script>

<header class="header">
	<h1>{title}</h1>
	<p>{subtitle}</p>
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
		gap: 2px;
		padding: 12px;
		border-radius: 20px;
		background: rgba(255, 254, 249, 0.93);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		box-shadow:
			0 8px 24px -8px rgba(30, 28, 20, 0.25),
			0 0 0 1px rgba(31, 35, 33, 0.06);
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
</style>
