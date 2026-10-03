# Länkar per tält, Wiesn 2026 – underlag för granskning

Insamlat 2026-10-03, under pågående Wiesn. Det här är en sammanfattning av [`lankar-2026.json`](lankar-2026.json), som är underlaget. Länkarna lades in i `places.json` 2026-10-03 med besluten nedan, så `places.json` gäller före listorna här.

## Så gick det till

1. **oktoberfest.de (engelska):** jag gick igenom översiktssidorna för stora tält, små tält och Oide Wiesn och tog med varje tälts undersida. Från undersidorna hämtade jag tältets webbplats och bokningslänk. Oktoberfests egna Facebook- och Instagramkonton, som står på alla undersidor, sorterade jag bort.
2. **Tältens egna sajter:** Playwright läste in startsidan och följde länkar som såg ut att gå till meny, allergener eller plan. Meny-pdf:erna lästes som text för att se om de innehåller allergenkoder.
3. **Manuell genomgång:** jag valde den mest användbara länken per fält, i första hand på engelska och i andra hand en stabil html-sida framför en pdf med årtal i namnet. Bilder märkta "Lageplan" kontrollerades visuellt. Alla som hittades hos de små tälten är kartor över Wiesn och inte planritningar av tältet, så de är inte med.
4. **Kontroll:** alla 161 länkar som inte går till sociala medier hämtades. 158 svarade med 200. De tre som inte gjorde det är bokningsportaler som spärrar automatiska anrop (403). Länkar till sociala medier är inte kontrollerade, eftersom Instagram och Facebook spärrar sådana anrop.

**Allergener:** _eget_ = separat dokument eller avsnitt. _i menyn_ = menyn har allergenkoder. _QR på plats_ = bara via QR-kod i tältet. _fråga personal_ = menyn hänvisar till personalen. _–_ = inget hittat.

## Översikt

⚠ = något behöver granskas för hand (se respektive tält). Alla adresser står under [Per tält](#per-tält).

| Tält                              | oktoberfest.de |  Webb  | Bokning |  Meny  |   Allergener   | Planritning |   IG   |   FB   | TikTok |  YT   |
| --------------------------------- | :------------: | :----: | :-----: | :----: | :------------: | :---------: | :----: | :----: | :----: | :---: |
| Marstall Festzelt                 |       ✓        |   ✓    |    ✓    |  html  |    i menyn     |      –      |   ✓    |   ✓    |   –    |   –   |
| Armbrustschützen-Festzelt ⚠       |       ✓        |   ✓    |    ✓    |  html  |    i menyn     |    html     |   –    |   ✓    |   –    |   –   |
| Hofbräu-Festzelt                  |       ✓        |   ✓    |    ✓    |  html  |      eget      |    html     |   ✓    |   ✓    |   –    |   –   |
| Hacker-Festzelt ⚠                 |       ✓        |   ✓    |    ✓    |   –    |       –        |    html     |   ✓    |   ✓    |   –    |   –   |
| Festhalle Schottenhamel ⚠         |       ✓        |   ✓    |    ✓    |  html  |    i menyn     |    bild     |   –    |   –    |   –    |   –   |
| Paulaner Festzelt ⚠               |       ✓        |   ✓    |    ✓    |  html  |    i menyn     |      –      |   ✓    |   ✓    |   –    |   –   |
| Schützen-Festzelt                 |       ✓        |   ✓    |    ✓    |  html  |    i menyn     |      –      |   ✓    |   ✓    |   –    |   –   |
| Käfer Wiesn-Schänke ⚠             |       ✓        |   ✓    |    ✓    |  pdf   |  QR på plats   |      –      |   –    |   –    |   –    |   –   |
| Kufflers Weinzelt                 |       ✓        |   ✓    |    ✓    |  html  |      eget      |      –      |   ✓    |   ✓    |   –    |   ✓   |
| Löwenbräu-Festzelt ⚠              |       ✓        |   ✓    |    ✓    |  html  |    i menyn     |      –      |   –    |   –    |   –    |   –   |
| Pschorr Bräurosl ⚠                |       ✓        |   ✓    |    ✓    |  html  |    i menyn     |    html     |   ✓    |   –    |   –    |   –   |
| Augustiner-Festhalle ⚠            |       ✓        |   ✓    |    ✓    |  html  |    i menyn     |      –      |   –    |   –    |   –    |   –   |
| Ochsenbraterei                    |       ✓        |   ✓    |    ✓    |  html  |      eget      |      –      |   ✓    |   ✓    |   ✓    |   –   |
| Fischer-Vroni                     |       ✓        |   ✓    |    ✓    |  html  |      eget      |    html     |   ✓    |   ✓    |   –    |   –   |
| Museumszelt ⚠                     |       ✓        |   ✓    |    –    |  pdf   |       –        |      –      |   –    |   –    |   –    |   –   |
| Festzelt Tradition                |       ✓        |   ✓    |    ✓    |  html  |    i menyn     |      –      |   ✓    |   ✓    |   –    |   –   |
| Schützenlisl                      |       ✓        |   ✓    |    ✓    |  html  |    i menyn     |      –      |   ✓    |   ✓    |   –    |   –   |
| Boandlkramerei                    |       ✓        |   ✓    |    ✓    |  html  |    i menyn     |      –      |   ✓    |   ✓    |   –    |   –   |
| Feisingers Kas- und Weinstubn ⚠   |       ✓        |   ✓    |    ✓    |  html  |       –        |      –      |   ✓    |   ✓    |   –    |   –   |
| Glöckle Wirt ⚠                    |       ✓        |   ✓    |    ✓    |  html  |       –        |      –      |   –    |   ✓    |   –    |   –   |
| Heinz Wurst- und Hühnerbraterei ⚠ |       ✓        |   ✓    |    ✓    |  html  |       –        |      –      |   –    |   –    |   –    |   –   |
| Hühnerbraterei Poschner ⚠         |       ✓        |   ✓    |    ✓    |  pdf   |    i menyn     |      –      |   ✓    |   ✓    |   ✓    |   –   |
| Goldener Hahn                     |       ✓        |   ✓    |    ✓    |  pdf   |    i menyn     |      –      |   ✓    |   ✓    |   –    |   ✓   |
| Hochreiters Haxenbraterei         |       ✓        |   ✓    |    ✓    |  pdf   |    i menyn     |      –      |   ✓    |   –    |   –    |   –   |
| Schiebl’s Kaffeehaferl ⚠          |       ✓        |   ✓    |    –    |   –    |       –        |      –      |   –    |   –    |   –    |   –   |
| Vinzenzmurr Metzger Stubn ⚠       |       ✓        |   ✓    |    –    |   –    |       –        |      –      |   –    |   –    |   –    |   –   |
| Bartls Festzelt ⚠                 |       ✓        |   ✓    |    ✓    |  html  |  QR på plats   |      –      |   ✓    |   –    |   –    |   –   |
| Kalbsbraterei ⚠                   |       ✓        |   ✓    |    ✓    |   –    |       –        |      –      |   ✓    |   ✓    |   –    |   –   |
| Ammer Hühner- und Entenbraterei   |       ✓        |   ✓    |    ✓    |  html  | fråga personal |      –      |   ✓    |   ✓    |   –    |   ✓   |
| Bodo’s Cafézelt & Cocktailbar     |       ✓        |   ✓    |    ✓    |  pdf   |    i menyn     |      –      |   ✓    |   –    |   –    |   –   |
| Münchner Knödelei                 |       ✓        |   ✓    |    ✓    |  pdf   |    i menyn     |      –      |   ✓    |   –    |   –    |   –   |
| Rischart’s Café Kaiserschmarrn ⚠  |       ✓        |   ✓    |    ✓    |   –    |       –        |      –      |   –    |   –    |   –    |   –   |
| Café Theres ⚠                     |       ✓        |   ✓    |    ✓    |   –    |       –        |      –      |   –    |   –    |   –    |   –   |
| Heimer Enten- und Hühnerbraterei  |       ✓        |   ✓    |    ✓    |  html  |      eget      |      –      |   ✓    |   ✓    |   –    |   –   |
| Wildstuben                        |       ✓        |   ✓    |    ✓    |  html  |    i menyn     |      –      |   ✓    |   ✓    |   –    |   –   |
| Hochreiter’s Zur Bratwurst ⚠      |       ✓        |   ✓    |    ✓    |  html  |       –        |      –      |   ✓    |   ✓    |   –    |   –   |
| Fisch-Bäda ⚠                      |       ✓        |   ✓    |    ✓    |  html  |       –        |      –      |   ✓    |   ✓    |   –    |   –   |
| Wirtshaus im Schichtl ⚠           |       ✓        |   ✓    |    ✓    |   –    |       –        |      –      |   –    |   –    |   –    |   –   |
| Wiesn Guglhupf Café-Dreh-Bar ⚠    |       ✓        |   ✓    |    ✓    |  html  |       –        |      –      |   ✓    |   ✓    |   –    |   –   |
| **Antal (av 39)**                 |     **39**     | **39** | **36**  | **32** |     **25**     |    **6**    | **26** | **23** | **2**  | **3** |

## Beslut (2026-10-03)

- **Hacker-Festzelt:** startsidan har injicerad spamtext om nätkasinon, så sajten verkar hackad. Vi länkar inte till hacker-festzelt.de alls (webbplats, bokning och planritning är borttagna). Länkarna till oktoberfest.de, Instagram och Facebook finns kvar.
- **Konton för företaget i stället för tältet:** tas inte med. Det gäller Käfer (Feinkost Käfer), Vinzenzmurr, Rischart och Museumszelt (Krems Festzelte), och även Kufflers YouTube (KufflerTV tillhör Kuffler-gruppen).
- **Allergener utan egen länk:** visas som faktarad via `allergenInfo`: "Märkta i menyn" (`menu`), "Via QR-kod i tältet" (`qr`) eller "Fråga personalen" (`staff`).
- **Paulaner:** `zutatenliste.pdf` redovisar bara varifrån råvarorna kommer, inte allergener. Den är inte med, och Paulaner har i stället `allergenInfo: "menu"`.
- **Bartls:** heter nu "Bartls Flösserstadl" i `places.json`.
- **Museumszelt:** finns inte på engelska på oktoberfest.de. Länken går till den engelska Oide Wiesn-sidan.
- **Öppet:** många meny-pdf:er har årtal eller hash i adressen (Käfer, Poschners, Goldener Hahn med flera). Ett skript, `pnpm content:links`, som hittar trasiga länkar är inte byggt än.

## Per tält

### Marstall Festzelt `marstall`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/marstall-festzelt
- **Webb:** https://www.marstall-oktoberfest.de/english.html
- **Bokning:** https://www.marstall-oktoberfest.de/reservation.html
- **Meny:** https://www.marstall-oktoberfest.de/English_Menu.html
- **IG:** https://www.instagram.com/marstallfestzelt/
- **FB:** https://www.facebook.com/marstallfestzelt/
- **Allergener:** i menyn
- _Saknas:_ Planritning, TikTok, YT
- oktoberfest.de länkar inte till tältets egen sajt, bara till banden. Hittad via sökning.
- FAQ: allergener märks i menyn och en detaljerad lista finns på begäran.

### Armbrustschützen-Festzelt `armbrust`

- **oktoberfest.de:** https://www.oktoberfest.de/en/tents/big-tents/armbrustschuetzenzelt
- **Webb:** https://www.armbrustschuetzenzelt.de/en/
- **Bokning:** https://www.armbrustschuetzenzelt.de/en/reservationinquiry/
- **Meny:** https://www.armbrustschuetzenzelt.de/en/menu/
- **Planritning:** https://www.armbrustschuetzenzelt.de/festzelt/zeltplan/
- **FB:** https://www.facebook.com/Armbrustschuetzenzelt/
- **Allergener:** i menyn
- _Saknas:_ IG, TikTok, YT
- Menysidan visar menyn som bild och länkar en engelsk pdf (Speisekarte-2026-englisch.pdf) med allergenkoder.
- Zeltplan-sidan har Tischplan 2026 som bild.
- ⚠ Inget Instagramkonto länkat från sajten.

### Hofbräu-Festzelt `hofbraeu`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/hofbraeu-festzelt
- **Webb:** https://www.hb-festzelt.de/en.html
- **Bokning:** https://www.hb-festzelt.de/en/reservations.html
- **Meny:** https://www.hb-festzelt.de/en/menu.html
- **Allergener:** https://www.hb-festzelt.de/fileadmin/speisekarten-international/Allergene2026.pdf (eget)
- **Planritning:** https://www.hb-festzelt.de/en/hofbraeu-festzelt/seating-plan.html
- **IG:** https://www.instagram.com/hofbraeufestzelt/
- **FB:** https://www.facebook.com/HB.Festzelt
- _Saknas:_ TikTok, YT
- Allergenlistan har årtal i filnamnet (Allergene2026.pdf).
- Planritningen på sidan heter Hallenplan2024.jpg.

### Hacker-Festzelt `hacker`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/hacker-festzelt
- **Webb:** https://hacker-festzelt.de/
- **Bokning:** https://hacker-festzelt.de/reservierung/
- **Planritning:** https://hacker-festzelt.de/sitzplan/
- **IG:** https://www.instagram.com/hackerfestzelt/
- **FB:** https://www.facebook.com/hackerfestzelt
- _Saknas:_ Meny, Allergener, TikTok, YT
- Bokningssidan länkar vidare till portalen reservierung.derhimmelderbayern.de.
- ⚠ Startsidan på hacker-festzelt.de innehåller injicerad spamtext om nätkasinon (Neosurf, Zodiac casino). Sajten verkar hackad. Bokningssidan ser ren ut. Bedöm om vi ska länka alls.
- ⚠ Den engelska sajten eng.hacker-festzelt.de, som oktoberfest.de länkar till, har ogiltigt certifikat.
- ⚠ Ingen meny hittad på sajten.
- ⚠ Planritningen är hallenplan-2016 men tältet är ombyggt. Planen är sannolikt inaktuell.

### Festhalle Schottenhamel `schottenhamel`

- **oktoberfest.de:** https://www.oktoberfest.de/en/tents/big-tents/festhalle-schottenhamel
- **Webb:** https://festhalle-schottenhamel.de/
- **Bokning:** https://festhalle-schottenhamel.de/en/reservation/
- **Meny:** https://festhalle-schottenhamel.de/en/menu-en/
- **Planritning:** https://festhalle-schottenhamel.de/wp-content/uploads/2026/09/Hallenplan_2026.jpg
- **Allergener:** i menyn
- _Saknas:_ IG, FB, TikTok, YT
- Menysidan länkar pdf på engelska, spanska och italienska. Den tyska pdf:en har allergen- och tillsatskoder.
- Planritningen ligger som bild på sidan /ueber-uns/lageplan/.
- ⚠ Inga sociala medier länkade från sajten.

### Paulaner Festzelt `paulaner`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/paulaner-festzelt
- **Webb:** https://www.paulanerfestzelt.de/oktoberfest-festival-tent/
- **Bokning:** https://www.paulanerfestzelt.de/oktoberfestzelt/reservierung/
- **Meny:** https://www.paulanerfestzelt.de/oktoberfestzelt/speisekarte/
- **Allergener:** https://www.paulanerfestzelt.de/oktoberfestzelt-wAssets/docs/zutatenliste.pdf (i menyn)
- **IG:** https://www.instagram.com/paulanerfestzelt/
- **FB:** https://www.facebook.com/paulanerfestzelt
- _Saknas:_ Planritning, TikTok, YT
- Menysidan har allergen- och tillsatsförklaring direkt på sidan, och pdf-menyer på tyska, engelska och italienska.
- Separat ingredienslista (zutatenliste.pdf). Innehållet är inte kontrollerat.
- ⚠ Kontrollera att zutatenliste.pdf faktiskt redovisar allergener.

### Schützen-Festzelt `schuetzen`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/schuetzen-festzelt
- **Webb:** https://schuetzen-festzelt.de/en/
- **Bokning:** https://schuetzen-festzelt.de/en/reservations.html
- **Meny:** https://schuetzen-festzelt.de/en/menu.html
- **IG:** https://www.instagram.com/schuetzenfestzelt/
- **FB:** https://www.facebook.com/Schuetzenzelt/
- **Allergener:** i menyn
- _Saknas:_ Planritning, TikTok, YT
- Den tyska pdf:en (Schutzenfestzelt_Wiesnkarte_2026.pdf) har "Allergene Nachweis". Den engelska pdf:en innehåller 2025 i texten.

### Käfer Wiesn-Schänke `kaefer`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/kaefer-wiesn-schaenke
- **Webb:** https://www.feinkost-kaefer.de/pages/wiesn-schaenke
- **Bokning:** https://www.feinkost-kaefer.de/pages/schaenke-reservierung
- **Meny:** https://cdn.shopify.com/s/files/1/0774/6817/2627/files/Speise-und-Getraenkekarte-final-20-08-26.pdf?v=1787218998
- **Allergener:** QR på plats
- _Saknas:_ Planritning, IG, FB, TikTok, YT
- Menyn är en pdf på Shopifys CDN med versionsparameter. Den byts troligen ut nästa år.
- Menyn säger att allergener och tillsatser visas via en QR-kod. Målet syns inte på webben.
- ⚠ Sociala medier på sajten tillhör Feinkost Käfer (hela företaget), inte tältet. Ta med eller inte?
- ⚠ Allergeninformation finns bara via QR-kod på plats.

### Kufflers Weinzelt `kufflers`

- **oktoberfest.de:** https://www.oktoberfest.de/en/bierzelte/grosse-zelte/kufflers-weinzelt
- **Webb:** https://www.weinzelt.com/en/
- **Bokning:** https://reservierung.weinzelt.com/reservation
- **Meny:** https://www.weinzelt.com/de/speisenkarte.php
- **Allergener:** https://www.weinzelt.com/de/allergene-und-zusatz.php (eget)
- **IG:** https://www.instagram.com/kufflers_weinzelt/
- **FB:** https://www.facebook.com/KufflersWeinzelt
- **YT:** https://www.youtube.com/user/KufflerTV
- _Saknas:_ Planritning, TikTok
- Den engelska menysidan (/en/menu.php) har bilder från 2023, så jag valde den tyska.
- YouTube-kanalen tillhör Kuffler-gruppen.

### Löwenbräu-Festzelt `loewenbraeu`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/loewenbraeu-festzelt
- **Webb:** https://www.loewenbraeuzelt.de/
- **Bokning:** https://www.loewenbraeuzelt.de/reservierungen/
- **Meny:** https://www.loewenbraeuzelt.de/speisekarte/
- **Allergener:** i menyn
- _Saknas:_ Planritning, IG, FB, TikTok, YT
- Menysidan länkar en tysk pdf och en på engelska, franska och italienska. Båda har allergenkoder.
- ⚠ Inga sociala medier länkade från sajten.

### Pschorr Bräurosl `pschorr`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/pschorr-braeurosl
- **Webb:** https://www.braeurosl.de/
- **Bokning:** https://www.braeurosl.de/reservieren/zum-reservierungsportal
- **Meny:** https://www.braeurosl.de/menu-en
- **Planritning:** https://www.braeurosl.de/wiesn-zelt/infos-zeltplan
- **IG:** https://www.instagram.com/braeurosl_festzelt/
- **Allergener:** i menyn
- _Saknas:_ FB, TikTok, YT
- Den tyska menysidan och Braeurosl_Speisekarte_2026.pdf har allergen- och tillsatskoder.
- ⚠ Inget Facebookkonto länkat från sajten.

### Augustiner-Festhalle `augustiner`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/augustiner-festhalle
- **Webb:** https://www.festhalle-augustiner.com/
- **Bokning:** https://www.festhalle-augustiner.com/reservierung/
- **Meny:** https://www.festhalle-augustiner.com/speisekarte/
- **Allergener:** i menyn
- _Saknas:_ Planritning, IG, FB, TikTok, YT
- Menyn finns bara på tyska. Pdf:en har allergenförklaring (A=Eier …).
- ⚠ Inga sociala medier länkade från sajten.

### Ochsenbraterei `ochsenbraterei`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/ochsenbraterei
- **Webb:** https://www.ochsenbraterei.de/en/
- **Bokning:** https://www.ochsenbraterei.de/en/reservation/
- **Meny:** https://www.ochsenbraterei.de/en/food-drink/
- **Allergener:** https://www.ochsenbraterei.de/wp-content/uploads/2026/08/2026-allergene-ochsenbraterei.pdf (eget)
- **IG:** https://www.instagram.com/ochsenbraterei/
- **FB:** https://www.facebook.com/ochsenbraterei
- **TikTok:** https://www.tiktok.com/@ochsenbraterei
- _Saknas:_ Planritning, YT
- Allergen-pdf:en har årtal i både sökväg och filnamn.

### Fischer-Vroni `fischer-vroni`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/fischer-vroni
- **Webb:** https://www.fischer-vroni.de/
- **Bokning:** https://www.fischer-vroni.de/en/oktoberfest/reservierung/
- **Meny:** https://www.fischer-vroni.de/en/oktoberfest/speisen/
- **Allergener:** https://www.fischer-vroni.de/en/allergens/ (eget)
- **Planritning:** https://www.fischer-vroni.de/en/oktoberfest/sitzplan/
- **IG:** https://www.instagram.com/fischer_vroni_festzelt/
- **FB:** https://www.facebook.com/fischervroni/
- _Saknas:_ TikTok, YT
- oktoberfest.de länkar till /willkommen.html. Jag valde startsidan i stället.

### Museumszelt `museumszelt`

- **oktoberfest.de:** https://www.oktoberfest.de/en/the-oide-wiesn
- **Webb:** https://museumszelt-oide-wiesn.de/museumszelt-oide-wiesn/
- **Meny:** https://museumszelt-oide-wiesn.de/wp-content/uploads/2026/09/SPEISEKARTE_OIDE_WIESN_2026_Entwurf4_10-09_2026.pdf
- _Saknas:_ Bokning, Allergener, Planritning, IG, FB, TikTok, YT
- Domänen museumszelt-oide-wiesn.de är restaurangoperatörens (Krems Festzelte) sajt. Museumszelt har en undersida där.
- Det finns även ett cafékort: CafeKarte_Museumszelt2026_…pdf.
- ⚠ Ingen engelsk undersida på oktoberfest.de. Valt: den engelska Oide Wiesn-sidan, som beskriver tältet. Alternativ: den tyska utställarsidan /ausstellersuche/museumszelt.
- ⚠ Menyns filnamn innehåller "Entwurf4" (utkast 4) men är den som är länkad.
- ⚠ Ingen bokning för Museumszelt. Bokningsportalen pekar på ett annat evenemang (Geretsrieder Waldsommer).
- ⚠ Sociala medier tillhör Krems Festzelte, inte tältet. Ta med eller inte?

### Festzelt Tradition `tradition`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/festzelt-tradition
- **Webb:** https://www.oktoberfestzelt-tradition.de/
- **Bokning:** https://www.oktoberfestzelt-tradition.de/festzelt-tradition-reservieren.html
- **Meny:** https://www.oktoberfestzelt-tradition.de/festzelt-tradition-speisekarte.html
- **IG:** https://www.instagram.com/festzelttradition/
- **FB:** https://www.facebook.com/FestzeltTradition/
- **Allergener:** i menyn
- _Saknas:_ Planritning, TikTok, YT
- oktoberfest.de länkar med http. Jag valde https.
- "Menus 2026 (english)" är fasta menyer för bokade bord, inte à la carte.

### Schützenlisl `schuetzenlisl`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/big-tents/schuetzenlisl
- **Webb:** https://www.schuetzenlisl.de/
- **Bokning:** https://www.schuetzenlisl.de/en/reservation/
- **Meny:** https://www.schuetzenlisl.de/en/food-and-drinks/
- **IG:** https://www.instagram.com/schuetzenlisl_volkssaengerzelt/
- **FB:** https://www.facebook.com/profile.php?id=61560747823001
- **Allergener:** i menyn
- _Saknas:_ Planritning, TikTok, YT
- Den engelska pdf:en har allergen- och tillsatskoder men innehåller äldre årtal (2020–2025).

### Boandlkramerei `boandlkramerei`

- **oktoberfest.de:** https://www.oktoberfest.de/en/tents/tents-oide-wiesn/boandlkramerei-oktoberfest-reservation-atmosphere-history
- **Webb:** https://boandlkramerei.bayern/
- **Bokning:** https://boandlkramerei.bayern/en/reservation-oktoberfest/
- **Meny:** https://boandlkramerei.bayern/speisekarte-oktoberfest-muenchen/
- **IG:** https://www.instagram.com/boandlkramerei_oide_wiesn/
- **FB:** https://www.facebook.com/Boandlkramerei.Oktoberfest/
- **Allergener:** i menyn
- _Saknas:_ Planritning, TikTok, YT
- Den engelska menysidans adress innehåller 2025 (/en/menu-oktoberfest-2025-munich/), så jag valde den tyska sidan, som har 2026-pdf:er.

### Feisingers Kas- und Weinstubn `s1`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/feisingers-kas-und-weinstubn
- **Webb:** https://wiesnzelt.de/
- **Bokning:** https://wiesnzelt.de/wiesn-resevierung-2026/
- **Meny:** https://wiesnzelt.de/speisen-und-getraenke/speisekarte/
- **IG:** https://www.instagram.com/feisingers_kas_und_weinstubn/
- **FB:** https://www.facebook.com/Kas.und.Weinstubn
- _Saknas:_ Allergener, Planritning, TikTok, YT
- Menyn är en bild (Speisekarte-Wiesn.jpg).
- ⚠ Bokningslänken har årtal i adressen och felstavat "resevierung". Den slutar troligen fungera 2027.
- ⚠ Ingen allergeninformation hittad.

### Glöckle Wirt `s2`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/gloeckle-wirt
- **Webb:** https://www.gloeckle-wirt.de/
- **Bokning:** https://www.gloeckle-wirt.de/platzreservierung-oktoberfest-gloeckle-wirt
- **Meny:** https://www.gloeckle-wirt.de/essen-trinken-gloeckle-wirt-oktoberfest
- **FB:** https://www.facebook.com/gloecklewirt
- _Saknas:_ Allergener, Planritning, IG, TikTok, YT
- Bokningslänken på oktoberfest.de är trasig (reservierung.html&nbsp;). Jag valde sajtens egen.
- ⚠ Ingen allergeninformation hittad. Menysidan saknar text, så innehållet behöver kollas för hand.

### Heinz Wurst- und Hühnerbraterei `s3`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/heinz-wurst-und-huehnerbraterei
- **Webb:** https://www.heinz-huehnerbraterei.de/en/oktoberfest/
- **Bokning:** https://www.heinz-huehnerbraterei.de/en/oktoberfest/reservation/
- **Meny:** https://www.heinz-huehnerbraterei.de/oktoberfest/speisekarte/
- _Saknas:_ Allergener, Planritning, IG, FB, TikTok, YT
- Den engelska menylänken omdirigerar till den tyska sidan, där menyn är en inbäddad pdf (Speisekarte-2026-…).
- ⚠ Allergener inte kontrollerade (pdf i inbäddad visare).
- ⚠ Inga sociala medier länkade.

### Hühnerbraterei Poschner `s4`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/poschners-huehner-und-entenbraterei
- **Webb:** https://www.poschners.de/
- **Bokning:** https://reservierung.poschners.de/
- **Meny:** https://cdn.prod.website-files.com/683ef169f9aa900f022bd3f1/6aa11e655c8da6d813a99dde_Speisekarte_Poschners_26_20.pdf
- **IG:** https://www.instagram.com/poschner_oktoberfest/
- **FB:** https://www.facebook.com/Poschners/
- **TikTok:** https://www.tiktok.com/@poschners.oktoberfest
- **Allergener:** i menyn
- _Saknas:_ Planritning, YT
- Menyn är en pdf på Webflows CDN med hash i namnet. Den byts troligen ut nästa år.
- ⚠ Bokningsportalen svarar 403 på automatiska anrop. Kontrollera i webbläsare.

### Goldener Hahn `s5`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/goldener-hahn
- **Webb:** https://www.ables-goldener-hahn.de/
- **Bokning:** https://www.ables-goldener-hahn.de/reservierung/
- **Meny:** https://www.ables-goldener-hahn.de/wp-content/uploads/02_GH_A4_Speisekarte_26.pdf
- **IG:** https://www.instagram.com/ablesgoldenerhahn/
- **FB:** https://www.facebook.com/pages/Ables-Goldener-Hahn/823723004341402
- **YT:** https://www.youtube.com/channel/UCGSXbnguiN5DmOC5q-bIW-w
- **Allergener:** i menyn
- _Saknas:_ Planritning, TikTok
- Ingen menysida, bara en pdf med årtal (…_26.pdf).

### Hochreiters Haxenbraterei `s6`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/hochreiters-haxnbraterei
- **Webb:** https://haxnbraterei.de/
- **Bokning:** https://haxnbraterei.de/#reservierung
- **Meny:** https://haxnbraterei.de/wp-content/uploads/2026/08/Haxnbraterei-Hochreiter_Speisekarte2026.pdf
- **IG:** https://www.instagram.com/haxnbraterei/
- **Allergener:** i menyn
- _Saknas:_ Planritning, FB, TikTok, YT
- haxenbraterei.com (från oktoberfest.de) omdirigerar till haxnbraterei.de.
- Bokning är en sektion på startsidan.

### Schiebl’s Kaffeehaferl `s7`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/schiebls-kaffeehaferl
- **Webb:** https://schiebls-cafebetriebe.de/
- _Saknas:_ Bokning, Meny, Allergener, Planritning, IG, FB, TikTok, YT
- ⚠ Sajten är företagets allmänna sida med nästan inget innehåll om Wiesn: ingen meny, bokning eller sociala medier.

### Vinzenzmurr Metzger Stubn `s8`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/metzgerstubn
- **Webb:** https://vinzenzmurr.de/metzger-stubn/
- _Saknas:_ Bokning, Meny, Allergener, Planritning, IG, FB, TikTok, YT
- ⚠ Sajten tillhör slakterikedjan Vinzenzmurr. Ingen Wiesn-meny hittad (/wochenkarte/ är butikernas veckomeny).
- ⚠ Sociala medier (Facebook, Instagram, YouTube) tillhör kedjan, inte tältet. Ta med eller inte?
- ⚠ Ingen bokning hittad.

### Bartls Festzelt `s9`

- **oktoberfest.de:** https://www.oktoberfest.de/en/tents/small-tents/small-tents/all-information-about-bartls-flosserstadl
- **Webb:** https://www.floesserstadl.de/
- **Bokning:** https://www.floesserstadl.de/reservierung
- **Meny:** https://www.floesserstadl.de/speisen-getraenke
- **IG:** https://www.instagram.com/floesserstadl_festzelt/
- **Allergener:** QR på plats
- _Saknas:_ Planritning, FB, TikTok, YT
- Nytt tält 2026. Officiellt namn: "Bartls Flösserstadl".
- Menyn (pdf) hänvisar till en allergenmeny via QR-kod.
- ⚠ Namnet i places.json är "Bartls Festzelt". Byta till "Bartls Flösserstadl"?

### Kalbsbraterei `s10`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/kalbsbraterei
- **Webb:** https://kalbsbraterei.de/
- **Bokning:** https://kalbsbraterei.de/reservierung/
- **IG:** https://www.instagram.com/kalbsbraterei/
- **FB:** https://www.facebook.com/kalbsbraterei/
- _Saknas:_ Meny, Allergener, Planritning, TikTok, YT
- ⚠ Ingen meny på sajten, bara en text om dagens rätter.

### Ammer Hühner- und Entenbraterei `s11`

- **oktoberfest.de:** https://www.oktoberfest.de/en/bierzelte/kleine-zelte/ammer-huehner-und-entenbraterei
- **Webb:** https://ammer-wiesn.de/
- **Bokning:** https://ammer-wiesn.de/reservierung/
- **Meny:** https://ammer-wiesn.de/en/menu/
- **IG:** https://www.instagram.com/ammerwiesnzelt/
- **FB:** https://www.facebook.com/ammerwiesn/
- **YT:** https://www.youtube.com/channel/UCBR1FRC2VXrYys1aUKsnWyQ
- **Allergener:** fråga personal
- _Saknas:_ Planritning, TikTok
- Menyn hänvisar till personalen ("AMMER-Engel") för frågor om allergener.

### Bodo’s Cafézelt & Cocktailbar `s12`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/bodos-cafezelt
- **Webb:** https://www.bodos.de/
- **Bokning:** https://www.bodos.de/#reservierung
- **Meny:** https://www.bodos.de/wp-content/uploads/Speisekarte_Bodos_2026.pdf
- **IG:** https://www.instagram.com/bodoscafezelt/
- **Allergener:** i menyn
- _Saknas:_ Planritning, FB, TikTok, YT
- Bokning sker individuellt via en sektion på startsidan.

### Münchner Knödelei `s13`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/muenchner-knoedelei
- **Webb:** https://muenchner-knoedelei.de/
- **Bokning:** https://muenchner-knoedelei.de/#online-reservierung
- **Meny:** https://muenchner-knoedelei.de/wp-content/uploads/2026/09/menu-knoedelei-oktoberfest-2026-en.pdf
- **IG:** https://www.instagram.com/muenchner_knoedelei/
- **Allergener:** i menyn
- _Saknas:_ Planritning, FB, TikTok, YT
- Engelsk pdf med allergenkoder. Tysk och italiensk pdf finns också.

### Rischart’s Café Kaiserschmarrn `s14`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/cafe-kaiserschmarrn
- **Webb:** https://www.rischart.de/oktoberfest/rischart-s-cafe-kaiserschmarrn/
- **Bokning:** https://kaiserschmarrn.rischart.de/reservierung
- _Saknas:_ Meny, Allergener, Planritning, IG, FB, TikTok, YT
- ⚠ Ingen meny för tältet hittad. Menyn och sidan "Für Allergiker" gäller Rischarts kaféer.
- ⚠ Bokningsportalen kaiserschmarrn.rischart.de blockerar automatiska besök (Cloudflare, 403). Kontrollera i webbläsare.
- ⚠ Sociala medier tillhör Rischart (bageri och kafé), inte tältet. Ta med eller inte?

### Café Theres `s15`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/cafe-theres
- **Webb:** https://cafe-theres.de/en/
- **Bokning:** https://cafe-theres.de/en/reservieren/
- _Saknas:_ Meny, Allergener, Planritning, IG, FB, TikTok, YT
- ⚠ Startsidan nämner "Menu" men har ingen länk till någon meny.
- ⚠ Inga sociala medier länkade.

### Heimer Enten- und Hühnerbraterei `s16`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/heimer-enten-und-huehnerbraterei
- **Webb:** https://www.heimer-entenbraterei.de/en
- **Bokning:** https://www.heimer-entenbraterei.de/en/reservierung
- **Meny:** https://www.heimer-entenbraterei.de/en/speisekarte
- **Allergener:** https://www.heimer-entenbraterei.de/en/speisekarte#menu-en-hinweise (eget)
- **IG:** https://www.instagram.com/heimer.oktoberfest/
- **FB:** https://www.facebook.com/heimer.entenbraterei
- _Saknas:_ Planritning, TikTok, YT
- Allergenerna ligger i ett eget avsnitt på menysidan (länk med ankare).

### Wildstuben `s17`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/wildstuben
- **Webb:** https://wildstuben.de/
- **Bokning:** https://wildstuben.de/reservierung/
- **Meny:** https://wildstuben.de/speisekarte/
- **IG:** https://www.instagram.com/wildstuben/
- **FB:** https://www.facebook.com/Wildstuben-101361934570835
- **Allergener:** i menyn
- _Saknas:_ Planritning, TikTok, YT
- Menysidan länkar en tysk och en engelsk pdf (Food and Beverages). Båda har allergenkoder.

### Hochreiter’s Zur Bratwurst `s18`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/zur-bratwurst
- **Webb:** https://zur-bratwurst.de/
- **Bokning:** https://reservierung.zur-bratwurst.de/reservierung
- **Meny:** https://zur-bratwurst.de/speisen_getraenke
- **IG:** https://www.instagram.com/hochreiterszurbratwurst/
- **FB:** https://www.facebook.com/zurbratwurst/
- _Saknas:_ Allergener, Planritning, TikTok, YT
- ⚠ Ingen allergeninformation hittad på menysidan.
- ⚠ Bokningsportalen svarar 403 på automatiska anrop. Kontrollera i webbläsare.

### Fisch-Bäda `s19`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/fisch-baeda
- **Webb:** https://fisch-baeda.de/
- **Bokning:** https://fisch-baeda.de/reservierung/
- **Meny:** https://fisch-baeda.de/speisekarte/
- **IG:** https://www.instagram.com/fischbaedawiesnstadl/
- **FB:** https://www.facebook.com/fischbaeda/
- _Saknas:_ Allergener, Planritning, TikTok, YT
- ⚠ Ingen allergeninformation hittad på menysidan.

### Wirtshaus im Schichtl `s20`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/wirtshaus-im-schichtl
- **Webb:** https://www.schichtl.de/wirtshaus/
- **Bokning:** https://www.schichtl.de/wirtshaus/#reservierung
- _Saknas:_ Meny, Allergener, Planritning, IG, FB, TikTok, YT
- Bokningsportalen för 2026 är stängd. Bokning sker på plats.
- ⚠ Ingen meny och inga sociala medier hittade.

### Wiesn Guglhupf Café-Dreh-Bar `s21`

- **oktoberfest.de:** https://www.oktoberfest.de/en/beer-tents/small-tents/wiesn-guglhupf
- **Webb:** https://www.wiesn-guglhupf.de/
- **Bokning:** https://www.wiesn-guglhupf.de/reservierung
- **Meny:** https://www.wiesn-guglhupf.de/speisekarte
- **IG:** https://www.instagram.com/wiesn_guglhupf/
- **FB:** https://www.facebook.com/wiesnguglhupf/
- _Saknas:_ Allergener, Planritning, TikTok, YT
- Menyn visas som bilder.
- ⚠ Ingen allergeninformation hittad.
