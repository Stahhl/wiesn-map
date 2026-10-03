import { json } from '@sveltejs/kit';
import { SCHEMA_VERSION } from '#lib/content/schema.ts';
import { listEditions, loadCurrent } from '#lib/server/content.ts';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const { edition } = loadCurrent();
	return json({
		schemaVersion: SCHEMA_VERSION,
		currentEdition: edition.id,
		editions: listEditions().map((id) => ({ id, href: `/api/v1/editions/${id}.json` }))
	});
};
