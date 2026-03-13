import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAdmin } from '$lib/server/admin';

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

	if (submission.userId !== userId && !isAdmin(userId)) {
		throw error(403, 'Access denied');
	}

	return json({
		status: submission.status,
		messages: submission.messages || [],
		assessment: submission.assessment,
		githubRepo: submission.githubRepo || null,
	});
};

export const PATCH: RequestHandler = async ({ params, request, platform, locals }) => {
	const userId = locals.session?.userId;
	if (!userId || !isAdmin(userId)) {
		throw error(403, 'Admin access required');
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
	const updates = await request.json();

	if (updates.githubRepo !== undefined) {
		submission.githubRepo = updates.githubRepo;
	}
	if (updates.messages !== undefined) {
		submission.messages = updates.messages;
	}

	await kv.put(`submission:${params.id}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });
	return json({ success: true });
};
