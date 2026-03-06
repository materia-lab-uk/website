import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Submission, Message } from '$lib/server/assess';

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	const userId = locals.session?.userId;
	if (!userId) {
		throw error(401, 'You must be signed in');
	}

	const kv = platform?.env?.SUBMISSIONS;
	if (!kv) {
		throw error(503, 'Service unavailable');
	}

	const { projectId, content, userName } = await request.json();

	if (!projectId || !content) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const data = await kv.get(`submission:${projectId}`);
	if (!data) {
		throw error(404, 'Project not found');
	}

	const submission: Submission = JSON.parse(data);

	// Only the project owner or admin can chat
	const isAdmin = locals.session?.claims?.metadata?.role === 'admin';
	if (submission.userId !== userId && !isAdmin) {
		throw error(403, 'Access denied');
	}

	const message: Message = {
		id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
		userId,
		userName: userName || 'User',
		content,
		createdAt: new Date().toISOString(),
	};

	submission.messages.push(message);
	await kv.put(`submission:${projectId}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });

	return json({ success: true, message });
};
