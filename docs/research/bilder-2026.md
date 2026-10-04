# Bilder på tälten, Wiesn 2026 – underlag

Insamlat 2026-10-04. Varje tält har en visningsbild utifrån, helst fasaden, så att man känner igen tältet när man står framför det. Bilden visas överst i detaljarket. `places.json` gäller före tabellen här.

## Så gick det till

1. **Kandidater:** för varje tält hämtades sidan på oktoberfest.de (`links.oktoberfest`). Alla bilder på sidan samlades in, både huvudbilden överst och bilderna i galleriet, med alt-text, bildtext och fotograf.
2. **Granskning:** kandidaterna sattes ihop till kontaktark per tält och granskades visuellt, 254 bilder totalt.
3. **Kontroll:** de valda bilderna granskades en gång till, beskurna ungefär som i arket (cirka 2,7:1, något ovanför mitten). Fasaden syns och folkmassan hamnar mest utanför.

## Regel för valet

- Ta sidans **huvudbild** om den visar tältet utifrån (fasad eller entré).
- Annars tas den **första utomhusbilden i galleriet**.
- Finns ingen, eller är det osäkert vilket tält bilden visar, får tältet **ingen bild**. Det är samma försiktiga linje som för taggarna i [dryck-2026.md](dryck-2026.md).

## Utfall

- **Alla 39 tält har en bild.** 38 är sidans huvudbild, de flesta från en serie som RAW, Moritz Röder fotograferade på Wiesn 2025.
- **Museumszelt:** huvudbilden visar en dans inne i Festzelt Tradition. I stället används galleribilden "Das Museumszelt auf der Oidn Wiesn" med tältets skylt.
- **Wirtshaus im Schichtl:** sidans `og:image` är ett porträtt av Manfred Schauer, men huvudbilden överst visar fasaden. Huvudbilden används.

## Länkning och upphovsrätt

- **Länkas, laddas inte ner.** `src` pekar direkt på oktoberfest.de. Det är ok att en länk går sönder i den här tidiga versionen. Då döljs bilden och arket ser ut som utan bild.
- **Storlek:** Drupal-stilen `3_2_w813` (3:2, 813 px bred), ungefär 60–95 kB per bild. Det räcker för arkets bredd på skärmar med dubbel pixeltäthet. Andra bredder finns med samma sökväg (`3_2_w320` … `3_2_w1216`).
- **Upphovsrätt:** bilderna tillhör fotograferna och Landeshauptstadt München. Vi har ingen licens och länkar till bilderna där de redan ligger publicerade. Fotografen och källan visas på bilden, t.ex. "Foto: RAW, Moritz Röder / oktoberfest.de". Ska bilderna ligga hos oss (§12 i teknisk-profil.md) behövs tillstånd eller bilder med fri licens. Wikimedia Commons har bra bilder på de stora tälten men nästan inga på de små.
- **Integritet:** `<img>` skickas med `referrerpolicy="no-referrer"`. oktoberfest.de ser då användarens IP-adress men inte vilken sida bilden visas på.
- **Offline:** service workern hanterar bara egna adresser, så bilderna syns inte utan nät. Då döljs de.

## Bilder per tält

Sökväg under `https://www.oktoberfest.de/sites/default/files/styles/3_2_w813/public/`.

| Tält                             | Bild                                                         | Var       | Fotograf          |
| -------------------------------- | ------------------------------------------------------------ | --------- | ----------------- |
| Marstall Festzelt                | `2025-09/mr_b3a2255.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Armbrustschützen-Festzelt        | `2025-09/mr_b3a2243.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Hofbräu-Festzelt                 | `2025-09/mr_b3a2222.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Hacker-Festzelt                  | `2025-09/mr_b3a2201.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Festhalle Schottenhamel          | `2025-09/mr_b3a2132.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Paulaner Festzelt                | `2025-09/mr_b3a2147.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Schützen-Festzelt                | `2025-09/mr_b3a4973.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Käfer Wiesn-Schänke              | `2025-09/mr_b3a2366.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Kufflers Weinzelt                | `2025-09/mr_b3a2351.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Löwenbräu-Festzelt               | `2025-09/mr_b3a2165.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Pschorr Bräurosl                 | `2025-09/mr_b3a2128.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Augustiner-Festhalle             | `2025-09/mr_b3a2188.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Ochsenbraterei                   | `2025-09/mr_b3a2227.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Fischer-Vroni                    | `2025-09/mr_b3a2248.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Museumszelt                      | `2025-09/mr_b3a4997.jpg`                                     | galleri   | RAW, Moritz Röder |
| Festzelt Tradition               | `2025-09/mr_b3a4975.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Schützenlisl                     | `2026-09/mr_b3a2193.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Boandlkramerei                   | `2025-09/mr_b3a4991.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Feisingers Kas- und Weinstubn    | `2023-08/feisinger_kas_weinstubn_sebastian_lehner-07452.jpg` | huvudbild | Sebastian Lehner  |
| Glöckle Wirt                     | `2025-09/mr_b3a2144.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Heinz Wurst- und Hühnerbraterei  | `2025-09/mr_b3a2135.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Hühnerbraterei Poschner          | `2025-09/mr_b3a2174.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Goldener Hahn                    | `2025-09/mr_b3a2210.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Hochreiters Haxenbraterei        | `2025-09/mr_b3a2207.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Schiebl’s Kaffeehaferl           | `2023-08/kaffeehaferl_schiebl_sebastian_lehner-07845.jpg`    | huvudbild | Sebastian Lehner  |
| Vinzenzmurr Metzger Stubn        | `2025-09/mr_b3a2228.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Bartls Flösserstadl              | `2026-09/mr_b3a2457.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Kalbsbraterei                    | `2025-09/mr_b3a2171.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Ammer Hühner- und Entenbraterei  | `2025-09/mr_b3a2216.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Bodo’s Cafézelt & Cocktailbar    | `2026-09/mr_b3a2243.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Münchner Knödelei                | `2025-09/mr_b3a5010.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Rischart’s Café Kaiserschmarrn   | `2025-09/mr_b3a2357.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Café Theres                      | `2025-09/mr_b3a2340.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Heimer Enten- und Hühnerbraterei | `2025-09/mr_b3a2330.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Wildstuben                       | `2025-10/mr_b3a0240.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Hochreiter’s Zur Bratwurst       | `2025-10/mr_b3a0244.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Fisch-Bäda                       | `2025-10/mr_b3a0233.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Wirtshaus im Schichtl            | `2025-09/mr_b3a2317.jpg`                                     | huvudbild | RAW, Moritz Röder |
| Wiesn Guglhupf Café-Dreh-Bar     | `2025-09/mr_b3a2307.jpg`                                     | huvudbild | RAW, Moritz Röder |
