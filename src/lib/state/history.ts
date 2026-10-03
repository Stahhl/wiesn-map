/**
 * Valt ställe och lagerarket får egna poster i historiken via shallow routing
 * (docs/teknisk-profil.md §6.2). Bakåtknappen stänger dem som i en native-app, och
 * `?plats=<id>` gör att ett tält går att dela som länk.
 */
import { goto } from '$app/navigation';
import { page } from '$app/state';

export const PLACE_PARAM = 'plats';

function urlWith(place: string | null): URL {
	const url = new URL(location.href);
	if (place) url.searchParams.set(PLACE_PARAM, place);
	else url.searchParams.delete(PLACE_PARAM);
	return url;
}

/** Stället i adressen när sidan öppnas, t.ex. från en delad länk */
export function placeFromUrl(): string | null {
	return new URL(location.href).searchParams.get(PLACE_PARAM);
}

export function openPlace(id: string) {
	const { place, ownEntry } = page.state;
	// Byte mellan ställen ersätter posten, så att bakåt alltid stänger arket
	return goto(urlWith(id), {
		shallow: true,
		replace: place !== undefined,
		state: { ...page.state, place: id, ownEntry: place === undefined ? true : ownEntry }
	});
}

export function closePlace() {
	if (page.state.place === undefined) return;
	if (page.state.ownEntry) return history.back();
	// Öppnat via länk: det finns ingen egen post att gå tillbaka från
	return goto(urlWith(null), { shallow: true, replace: true, state: {} });
}

/** Ställe från en delad länk. Ersätter posten, så att bakåt lämnar appen. */
export function restorePlace(id: string | null) {
	return goto(urlWith(id), { shallow: true, replace: true, state: id ? { place: id } : {} });
}

export function openLayers() {
	if (page.state.layers) return;
	return goto(location.href, { shallow: true, state: { ...page.state, layers: true } });
}

export function closeLayers() {
	if (page.state.layers) history.back();
}
