import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { processQueue, addToQueue } from '$lib/server/assess';
import type { Submission } from '$lib/server/assess';
import { sendEmail, assessmentReadyEmail } from '$lib/server/email';

export const POST: RequestHandler = async ({ request, platform, url }) => {
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

	// Re-queue any stuck 'processing' items
	const requeueId = url.searchParams.get('requeue');
	if (requeueId) {
		const data = await kv.get(`submission:${requeueId}`);
		if (data) {
			const sub = JSON.parse(data);
			if (sub.status === 'processing') {
				sub.status = 'queued';
				await kv.put(`submission:${requeueId}`, JSON.stringify(sub), { expirationTtl: 60 * 60 * 24 * 90 });
				await addToQueue(kv, requeueId);
				console.log(`Re-queued stuck submission ${requeueId}`);
			}
		}
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
					const assessment = submission.assessment as Record<string, unknown>;
					const service = assessment?.suggested_service || assessment?.recommended_service || 'a possible approach';
					submission.messages = [{
						id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
						userId: 'ai',
						userName: 'Materia Lab AI',
						content: `Hi ${firstName}! Your initial analysis is ready — we've suggested ${service} as a starting point. Have a read through and let me know if you have any questions. Nicole will review this ahead of your discovery call.`,
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
