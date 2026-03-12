import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { processQueue } from '$lib/server/assess';
import type { Submission } from '$lib/server/assess';
import { sendEmail, assessmentReadyEmail } from '$lib/server/email';

export const POST: RequestHandler = async ({ request, platform }) => {
	const kv = platform?.env?.SUBMISSIONS;
	const apiKey = platform?.env?.ANTHROPIC_API_KEY;
	const cronSecret = platform?.env?.CRON_SECRET;
	const relayToken = platform?.env?.EMAIL_RELAY_TOKEN;

	// Protect with a shared secret
	const auth = request.headers.get('authorization');
	console.log(`--- process-queue: cronSecret:${cronSecret ? 'set' : 'MISSING'} apiKey:${apiKey ? 'set' : 'MISSING'} relayToken:${relayToken ? 'set' : 'MISSING'} auth:${auth ? 'provided' : 'MISSING'} ---`);
	if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
		console.log(`--- process-queue: auth failed. expected:Bearer ${cronSecret?.slice(0, 4)}... got:${auth?.slice(0, 15)}... ---`);
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!kv || !apiKey) {
		console.log(`--- process-queue: missing config. kv:${kv ? 'ok' : 'MISSING'} apiKey:${apiKey ? 'ok' : 'MISSING'} ---`);
		return json({ error: 'Missing configuration' }, { status: 503 });
	}

	const processedId = await processQueue(kv, apiKey);

	// Notify client that assessment is ready
	if (processedId && relayToken) {
		const data = await kv.get(`submission:${processedId}`);
		if (data) {
			const submission: Submission = JSON.parse(data);
			if (submission.status === 'ready' && submission.title) {
				sendEmail(assessmentReadyEmail(submission.name, submission.email, processedId, submission.title), relayToken).catch(() => {});
			}
		}
	}

	return json({ processed: processedId });
};
