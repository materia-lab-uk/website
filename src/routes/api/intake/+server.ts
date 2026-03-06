import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { canGenerate, generateAssessment, markGenerated, addToQueue } from '$lib/server/assess';
import type { Submission } from '$lib/server/assess';

function generateId() {
	return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const OWNER_IP = '86.31.243.178'; // Nicole's IP — bypasses rate limit

export const POST: RequestHandler = async ({ request, platform, getClientAddress }) => {
	const data = await request.json();
	const { name, email, company, budget, timeline, description, stage, referral } = data;

	if (!name || !email || !description) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const kv = platform?.env?.SUBMISSIONS;
	const apiKey = platform?.env?.ANTHROPIC_API_KEY;
	const clientIp = getClientAddress();

	const id = generateId();
	const submission: Submission = {
		...data,
		id,
		createdAt: new Date().toISOString(),
		status: 'queued',
		assessment: null,
	};

	// Try immediate generation if rate limit allows
	if (kv && apiKey && await canGenerate(kv, clientIp, OWNER_IP)) {
		submission.status = 'processing';
		await kv.put(`submission:${id}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });

		const assessment = await generateAssessment(submission, apiKey);
		submission.assessment = assessment;
		submission.status = assessment ? 'ready' : 'queued';

		await kv.put(`submission:${id}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });

		if (assessment) {
			await markGenerated(kv);
		} else {
			await addToQueue(kv, id);
		}
	} else if (kv) {
		// Queue for later processing
		await kv.put(`submission:${id}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });
		await addToQueue(kv, id);
	}

	console.log(`--- New project enquiry [${id}] status:${submission.status} ---`);
	console.log(`Name: ${name} | Email: ${email} | IP: ${clientIp}`);
	console.log('---');

	return json({ success: true, id, status: submission.status });
};
