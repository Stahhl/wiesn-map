/**
 * Offline och uppdateringar (docs/teknisk-profil.md §8).
 *
 * Vid installation förcachas app-skalet, de förrenderade sidorna och de statiska
 * filerna. Byggfiler med hash tas alltid från cachen. Sidor och data hämtas från
 * nätet först, så att en ny deploy syns direkt, och från cachen när nätet inte
 * svarar i tid. Inne i tälten är det vanligt.
 */
import { version } from '$app/env';
import { assets, immutable, prerendered } from '$app/manifest';
import { self } from '$app/service-worker';

const CACHE = `wiesn-${version}`;
/** Längsta väntan på nätet innan svaret tas från cachen */
const NETWORK_TIMEOUT_MS = 3000;

/** Sökvägarna i `$app/manifest` är relativa appens rot (startsidan är `''`), inte den här filen */
const pathname = (path: string) => new URL(path, self.registration.scope).pathname;
/**
 * Förcachade svar matchas oavsett `Vary`. Annars missar modulskript, som skickas med
 * `Origin`, svaren som cachades utan den, och appen startar inte offline.
 */
const MATCH: CacheQueryOptions = { ignoreVary: true };
const IMMUTABLE = new Set(immutable.map((f) => pathname(f.path)));
const PRECACHE = [
	...new Set([...immutable, ...assets, ...prerendered].map((f) => pathname(f.path)))
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);
			await cache.addAll(PRECACHE);
			// Den nya versionen tar över direkt. Sidan som redan är öppen har all sin kod laddad.
			await self.skipWaiting();
		})()
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			for (const key of await caches.keys()) {
				if (key !== CACHE) await caches.delete(key);
			}
			await self.clients.claim();
		})()
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;
	// SvelteKits versionskoll ska alltid gå till nätet, annars märks ingen ny deploy
	if (url.pathname.endsWith('/_app/version.json')) return;

	event.respondWith(IMMUTABLE.has(url.pathname) ? cacheFirst(request) : networkFirst(event));
});

async function cacheFirst(request: Request): Promise<Response> {
	const cache = await caches.open(CACHE);
	return (await cache.match(request, MATCH)) ?? fetchAndStore(cache, request);
}

async function networkFirst(event: FetchEvent): Promise<Response> {
	const { request } = event;
	const cache = await caches.open(CACHE);
	const network = fetchAndStore(cache, request);
	// Svaret från nätet sparas även om cachen hann svara först
	event.waitUntil(network.catch(() => {}));
	// `?plats=…` och liknande pekar på samma förrenderade sida
	const cached = () =>
		cache.match(request, { ...MATCH, ignoreSearch: request.mode === 'navigate' });

	try {
		const timeout = new Promise<never>((_, reject) =>
			setTimeout(() => reject(new Error('timeout')), NETWORK_TIMEOUT_MS)
		);
		return await Promise.race([network, timeout]);
	} catch {
		// Nätet är långsamt eller borta: svara från cachen om det går, annars vänta på nätet
		return (await cached()) ?? network;
	}
}

async function fetchAndStore(cache: Cache, request: Request): Promise<Response> {
	const response = await fetch(request);
	if (response.ok && response.type === 'basic') {
		// Spara en kopia utan sökparametrar för sidnavigeringar, så att den hittas offline
		const key = request.mode === 'navigate' ? new URL(request.url).pathname : request;
		await cache.put(key, response.clone());
	}
	return response;
}
