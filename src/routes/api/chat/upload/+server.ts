import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Submission } from '$lib/server/assess';
import { isAdmin } from '$lib/server/admin';

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	const userId = locals.session?.userId;
	if (!userId) {
		throw error(401, 'You must be signed in');
	}

	const kv = platform?.env?.SUBMISSIONS;
	const r2 = platform?.env?.UPLOADS;
	if (!kv) {
		throw error(503, 'Service unavailable');
	}

	const formData = await request.formData();
	const projectId = formData.get('projectId') as string;
	const file = formData.get('file') as File;

	if (!projectId || !file || file.size === 0) {
		return json({ error: 'Missing file or project ID' }, { status: 400 });
	}

	if (file.size > 10 * 1024 * 1024) {
		return json({ error: 'File too large (max 10MB)' }, { status: 400 });
	}

	const data = await kv.get(`submission:${projectId}`);
	if (!data) {
		throw error(404, 'Project not found');
	}

	const submission: Submission = JSON.parse(data);

	if (submission.userId !== userId && !isAdmin(userId)) {
		throw error(403, 'Access denied');
	}

	const fileId = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
	const key = `projects/${projectId}/chat/${fileId}/${file.name}`;

	const uploadedFile = { name: file.name, key, size: file.size, type: file.type, source: 'chat' as const };

	if (r2) {
		const buffer = await file.arrayBuffer();
		await r2.put(key, buffer, {
			httpMetadata: { contentType: file.type },
			customMetadata: { userId, originalName: file.name },
		});
	}

	if (!submission.files) submission.files = [];
	submission.files.push(uploadedFile);
	await kv.put(`submission:${projectId}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });

	return json({ success: true, file: uploadedFile });
};
