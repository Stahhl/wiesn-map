/**
 * Den enda platsen som vet att innehållet är filer i git. Vid ett byte till CMS eller
 * databas är det bara den här modulen som ändras.
 *
 * Filerna läses in vid build. Är innehållet ogiltigt kastas ett fel och bygget avbryts.
 */
import {
	formatIssues,
	validateContent,
	type Content,
	type ContentFiles
} from '#lib/content/validate.ts';
import type { EditionBundle } from '#lib/content/schema.ts';

const raw = import.meta.glob<string>('/content/**/*.{json,svg}', {
	eager: true,
	query: '?raw',
	import: 'default'
});

let cached: Content | undefined;

function load(): Content {
	if (cached) return cached;
	const files: ContentFiles = Object.fromEntries(
		Object.entries(raw).map(([path, text]) => [path.replace(/^\/content\//, ''), text])
	);
	const result = validateContent(files);
	if (!result.ok) {
		throw new Error(`Innehållet i content/ är ogiltigt:\n\n${formatIssues(result.issues)}\n`);
	}
	cached = result.content;
	return cached;
}

export function listEditions(): string[] {
	return Object.keys(load().editions);
}

export function loadEdition(id: string): EditionBundle | undefined {
	return load().editions[id];
}

export function loadCurrent(): EditionBundle {
	const content = load();
	return content.editions[content.site.currentEdition];
}
