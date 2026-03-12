import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAdmin } from '$lib/server/admin';

export const GET: RequestHandler = async ({ url, platform, locals }) => {
	const userId = locals.session?.userId;
	if (!userId) {
		throw error(401, 'You must be signed in');
	}

	const r2 = platform?.env?.UPLOADS;
	const kv = platform?.env?.SUBMISSIONS;
	if (!r2 || !kv) {
		throw error(503, 'Service unavailable');
	}

	const key = url.searchParams.get('key');
	const projectId = url.searchParams.get('project');
	if (!key || !projectId) {
		throw error(400, 'Missing key or project');
	}

	// Verify access
	const data = await kv.get(`submission:${projectId}`);
	if (!data) {
		throw error(404, 'Project not found');
	}
	const submission = JSON.parse(data);
	if (submission.userId !== userId && !isAdmin(userId)) {
		throw error(403, 'Access denied');
	}

	const object = await r2.get(key);
	if (!object) {
		throw error(404, 'File not found');
	}

	const filename = key.split('/').pop() || 'download';

	return new Response(object.body, {
		headers: {
			'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
			'Content-Disposition': `attachment; filename="${filename}"`,
		},
	});
};
