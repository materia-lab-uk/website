import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isAdmin } from '$lib/server/admin';

export const load: PageServerLoad = async ({ params, platform, locals }) => {
	const kv = platform?.env?.SUBMISSIONS;
	if (!kv) {
		throw error(503, 'Service unavailable');
	}

	const userId = locals.session?.userId;
	if (!userId) {
		throw error(401, 'You must be signed in');
	}

	const data = await kv.get(`submission:${params.id}`);
	if (!data) {
		throw error(404, 'Project not found');
	}

	const submission = JSON.parse(data);

	// Only project owner or admin can view
	const admin = isAdmin(userId);
	if (submission.userId !== userId && !admin) {
		throw error(403, 'Access denied');
	}

	return { submission, isAdmin: admin };
};
