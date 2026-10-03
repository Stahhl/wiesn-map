import { error, json } from '@sveltejs/kit';
import { SCHEMA_VERSION } from '#lib/content/schema.ts';
import { listEditions, loadEdition } from '#lib/server/content.ts';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => listEditions().map((id) => ({ id }));

export const GET: RequestHandler = ({ params }) => {
	const bundle = loadEdition(params.id);
	if (!bundle) error(404, `Upplagan ${params.id} finns inte`);
	return json({
		schemaVersion: SCHEMA_VERSION,
		edition: bundle.edition,
		places: bundle.places,
		map: `/api/v1/editions/${params.id}/map.svg`
	});
};
