# Wiesn-kartan

Interaktiv karta över Oktoberfest på Theresienwiese. Webbapp i SvelteKit som förrenderas och
driftas på Vercel. Bakgrund, arkitektur och beslut finns i
[docs/teknisk-profil.md](docs/teknisk-profil.md).

## Kom igång

Kräver Node 24 och pnpm (versionen är låst i `package.json` → `packageManager`).

```sh
pnpm install
pnpm dev            # http://localhost:5173
```

| Kommando             | Gör                                                       |
| -------------------- | --------------------------------------------------------- |
| `pnpm content:check` | Validerar `content/` och skriver ut en avvikelserapport   |
| `pnpm build`         | Bygger och förrenderar. Avbryts om innehållet är ogiltigt |
| `pnpm preview`       | Kör det byggda resultatet lokalt                          |
| `pnpm check`         | Typkontroll (svelte-check)                                |
| `pnpm lint`          | Prettier + ESLint                                         |
| `pnpm format`        | Formaterar alla filer                                     |
| `pnpm test:unit`     | Vitest                                                    |
| `pnpm test:e2e`      | Playwright (iPhone, Pixel, desktop). Bygger först         |

Första gången du kör e2e-testerna: `pnpm exec playwright install chromium webkit`.

## Ändra innehåll

Allt innehåll ligger i `content/` och är JSON och SVG i git. Det finns ingen databas eller admin.

```
content/
  site.json                    vilken upplaga som är aktuell
  editions/2026/
    edition.json               titel, datum, kategorier, filter, kartlager, kartinställningar
    places.json                tält och ställen
    map.svg                    kartan (kontrakt i docs/teknisk-profil.md §5)
```

1. Redigera filerna, lokalt eller direkt i GitHub.
2. Kör `pnpm content:check` (CI gör det också på varje PR).
3. Granska ändringen i Vercels Preview-länk på PR:en.
4. Merga till `main`. Produktion uppdateras på ungefär en minut, och klienterna får den nya
   datan vid nästa öppning. Ingen app behöver uppdateras.

Fält som saknas eller är `null` i `places.json` (öppettider, länkar, foto …) döljs i appen.

## API

Samma innehåll publiceras som statiska filer för framtida klienter:

- `/api/v1/current.json` – aktuell upplaga och lista över upplagor
- `/api/v1/editions/2026.json` – upplagans data och ställen
- `/api/v1/editions/2026/map.svg` – optimerad karta

## Driftsättning

Koppla repot till ett Vercel-projekt. SvelteKit och `@sveltejs/adapter-vercel` känns igen
automatiskt. Varje PR får en Preview-deploy, och `main` går till produktion.
