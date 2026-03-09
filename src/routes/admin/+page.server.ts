import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Submission } from '$lib/server/assess';
import { isAdmin } from '$lib/server/admin';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const userId = locals.session?.userId;
	if (!userId) {
		throw error(401, 'You must be signed in');
	}

	if (!isAdmin(userId)) {
		throw error(403, 'Admin access required');
	}

	const kv = platform?.env?.SUBMISSIONS;
	if (!kv) {
		throw error(503, 'Service unavailable');
	}

	// List all submissions by scanning KV
	// Note: KV list is eventually consistent and has a 1000 key limit per call
	const listed = await kv.list({ prefix: 'submission:' });
	const submissions: Submission[] = [];

	for (const key of listed.keys) {
		const data = await kv.get(key.name);
		if (data) {
			submissions.push(JSON.parse(data));
		}
	}

	// Sort newest first
	submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

	// Queue status
	const queue = JSON.parse((await kv.get('queue')) || '[]') as string[];

	return { submissions, queueLength: queue.length };
};
