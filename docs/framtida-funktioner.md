# Framtida funktioner

Idéer som ännu inte är beslutade eller planerade. Varje punkt beskriver bakgrund, förslag och avgränsningar, så att den går att ta upp utan att hela resonemanget behöver göras om. Större steg i arkitekturen (CMS, native-appar, flera språk, äldre år) står i [teknisk-profil.md §12](teknisk-profil.md#12-senare-steg-ingår-inte-i-v1).

| #   | Idé                                                                      | Område             | Storlek                                  | Status                |
| --- | ------------------------------------------------------------------------ | ------------------ | ---------------------------------------- | --------------------- |
| 1   | [`pnpm content:links`: kontroll av externa länkar](#1-pnpm-contentlinks) | Innehåll, kvalitet | Liten (ca 100 rader, inga nya beroenden) | Föreslagen 2026-10-03 |
| 2   | [Tältbilder hos oss och offline](#2-tältbilder-hos-oss-och-offline)      | Innehåll, offline  | Liten till mellan                        | Föreslagen 2026-10-04 |

---

## 1. `pnpm content:links`

Ett skript som går igenom alla länkar i `places.json` och kontrollerar att de fortfarande fungerar.

### Bakgrund

Länkarna i `places.json` pekar på tältens egna sajter och andra externa sidor, och de ändras utan förvarning. Inventeringen 2026 ([research/lankar-2026.md](research/lankar-2026.md)) visade att många meny-pdf:er har årtal eller hash i adressen (`…Speisekarte_26.pdf`, `…/uploads/2026/09/…`, Shopify- och Webflow-CDN:er). De slutar troligen fungera när menyerna för 2027 publiceras. Utan kontroll märks det först när en besökare trycker på en trasig länk.

### Förslag

`scripts/check-links.ts` läser alla adresser via samma innehållsladdare som `content:check` och hämtar dem med Node `fetch`, några i taget, med tidsgräns och följda omdirigeringar. Varje länk hamnar i en av följande kategorier:

| Resultat                     | Exempel                                                                     | Hantering                        |
| ---------------------------- | --------------------------------------------------------------------------- | -------------------------------- |
| **Trasig**                   | 404, 410, 5xx, domänen finns inte, ogiltigt certifikat                      | Fel (exit-kod 1)                 |
| **Flyttad**                  | Omdirigering till en annan adress eller domän                               | Varning med förslag på ny adress |
| **Går inte att kontrollera** | 403 eller 429 från bot-skydd (2026: Poschners, Rischart och Zur Bratwurst)  | Noteras, men räknas inte som fel |
| **Misstänkt**                | Gammalt årtal i adressen (`2025` i 2026 års data), html där en pdf väntades | Varning                          |

Instagram, Facebook och TikTok blockerar automatiska anrop, så de hoppas över.

Utdata blir en avvikelserapport i samma stil som `content:check`:

```
✗ s5 menu: 404 https://www.ables-goldener-hahn.de/wp-content/uploads/02_GH_A4_Speisekarte_26.pdf
→ s19 booking: flyttad till https://fisch-baeda.de/reservierung/
? s4 booking: 403 (bot-skydd), kontrollera för hand
✓ 142 länkar ok
```

### Hur det körs

- **Inte en del av `content:check`.** Det kommandot körs i `prebuild` och vid varje PR och ska ge samma resultat varje gång. Externa sajter ligger nere ibland, och då skulle bygget fallera av skäl vi inte kan påverka.
- **För hand**, t.ex. inför varje säsong när nya menyer publiceras och efter Wiesn.
- **Eventuellt schemalagt** i GitHub Actions (`schedule`), t.ex. en gång i veckan och tätare under säsongen. Jobbet öppnar eller uppdaterar ett issue med rapporten när något har gått sönder.

### Avgränsningar

- Skriptet kontrollerar bara att länkar går att nå, inte att innehållet stämmer. En pdf som finns kvar men visar fjolårets meny räknas som ok.
- Det upptäcker inte kapade eller hackade sajter, som Hacker-Festzelts sajt 2026. Sådant kräver en manuell genomgång, men rapporten visar var den ska börja.

### Öppna frågor

- Schemalagt jobb eller bara manuellt? I så fall, hur ofta?
- Ska resultatet bli ett issue på GitHub eller räcker det med en logg i Actions?
- Ska "misstänkt" (gammalt årtal i adressen) räknas som fel inför en ny upplaga?

---

## 2. Tältbilder hos oss och offline

Tältbilderna läggs hos oss i stället för att länkas från oktoberfest.de.

### Bakgrund

Sedan 2026-10-04 har varje tält en visningsbild i detaljarket ([research/bilder-2026.md](research/bilder-2026.md)). Bilderna länkas direkt från oktoberfest.de, och det har tre nackdelar:

- **Offline:** service workern hanterar bara egna adresser, så bilderna syns inte inne i tälten när nätet är borta. Då döljs de.
- **Länkar som går sönder:** oktoberfest.de kan byta adress eller bild när som helst, t.ex. inför nästa år.
- **Upphovsrätt:** vi länkar utan licens. Fotografen och källan visas, men bilderna är inte våra.

### Förslag

1. **Rättigheter först:** be München Tourismus eller fotograferna om tillstånd, eller byt till bilder med fri licens, t.ex. från Wikimedia Commons eller egna foton från Wiesn.
2. **Lagring:** bilderna läggs i `content/editions/<år>/images/<id>.jpg`, och `image.src` blir en relativ sökväg. `content:check` kontrollerar att filen finns.
3. **Storlekar:** Vercel Image Optimization (`/_vercel/image?url=…&w=…`) ger `srcset` i några bredder.
4. **Offline:** service workern cachar bilderna i en egen cache när de har visats en gång (stale-while-revalidate). Cachen överlever nya deployer. Att förcacha alla bilder vid installation tar för mycket på ett överbelastat nät.

### Avgränsningar

- Gäller visningsbilden i detaljarket. Flera bilder per tält (karusell) och bilder i resultatbandet är separata idéer.

### Öppna frågor

- Går det att få tillstånd för bilderna från oktoberfest.de, eller är egna eller fritt licensierade bilder enklare?
- Ska bilderna cachas bara när de har visats, eller ska de förcachas när användaren är på wifi?
