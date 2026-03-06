import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { processQueue } from '$lib/server/assess';

export const POST: RequestHandler = async ({ request, platform }) => {
	const kv = platform?.env?.SUBMISSIONS;
	const apiKey = platform?.env?.ANTHROPIC_API_KEY;
	const cronSecret = platform?.env?.CRON_SECRET;

	// Protect with a shared secret
	const auth = request.headers.get('authorization');
	if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!kv || !apiKey) {
		return json({ error: 'Missing configuration' }, { status: 503 });
	}

	const processedId = await processQueue(kv, apiKey);
	return json({ processed: processedId });
};
