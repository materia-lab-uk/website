import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	const kv = platform?.env?.SUBMISSIONS;
	if (!kv) {
		throw error(503, 'Service unavailable');
	}

	const data = await kv.get(`submission:${params.id}`);
	if (!data) {
		throw error(404, 'Project not found');
	}

	const submission = JSON.parse(data);
	return { submission };
};
