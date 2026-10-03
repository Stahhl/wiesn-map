# Teknisk profil – Wiesn-kartan

**Status:** v1-förslag, godkänt 2026-10-03
**Omfattning:** v1 = webbapp i webbläsaren (mobil + desktop)
**Källa för design:** Claude Design-projektet *Wiesn Karta* (`Wiesn Karta.dc.html`, `assets/wiesn-map.svg`)

---

## 0. Bakgrund och ramar

Prototypen är en interaktiv karta över Theresienwiese. Den innehåller:

- karta med pan, zoom, nyp, dubbeltryck och mushjul, kompass och zoomknappar (+ / − / anpassa)
- segment **Alla / Stora / Små** med antal per segment
- filterchips **Vin på menyn** och **Bar**, med läge *Alla villkor* (OCH) eller *Något villkor* (ELLER)
- **resultatband** längst ned när ett filter är aktivt, med auto-fit av kartan till träffarna
- **detaljark** för valt tält: peek-läge och expanderat läge med taggar, info, länkar och foto
- **lagerark** med teckenförklaring och 9 kartlager som går att slå av och på, plus en badge på lagerknappen

`support.js` är designverktygets egen React-runtime och följer inte med till produktion. Logiken i prototypens `class Component` flyttas till Svelte.

**Beslut för v1:**

| Krav | Beslut |
|---|---|
| Plattform | Webbapp. Native-appar kan komma senare |
| Backend | Ingen databas, ingen admin, ingen inloggning, inget CMS. Data ligger som **JSON i git** |
| Drift | **Vercel** |
| Ramverk | **SvelteKit + pnpm** |
| Ändra data utan klientuppdatering | Ja, via git → build → statiskt API (se §1.2 och §8) |
| Ny karta per år | Ja, via utbytbar SVG med ett datakontrakt (se §5) |
| Mobil | Fyller skärmen och känns native |
| Desktop | Appen visas i en ram som liknar en telefon |

**Varför SvelteKit?** Paketen blir små och snabba på ett överbelastat festivalnät. Förrendering passar Vercel perfekt. Prototypens imperativa kartlogik går rakt att flytta till Svelte 5 runes, och servern och API:t finns redan i samma ramverk när ni senare vill ha en riktig backend.

---

## 1. Principer

1. **Datadriven UI.** Kategorier, filter, lager, färger, taggar, länktyper och kartinställningar kommer från innehållsfilerna, inte från koden. Ett nytt filter eller lager kräver därför ingen ny klientkod, vilket blir avgörande när det finns native-appar som inte kan uppdateras direkt.
2. **"Backend" = git + build + statiskt API.** En ändring i JSON blir en commit. Vercel bygger och klienterna får ny data vid nästa laddning, utan app-uppdatering. Samma data publiceras som ett versionerat API (`/api/v1/...`) som framtida klienter läser.
3. **Validera innehållet vid build.** Trasig data eller en karta som inte matchar datan får bygget att faila. Då når felet aldrig produktion, och senaste fungerande deploy ligger kvar.
4. **En utbytbar innehållskälla.** All läsning av innehåll går via `$lib/server/content.ts`. Vid ett byte till CMS eller databas är det bara den modulen som ändras.

---

## 2. Stack

| Område | Val |
|---|---|
| Ramverk | SvelteKit (senaste) + Svelte 5 (runes), TypeScript `strict`, Vite. Scaffold med `pnpm dlx sv create` |
| Pakethantering | pnpm, låst via `packageManager` i `package.json`. Node 24 LTS (`engines`) |
| Hosting | Vercel via `@sveltejs/adapter-vercel`. Allt förrenderas, så v1 behöver inga serverless-funktioner |
| Styling | Scoped Svelte-CSS + CSS custom properties. Tokens hämtas från prototypen (se nedan). Ingen Tailwind behövs för det här antalet komponenter |
| Schema/validering | Valibot, som är litet i bundlen. Schemat ger också TS-typerna |
| Karta | Inline-SVG i DOM + egen pan/zoom med Pointer Events, flyttad från prototypen som Svelte-action |
| PWA/offline | SvelteKits inbyggda `src/service-worker.ts` + `static/manifest.webmanifest` |
| SVG-hantering vid build | SVGO med försiktig konfig: `id` och `data-*` behålls, `<metadata>` och `<style>` tas bort |
| Test | Vitest (ren logik), Playwright (e2e: iPhone-, Pixel- och desktop-profil), `svelte-check` |
| Kodstil | ESLint + Prettier (`prettier-plugin-svelte`) |
| CI | GitHub Actions: `lint`, `check`, `test`, `content:check` på varje PR. Vercel Preview-deploy per PR |

**Designtokens** (från prototypen):

```css
:root {
  --paper: #fffef9;      /* appbakgrund, ark */
  --ground: #f1eee4;     /* bakgrund runt kartan */
  --page: #e7e4da;       /* sidbakgrund bakom desktop-ramen */
  --ink: #1f2321;        /* text, primärknapp */
  --muted: #6b706c;      /* sekundär text */
  --subtle: #8a8f8a;     /* rubriker i versaler, antal */
  --sand: #efece2;       /* segmentbakgrund, sekundära knappar */
  --sand-2: #f6f4ec;     /* kort i ark */
  --line: rgba(31, 35, 33, .1);
  --ok: #248b46;         /* toggle på, in-/utgångar */
  --ease: cubic-bezier(.2, .8, .2, 1);
  --radius-sheet: 24px;
}
```

Färger som hör till datan (kategorier, lager, taggar) hämtas från `edition.json` och sätts som inline CSS-variabler.

---

## 3. Arkitektur och dataflöde

```
content/  (JSON + SVG i git)
   │  import.meta.glob(..., { eager: true }) vid build
   ▼
$lib/server/content.ts ── validerar (Valibot) ── loadEdition(id) / loadCurrent()
   │                                         │
   ▼                                         ▼
routes/+page.server.ts  (prerender)    routes/api/v1/...  (+server.ts, prerender)
   HTML med data + optimerad SVG          /api/v1/current.json
   inline → karta vid första paint        /api/v1/editions/2026.json
                                          /api/v1/editions/2026/map.svg
```

- `/` visar aktuell upplaga enligt `content/site.json → currentEdition`. Äldre år kan senare nås via `/[edition]`.
- Kartan och datan bäddas in i den förrenderade HTML:en. Kartan syns alltså direkt utan spinner eller extra anrop.
- API:t används inte av webbappen i v1. Det finns för framtida klienter och för att låsa kontraktet tidigt.
- API-svaren innehåller `schemaVersion`. Klienter ska ignorera okända fält, lager och filter, så kontraktet är framåtkompatibelt.

---

## 4. Innehållsmodell

```
content/
  site.json                     { "currentEdition": "2026" }
  editions/
    2026/
      edition.json              metadata + konfiguration för UI och karta
      places.json               tält och ställen
      map.svg                   annoterad karta (kontrakt i §5)
      images/                   tältfoton (senare)
```

Varje år är en egen mapp. När ni startar ett nytt år kopierar ni förra årets mapp, byter `map.svg` och justerar datan.

### 4.1 `edition.json`

```json
{
  "schemaVersion": 1,
  "id": "2026",
  "title": "Wiesn 2026",
  "subtitle": "Theresienwiese · 19 sep – 4 okt",
  "dates": { "start": "2026-09-19", "end": "2026-10-04" },

  "map": {
    "file": "map.svg",
    "dimOpacity": 0.16,
    "maxZoom": 5,
    "autoFit": true
  },

  "categories": [
    { "id": "large", "label": "Stora tält", "short": "Stora", "color": "#c59b17", "shape": "square" },
    { "id": "small", "label": "Små tält",  "short": "Små",   "color": "#009bc3", "shape": "round" }
  ],

  "areas": [
    { "id": "wiesn", "label": "Wiesn" },
    { "id": "oide-wiesn", "label": "Oide Wiesn", "tag": { "bg": "#f6eb8d", "fg": "#5c5212" } }
  ],

  "filters": {
    "mode": "all",
    "items": [
      { "id": "wine", "label": "Vin på menyn", "tag": { "bg": "#f3e3e6", "fg": "#7d1d33" } },
      { "id": "bar",  "label": "Bar",          "tag": { "bg": "#f4ead0", "fg": "#6b5208" } }
    ]
  },

  "layers": [
    { "id": "rides",  "label": "Attraktioner",                      "swatch": "#d6093b",   "default": true,  "dimWhenFocused": true },
    { "id": "bars",   "label": "Ölbarer",                           "swatch": "#8d70a1",   "default": true,  "dimWhenFocused": true },
    { "id": "gates",  "label": "In-/utgångar",                      "symbol": "icon-gate", "default": true },
    { "id": "wc",     "label": "Toaletter",                         "symbol": "icon-wc",   "default": false },
    { "id": "water",  "label": "Dricksvatten",                      "symbol": "icon-water","default": false },
    { "id": "atm",    "label": "Bankomater",                        "symbol": "icon-atm",  "default": false },
    { "id": "safety", "label": "Första hjälpen, polis & safe space", "symbol": "icon-aid",  "default": false },
    { "id": "info",   "label": "Information & bagage",             "symbol": "icon-info", "default": false },
    { "id": "mgmt",   "label": "Festledning",                       "swatch": "#ce087a",   "default": true }
  ]
}
```

- `filters.mode`: `"all"` (OCH) eller `"any"` (ELLER), alltså prototypens `filterMode`.
- `dimWhenFocused`: lagret tonas ned när ett filter är aktivt eller ett tält är valt, som prototypen gör för `rides` och `bars`.
- Badgen på lagerknappen visar antalet tända lager med `default: false`.
- Teckenförklaringen i lagerarket ("Stora tält", "Små tält", "Oide Wiesn") byggs från `categories` och `areas`.

### 4.2 `places.json`

```json
[
  {
    "id": "hofbraeu",
    "name": "Hofbräu-Festzelt",
    "category": "large",
    "area": "wiesn",
    "number": null,
    "brewery": "Hofbräu",
    "seats": 10000,
    "features": ["bar"],
    "hours": { "weekday": "10–23", "weekend": "9–23" },
    "links": {
      "menu": null,
      "website": null,
      "instagram": null,
      "facebook": null,
      "booking": null
    },
    "image": null,
    "description": null
  }
]
```

- `id` är stabilt mellan år när samma tält återkommer, så att delade länkar fortsätter fungera.
- `features` refererar till `filters.items[].id`. Taggarna i detaljarket byggs av `features`, plus `area`-taggen om den har en `tag`.
- `number` används för små tält ("Litet tält · nr 7").
- Fält som saknas eller är `null` döljs i UI:t. Prototypens platshållare (öppettider, länkar, foto) visas alltså inte förrän det finns riktig data.
- Startdata: prototypens 39 tält (18 stora och 21 små) flyttas från `TENTS` i `Wiesn Karta.dc.html`.

### 4.3 Schema

`src/lib/content/schema.ts` definierar `Edition`, `Place`, `Category`, `Layer` och övriga typer med Valibot. Samma schema används på tre ställen:

1. `scripts/check-content.ts` (CLI, CI, `prebuild`)
2. `$lib/server/content.ts` (vid build)
3. Senare i native-klienter, eftersom modulen saknar beroenden till SvelteKit och kan brytas ut till ett eget paket

---

## 5. Kartkontrakt (SVG ↔ data)

Kontraktet gör att kartan kan bytas varje år utan kodändring. Den nuvarande `assets/wiesn-map.svg` följer det redan, förutom att `data-tent` byter namn till `data-place`.

| Element | Krav |
|---|---|
| Rot | `<svg id="wiesn-map" viewBox="…">`. Bildförhållandet läses från `viewBox`, inget är hårdkodat (prototypen har 630×1050) |
| Klickbar form | `data-place="<places[].id>"` på formen (`rect`, `polygon`, `path` …) |
| Nål | Formen har också `data-pin` om den är en cirkel som ska växa när den väljs (små tält) |
| Etikett | `data-place="<id>" data-label`. Den följer formens dimning men går inte att klicka på |
| Lager | `data-layer="<layers[].id>"` på en grupp eller ett element |
| Tjänstemarkör | `<g data-layer="wc" data-kind="accessible_wc"><title>…</title><use href="#icon-…"/></g>` |
| Ikoner | `<symbol id="icon-*">` i SVG:n. Lagerarket återanvänder dem via `<use href="#icon-…">` |
| Dekor | Former utan data, t.ex. det onumrerade lilla tältet, markeras `data-decorative` |
| Förbjudet | `<script>`, `on*`-attribut, `<foreignObject>`, externa `href` och `url(...)` |

Dagens tjänstemarkörer fördelar sig på lagren så här (från `wiesn-map.svg`):

| Lager | `data-kind` |
|---|---|
| `wc` | `wc`, `accessible_wc`, `universal_wc` |
| `water` | `water` |
| `atm` | `atm` |
| `safety` | `aid`, `police`, `safe` |
| `info` | `info`, `luggage`, `luggage_rental`, `parking` |

### 5.1 `pnpm content:check`

Kommandot körs lokalt, i CI och som `prebuild`. Det kontrollerar:

1. att `edition.json`, `places.json` och `site.json` följer schemat
2. att varje place har minst en form i SVG:n och att varje `data-place` finns i `places.json`, där `data-decorative` undantas
3. att varje `data-layer` i SVG:n finns i `layers`, och att varje lager används i SVG:n
4. att varje `symbol` i `layers` och varje `<use href="#…">` refererar till en befintlig `<symbol>`
5. att `features`, `category` och `area` i places refererar till definierade id:n
6. att SVG:n inte innehåller något förbjudet element (tabellen ovan)

Utdata är en avvikelserapport som går att läsa, t.ex. *"place `kaefer` saknar form i map.svg"*. Fel ger exit-kod 1.

### 5.2 Arbetsflöde för en ny årskarta

1. Rita eller exportera kartan som SVG (Figma, Illustrator, Inkscape, eller genererad som i år).
2. Sätt id enligt konventionen (`tent-<id>`, `small-tent-<nr>`, `service-*`, `gate-*`). Ett hjälpskript (`scripts/annotate-map.ts`) översätter id:n till `data-place` och `data-layer`.
3. Kör `pnpm content:check` och åtgärda avvikelserna.
4. Öppna en PR och granska kartan i Vercel Preview.

Originalet `docs/wiesn_2026_north_up.svg` sparas som källa. Den annoterade versionen ligger i `content/editions/2026/map.svg`.

---

## 6. Klientarkitektur

### 6.1 State

`src/lib/state/app.svelte.ts` innehåller en klass med runes:

| State | Typ | Prototyp |
|---|---|---|
| `category` | `'all' \| Category['id']` | `size` |
| `features` | `Set<string>` | `wine`, `bar` |
| `selected` | `string \| null` | `selected` |
| `expanded` | `boolean` | `expanded` |
| `layersOpen` | `boolean` | `layersOpen` |
| `layers` | `Record<string, boolean>` | `layers` |
| `hint` | `boolean` | `hint` |

Härledda värden (`$derived`):

- `matchIds`: ställen som passerar kategori och filter
- antal per segment
- resultatlistan (stora före små)
- resultattiteln ("5 tält med vin på menyn och bar")
- data till detaljarket

Logiken motsvarar prototypens `sizeOk()`, `passes()`, `matchIds()` och `renderVals()`, men som rena funktioner i `src/lib/state/filter.ts` så att den kan testas med Vitest.

### 6.2 URL och navigation

- Valt ställe speglas i URL:en med SvelteKits shallow routing (`pushState` → `?plats=hofbraeu`).
- Bakåtknappen på Android och i webbläsaren stänger arket, precis som i en native-app.
- Länkar till enskilda tält går att dela och öppnar kartan fokuserad på tältet.

### 6.3 Karta

- `MapView.svelte` renderar den inline-SVG som bäddats in vid build och kopplar på `use:panzoom`.
- `src/lib/map/transform.ts` innehåller rena funktioner flyttade från prototypen: `clamp`, `fitAll`, `fitTo`, `focusPlace`, `zoomAround`, med insets för header och ark (`topInset`, `SHEET_PEEK`, `RESULTS_H`). De testas med Vitest.
- `src/lib/map/panzoom.ts` (Svelte-action) hanterar Pointer Events:
  - en pekare panorerar
  - två pekare nyper
  - dubbeltryck zoomar ×2
  - mushjul zoomar runt pekaren
  - ett tryck under 6 px förflyttning räknas som ett tryck på kartan
- Ett tryck väljer formen under fingret, och annars närmsta ställe inom 22 px (prototypens `nearest()`).
- `src/lib/map/styling.ts` är en `$effect` som sätter `opacity`, `stroke`, `r` och `pointer-events` per element utifrån state (prototypens `applyMap()`).
- Animationer: `transform` med `--ease`. När en ny gest börjar fryses en pågående animation på sin aktuella position.

### 6.4 Komponenter (`src/lib/ui/`)

| Komponent | Ansvar |
|---|---|
| `AppShell` | Mobil helskärm eller desktop-ram (§7). Containern för allt annat |
| `Header` | Titel och undertitel, lagerknapp med badge |
| `SegmentedControl` | Alla / kategorier, med antal |
| `FilterChips` | Filter från `edition.filters`, plus "Rensa" |
| `MapControls` | Kompass, hint ("Nyp för att zooma · tryck på ett tält") och + / − / anpassa |
| `ResultsStrip` | Horisontellt band med träffar, eller "Inga träffar" med en Rensa-knapp |
| `BottomSheet` | Generiskt ark som går att dra, med snap-punkterna stängd, peek och expanderat |
| `PlaceSheet` | Detaljark för tält: taggar, knappar (Meny, Webbplats, Instagram), info och länkar |
| `LayersSheet` | Teckenförklaring och lagertoggles, med scrim bakom |

### 6.5 Tillgänglighet

- Resultatbandet, arken och lagerlistan är riktiga `<button>` och listor.
- Kartformerna får `role="button"`, `tabindex` och `aria-label` från `places`.
- Tangentbord: `+`, `−`, `0` (anpassa), piltangenter (panorera), `Esc` (stäng ark).
- `prefers-reduced-motion` stänger av transform- och arkanimationer.
- Kontrasten följer designens tokens. Text på färgade ytor kontrolleras mot WCAG AA.

---

## 7. Native-känsla på mobil, telefonram på desktop

### 7.1 Mobil (standardläge)

- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
- Appen fyller `100dvh`. Header och ark respekterar `env(safe-area-inset-top|bottom)` för notch och hemindikator.
- `overscroll-behavior: none`, och body skrollar inte. Bara innehållet i arken skrollar.
- `touch-action: none` på kartan och `touch-action: manipulation` på kontrollerna. iOS-gesten `gesturestart` stoppas, så att ett nyp zoomar kartan och aldrig sidan.
- Arken går att dra med Pointer Events och snappar efter hastighet, med ett handtag som också är en knapp.
- Tryckytor på minst 44 px och `-webkit-tap-highlight-color: transparent`. Inga hover-beroenden.
- Systemtypsnitt: `-apple-system, 'SF Pro Text', system-ui, Roboto, 'Helvetica Neue', Arial, sans-serif`.
- PWA: `manifest.webmanifest` med `display: standalone`, `theme_color` och `background_color` `#fffef9`, ikoner (192, 512, maskable) och `apple-touch-icon`. När appen läggs till på hemskärmen öppnas den utan webbläsarkrom.

### 7.2 Desktop

Desktop-läget aktiveras med `@media (min-width: 600px) and (hover: hover) and (pointer: fine)`:

- Sidbakgrunden är `--page` (`#e7e4da`). Appen centreras i en ram: `width: 410px; height: min(864px, 100dvh - 48px)`, `border: 10px solid #161817`, `border-radius: 56px` och prototypens skugga.
- Ingen fejkad statusrad (klocka, batteri, Dynamic Island). Ramen räcker för att det ska se ut som en app, och en fejkad statusrad kan läggas till i `AppShell` om ni vill ha den.
- Mushjul, dra med musen (`cursor: grab` / `grabbing`) och hover-stilar finns bara i det här läget.

### 7.3 Regel för båda lägena

Allt inne i appen positioneras `absolute` relativt `AppShell`, **aldrig `position: fixed`** mot viewporten. Samma komponenter fungerar då utan ändringar både i helskärm och i ram. Safe-area-variablerna blir 0 på desktop.

---

## 8. Offline och uppdateringar

- **Offline:** service workern förcachar app-skal, förrenderad sida, data och karta vid första besöket. Appen fungerar sedan helt utan täckning, vilket är vanligt inne i tälten.
- **Ny deploy:**
  1. `kit.version.pollInterval` är satt till 5 minuter, och `updated.current` från `$app/state` blir `true` när det finns en ny version.
  2. Om inget ark är öppet laddar appen om tyst vid nästa `visibilitychange` eller navigering.
  3. Annars visas en diskret banner: *"Ny information finns – uppdatera"*.
- **Cache:** hashade assets (`/_app/immutable/*`) har `immutable`. HTML och API skickas med Vercels standard (`max-age=0, must-revalidate` + ETag). Klienterna kontrollerar alltså alltid billigt om något är nytt.

---

## 9. Kvalitet

### 9.1 Budget

| Mått | Mål |
|---|---|
| JavaScript för startsidan | ≤ ~60 kB gzip |
| Karta (SVG) | ≤ ~15 kB gzip efter SVGO |
| LCP på 4G (Moto G Power-profil) | < 1,5 s |
| Lighthouse mobil (Performance, A11y, Best Practices) | ≥ 95 |

### 9.2 Tester

**Vitest:**
- filterlogik: OCH/ELLER, antal per segment, resultatordning och resultattitel
- transformmatematik: clamp, fit, zoom runt en punkt, insets
- `content:check` mot riktiga fixtures och avsiktligt trasiga fixtures

**Playwright** (iPhone 15, Pixel 7, Desktop Chrome):
- ett tryck på ett tält öppnar arket och fokuserar kartan, och bakåtknappen stänger arket
- ett filter visar resultatbandet och kartan auto-fittar, "Rensa" återställer
- lagertoggle visar och döljer markörer, och badgen räknas rätt
- nyp (touch-emulering) och mushjul (desktop) zoomar inom gränserna
- layout: ramen syns på desktop, helskärm utan horisontell skroll på mobil
- offline: andra laddningen fungerar med nätet avstängt

### 9.3 CI

GitHub Actions på varje PR kör: `pnpm install --frozen-lockfile` → `lint` → `check` → `content:check` → `test` → `test:e2e`. Vercel bygger en Preview per PR och produktion vid merge till `main`.

---

## 10. Projektstruktur

```
wiesn-map/
├─ content/                          innehåll (§4)
│  ├─ site.json
│  └─ editions/2026/{edition.json, places.json, map.svg, images/}
├─ docs/
│  ├─ teknisk-profil.md              detta dokument
│  └─ wiesn_2026_north_up.svg        originalkarta (källa)
├─ scripts/
│  ├─ check-content.ts               validering (§5.1)
│  └─ annotate-map.ts                id-konvention → data-attribut (§5.2)
├─ src/
│  ├─ app.html
│  ├─ service-worker.ts
│  ├─ lib/
│  │  ├─ content/schema.ts           Valibot-schema + typer
│  │  ├─ server/content.ts           enda platsen som vet att innehållet är filer i git
│  │  ├─ map/                        transform.ts, panzoom.ts, styling.ts, MapView.svelte
│  │  ├─ state/                      app.svelte.ts, filter.ts
│  │  ├─ ui/                         komponenterna i §6.4
│  │  ├─ styles/tokens.css
│  │  └─ i18n/sv.ts                  alla UI-strängar samlade
│  └─ routes/
│     ├─ +layout.svelte, +layout.ts  (export const prerender = true)
│     ├─ +page.svelte, +page.server.ts
│     └─ api/v1/
│        ├─ current.json/+server.ts
│        └─ editions/[id].json/+server.ts, editions/[id]/map.svg/+server.ts
├─ static/                           manifest.webmanifest, ikoner
├─ tests/                            Playwright
├─ svelte.config.js, vite.config.ts, tsconfig.json
└─ package.json, pnpm-lock.yaml
```

Viktiga skript i `package.json`: `dev`, `build` (med `prebuild: content:check`), `preview`, `check`, `lint`, `format`, `test`, `test:e2e`, `content:check`.

---

## 11. Arbetsflöde för att ändra innehåll

1. Redigera `content/editions/<år>/*.json` (eller `map.svg`) i GitHub-webben eller lokalt.
2. Öppna en PR. CI kör `content:check` och tester.
3. Granska ändringen i Vercel Preview-länken.
4. Merga till `main`. Produktion är uppdaterad efter ungefär en minut.
5. Klienterna får den nya datan vid nästa öppning eller inom pollintervallet (§8). Ingen behöver uppdatera någon app.

---

## 12. Senare steg (ingår inte i v1)

| Område | Väg framåt |
|---|---|
| Admin/CMS | Ett git-baserat CMS (t.ex. Sveltia eller Decap) som redigerar samma JSON-filer, alternativt en databas plus egen `/admin`. Båda vägarna byter bara `$lib/server/content.ts`, och klienterna påverkas inte |
| Dynamiskt API | Förrenderade `/api/v1/*` ersätts av dynamiska endpoints på samma URL:er |
| Native-appar | Läser `/api/v1`. SVG:n renderas med `react-native-svg` eller i en WebView. Valibot-schemat bryts ut till ett delat paket (pnpm workspace) |
| Flera språk | Paraglide JS för UI-strängar. Etikettfält i datan blir `{ "sv": …, "de": …, "en": … }` |
| Äldre år | Route `/[edition]` |
| Bilder | Tältfoton via Vercel Image Optimization |
| Analys | Integritetsvänlig mätning (t.ex. Vercel Web Analytics), utan cookies |

---

## 13. Antaganden att bekräfta

- **Språk:** svenska i v1. Alla UI-strängar samlas i `src/lib/i18n/sv.ts`, så att fler språk blir billiga att lägga till.
- **Desktop-ramen:** ingen fejkad statusrad (klocka, batteri, Dynamic Island).
- **Kartan:** `data-tent` döps om till `data-place` när kartan importeras.
- **Prototypens designreglage** (`filterMode`, `autoFit`, `dimOpacity`) blir innehållsinställningar i `edition.json` och inte användarinställningar.

---

## Bilaga: från prototyp till modul

| Prototyp (`Wiesn Karta.dc.html`) | Modul |
|---|---|
| `TENTS`, `IDS` | `content/editions/2026/places.json` |
| `segDefs`, `chipDef`, `layerDefs`, taggfärger | `content/editions/2026/edition.json` |
| `assets/wiesn-map.svg` | `content/editions/2026/map.svg` |
| `sizeOk`, `passes`, `matchIds`, resultat och titel i `renderVals` | `src/lib/state/filter.ts` |
| `state` | `src/lib/state/app.svelte.ts` |
| `applyMap` | `src/lib/map/styling.ts` |
| `measure`, `clamp`, `setT`, `fitAll`, `fitTo`, `focusTent`, `zoomAround`, `cy0` | `src/lib/map/transform.ts` |
| `onDown`, `onMove`, `onUp`, `onWheel`, `handleTap`, `nearest` | `src/lib/map/panzoom.ts` |
| Header, segment, chips | `Header`, `SegmentedControl`, `FilterChips` |
| Zoomknappar, kompass, hint | `MapControls` |
| Resultatband | `ResultsStrip` |
| Detaljark (peek/expanderat) | `BottomSheet` + `PlaceSheet` |
| Lagerark + scrim | `BottomSheet` + `LayersSheet` |
| Telefonram (410×864, 56 px radie) | `AppShell` (desktop-läge) |
| `support.js` (dc-runtime) | Ersätts av SvelteKit och följer inte med |
