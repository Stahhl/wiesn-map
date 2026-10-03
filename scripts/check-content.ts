/**
 * `pnpm content:check` – validerar content/ och skriver ut en avvikelserapport.
 * Samma validering körs av bygget. Det här är det snabba sättet att köra den lokalt.
 */
import { formatIssues, validateContent } from '../src/lib/content/validate.ts';
import { readContentFiles } from './content-files.ts';

const result = validateContent(readContentFiles());

if (!result.ok) {
	console.error(`✗ content/ har ${result.issues.length} avvikelser:\n`);
	console.error(formatIssues(result.issues));
	process.exit(1);
}

const { site, editions } = result.content;
for (const [id, { places, map }] of Object.entries(editions)) {
	const current = id === site.currentEdition ? ' (aktuell)' : '';
	console.log(
		`✓ ${id}${current}: ${places.length} ställen, karta ${(map.length / 1024).toFixed(1)} kB`
	);
}
