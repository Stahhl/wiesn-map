/** Alla UI-strängar samlade, så att fler språk blir billiga att lägga till (§13). */
export const sv = {
	appName: 'Wiesn-kartan',
	description: 'Karta över Oktoberfest på Theresienwiese – tält, filter och service.',
	mapLabel: 'Karta över festområdet',

	// Header
	layers: 'Lager',
	layersBadge: (n: number) => `${n} extra lager tända`,
	segmentsLabel: 'Visa',
	all: 'Alla',
	filter: 'Filter',
	clear: 'Rensa',

	// Karta
	hintTouch: 'Nyp för att zooma · tryck på ett tält',
	hintMouse: 'Scrolla för att zooma · klicka på ett tält',
	north: 'Norr är uppåt',
	zoomIn: 'Zooma in',
	zoomOut: 'Zooma ut',
	fitAll: 'Visa hela kartan',

	// Resultat
	results: 'Träffar',
	/** Substantivet när alla kategorier visas: "5 tält med bar" */
	allNoun: 'tält',
	none: 'Inga',
	and: ' och ',
	or: ' eller ',
	with: 'med',
	tapForInfo: 'Tryck för info',
	noResultsHint: 'Prova att byta till Alla eller ta bort ett filter.',

	// Detaljark
	close: 'Stäng',
	showMore: 'Visa mer',
	showLess: 'Visa mindre',
	number: 'nr',
	area: 'Område',
	brewery: 'Bryggeri',
	seats: 'Platser',
	seatsValue: (n: number) => `ca ${n.toLocaleString('sv-SE')}`,
	hours: 'Öppettider',
	hoursValue: (h: { weekday: string; weekend: string }) =>
		`Vardagar ${h.weekday} · Helg ${h.weekend}`,
	allergens: 'Allergener',
	allergenInfo: {
		menu: 'Märkta i menyn',
		qr: 'Via QR-kod i tältet',
		staff: 'Fråga personalen'
	},
	linksTitle: 'Länkar',
	links: {
		oktoberfest: { label: 'oktoberfest.de', mono: 'O' },
		website: { label: 'Webbplats', mono: 'W' },
		booking: { label: 'Boka bord', mono: 'B' },
		menu: { label: 'Meny', mono: 'M' },
		allergens: { label: 'Allergener', mono: 'A' },
		floorplan: { label: 'Planritning', mono: 'P' },
		instagram: { label: 'Instagram', mono: 'IG' },
		facebook: { label: 'Facebook', mono: 'f' },
		tiktok: { label: 'TikTok', mono: 'TT' },
		youtube: { label: 'YouTube', mono: 'YT' }
	},

	// Lagerark
	layersTitle: 'Kartlager',
	layersSubtitle: 'Teckenförklaring och vad som visas',
	legendTitle: 'Tält',
	showOnMap: 'Visa på kartan',
	done: 'Klar',

	// Uppdatering (§8)
	updateAvailable: 'Ny information finns',
	update: 'Uppdatera'
} as const;
