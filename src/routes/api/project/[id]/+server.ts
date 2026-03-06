import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform, locals }) => {
	const userId = locals.session?.userId;
	if (!userId) {
		throw error(401, 'You must be signed in');
	}

	const kv = platform?.env?.SUBMISSIONS;
	if (!kv) {
		throw error(503, 'Service unavailable');
	}

	const data = await kv.get(`submission:${params.id}`);
	if (!data) {
		throw error(404, 'Project not found');
	}

	const submission = JSON.parse(data);

	const isAdmin = locals.session?.claims?.metadata?.role === 'admin';
	if (submission.userId !== userId && !isAdmin) {
		throw error(403, 'Access denied');
	}

	return json({
		status: submission.status,
		messages: submission.messages || [],
		assessment: submission.assessment,
	});
};
