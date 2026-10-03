import { error } from '@sveltejs/kit';
import { listEditions, loadEdition } from '#lib/server/content.ts';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => listEditions().map((id) => ({ id }));

export const GET: RequestHandler = ({ params }) => {
	const bundle = loadEdition(params.id);
	if (!bundle) error(404, `Upplagan ${params.id} finns inte`);
	return new Response(bundle.map, {
		headers: { 'content-type': 'image/svg+xml; charset=utf-8' }
	});
};
