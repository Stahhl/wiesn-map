import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { ContentFiles } from '../src/lib/content/validate.ts';

export const CONTENT_DIR = join(import.meta.dirname, '..', 'content');

/** Läser alla JSON- och SVG-filer under `content/`, nycklade på sökväg relativt mappen. */
export function readContentFiles(root = CONTENT_DIR): ContentFiles {
	return Object.fromEntries(
		readdirSync(root, { recursive: true, withFileTypes: true })
			.filter((d) => d.isFile() && /\.(json|svg)$/.test(d.name))
			.map((d) => {
				const path = join(d.parentPath, d.name);
				return [relative(root, path).split('\\').join('/'), readFileSync(path, 'utf8')];
			})
	);
}
