import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addToQueue } from '$lib/server/assess';
import type { Submission } from '$lib/server/assess';
import { sendEmail, newSubmissionEmail } from '$lib/server/email';

function generateId() {
	return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	const userId = locals.session?.userId;
	if (!userId) {
		throw error(401, 'You must be signed in to submit a project');
	}

	const kv = platform?.env?.SUBMISSIONS;
	const r2 = platform?.env?.UPLOADS;
	const relayToken = platform?.env?.EMAIL_RELAY_TOKEN;

	const formData = await request.formData();
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const company = formData.get('company') as string;
	const budget = formData.get('budget') as string;
	const timeline = formData.get('timeline') as string;
	const description = formData.get('description') as string;
	const stage = formData.get('stage') as string;
	const referral = formData.get('referral') as string;
	const githubRepo = formData.get('githubRepo') as string;
	const ndaAgreed = formData.get('ndaAgreed') === 'true';

	if (!name || !email || !description) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	if (!ndaAgreed) {
		return json({ error: 'You must agree to the mutual NDA' }, { status: 400 });
	}

	// Handle file uploads
	const uploadedFiles: { name: string; key: string; size: number; type: string }[] = [];
	const files = formData.getAll('files') as File[];

	if (r2 && files.length > 0) {
		for (const file of files) {
			if (file.size === 0) continue;
			if (file.size > 10 * 1024 * 1024) continue; // 10MB limit per file

			const key = `projects/${generateId()}/${file.name}`;
			const buffer = await file.arrayBuffer();
			await r2.put(key, buffer, {
				httpMetadata: { contentType: file.type },
				customMetadata: { userId, originalName: file.name },
			});
			uploadedFiles.push({ name: file.name, key, size: file.size, type: file.type });
		}
	}

	const id = generateId();
	const submission: Submission = {
		id,
		userId,
		name,
		email,
		company,
		budget,
		timeline,
		description,
		stage,
		referral,
		githubRepo: githubRepo?.trim() || undefined,
		ndaAgreed,
		files: uploadedFiles,
		createdAt: new Date().toISOString(),
		status: 'queued',
		title: null,
		assessment: null,
		messages: [],
	};

	// Save immediately and queue for async assessment generation
	if (kv) {
		await kv.put(`submission:${id}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });
		await addToQueue(kv, id);

		// Track user's projects
		const userProjects = JSON.parse((await kv.get(`user:${userId}:projects`)) || '[]') as string[];
		userProjects.push(id);
		await kv.put(`user:${userId}:projects`, JSON.stringify(userProjects));
	}

	// Send email notification (fire-and-forget)
	if (relayToken) {
		sendEmail(newSubmissionEmail(name, id, description), relayToken).catch(() => {});
	}

	return json({ success: true, id, status: 'queued' });
};
