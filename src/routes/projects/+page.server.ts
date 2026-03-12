import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const kv = platform?.env?.SUBMISSIONS;
	if (!kv) {
		throw error(503, 'Service unavailable');
	}

	const userId = locals.session?.userId;
	if (!userId) {
		throw error(401, 'You must be signed in');
	}

	const projectIds = JSON.parse((await kv.get(`user:${userId}:projects`)) || '[]') as string[];

	const projects = await Promise.all(
		projectIds.map(async (id) => {
			const data = await kv.get(`submission:${id}`);
			if (!data) return null;
			const sub = JSON.parse(data);
			return {
				id: sub.id,
				title: sub.title || sub.company || 'Untitled Project',
				status: sub.status,
				createdAt: sub.createdAt,
				description: sub.description?.slice(0, 120) + (sub.description?.length > 120 ? '...' : ''),
			};
		})
	);

	return { projects: projects.filter(Boolean).reverse() };
};
