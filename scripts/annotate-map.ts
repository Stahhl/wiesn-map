/**
 * `pnpm map:annotate <ritning.svg> [upplaga]` – sätter kartkontraktets data-attribut
 * utifrån id:na i en ritad karta (docs/teknisk-profil.md §5.2) och skriver resultatet
 * till content/editions/<upplaga>/map.svg. Upplagan är som standard den aktuella.
 *
 * Skriptet tar hand om attributen. viewBox, `<style>` och sådant som ritverktyget lagt
 * till behöver fortfarande ses över för hand. Kör `pnpm content:check` efteråt.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as v from 'valibot';
import { annotateMap } from '../src/lib/content/annotate.ts';
import { PlacesSchema, SiteSchema } from '../src/lib/content/schema.ts';
import { CONTENT_DIR } from './content-files.ts';

const [source, editionArg] = process.argv.slice(2);
if (!source) {
	console.error('Användning: pnpm map:annotate <ritning.svg> [upplaga]');
	process.exit(1);
}

const readJson = (path: string): unknown => JSON.parse(readFileSync(path, 'utf8'));
const edition =
	editionArg ?? v.parse(SiteSchema, readJson(join(CONTENT_DIR, 'site.json'))).currentEdition;
const dir = join(CONTENT_DIR, 'editions', edition);
const places = v.parse(PlacesSchema, readJson(join(dir, 'places.json')));

const { svg, report } = annotateMap(readFileSync(source, 'utf8'), places);
const target = join(dir, 'map.svg');
writeFileSync(target, svg);

console.log(`✓ skrev content/editions/${edition}/map.svg`);
if (report.length) {
	console.log(`\n${report.length} saker att se över:\n${report.map((r) => `  • ${r}`).join('\n')}`);
}
console.log('\nKör `pnpm content:check` för att validera kartan mot datan.');
