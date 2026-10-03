<script lang="ts">
	import { sv } from '#lib/i18n/sv.ts';
	import MapView from '#lib/map/MapView.svelte';
	import AppShell from '#lib/ui/AppShell.svelte';
	import Header from '#lib/ui/Header.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.edition.title} · {sv.appName}</title>
	<meta name="description" content={sv.description} />
</svelte:head>

<AppShell>
	<MapView svg={data.map} />
	<Header title={data.edition.title} subtitle={data.edition.subtitle} />
</AppShell>
