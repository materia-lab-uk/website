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

	// After assessment is ready: add initial AI chat message and notify client
	if (processedId) {
		const data = await kv.get(`submission:${processedId}`);
		if (data) {
			const submission: Submission = JSON.parse(data);
			if (submission.status === 'ready') {
				// Add welcome message referencing the assessment
				if (!submission.messages || submission.messages.length === 0) {
					const firstName = submission.name.split(' ')[0];
					const service = (submission.assessment as Record<string, unknown>)?.recommended_service || 'our recommended approach';
					submission.messages = [{
						id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
						userId: 'ai',
						userName: 'Materia Lab AI',
						content: `Hi ${firstName}! Your assessment is ready — we've recommended ${service}. Have a read through and let me know if you have any questions, or if there's anything you'd like to explore further.`,
						createdAt: new Date().toISOString(),
					}];
					await kv.put(`submission:${processedId}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });
				}

				// Send email notification
				if (relayToken && submission.title) {
					sendEmail(assessmentReadyEmail(submission.name, submission.email, processedId, submission.title), relayToken).catch(() => {});
				}
			}
		}
	}

	return json({ processed: processedId });
};
