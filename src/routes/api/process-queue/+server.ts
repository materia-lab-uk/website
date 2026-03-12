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
	if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!kv || !apiKey) {
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
