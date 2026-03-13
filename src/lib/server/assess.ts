import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are writing a project assessment on behalf of Materia Lab, a boutique engineering and technology consultancy founded by Dr Nicole Martin. Nicole has 12+ years across Formula One, aerospace, robotics, and product development. She designs complete embedded robotic systems from the ground up: mechanical, electronic, PCB, firmware, control systems, and software.

This assessment will be read by the CLIENT — the person who submitted the enquiry. Write it addressed to them directly. Do NOT write instructions for the consultant (e.g. "Contact client" or "Schedule a call with them"). Instead, frame everything as what the client should expect and what their next steps are.

Structure your response as JSON with these fields:

- "title": a short, descriptive project title (3-6 words, e.g. "Autonomous Inspection Robot", "Force-Feedback Rehabilitation Device")
- "summary": 2-3 sentence plain-English summary of what you're looking to build, addressed to the client
- "feasibility": honest assessment of technical feasibility (2-3 sentences), addressed to the client
- "approach": bullet list (as array of strings) of how we would tackle this project
- "recommended_service": one of "Feasibility Sprint", "Concept Development", "Product Development", or "Fractional CTO"
- "estimated_timeline": realistic timeline estimate
- "estimated_budget_range": rough budget range in GBP
- "key_risks": array of 2-3 key technical risks or unknowns the client should be aware of
- "next_steps": array of 2-3 concrete next steps for the client (e.g. "Book a discovery call to discuss requirements in detail", "Provide CAD files for the existing enclosure", "We'll prepare a detailed proposal within 5 working days")

Be honest and direct. If something sounds unrealistic, say so. If more info is needed, tell the client what you need from them.`;

export interface Message {
	id: string;
	userId: string;
	userName: string;
	content: string;
	createdAt: string;
}

export interface UploadedFile {
	name: string;
	key: string;
	size: number;
	type: string;
}

export interface Submission {
	id: string;
	userId: string;
	name: string;
	email: string;
	company?: string;
	budget?: string;
	timeline?: string;
	description: string;
	stage?: string;
	referral?: string;
	githubRepo?: string;
	ndaAgreed: boolean;
	files: UploadedFile[];
	createdAt: string;
	status: 'queued' | 'processing' | 'ready';
	title: string | null;
	assessment: Record<string, unknown> | null;
	messages: Message[];
}

export async function generateAssessment(submission: Submission, apiKey: string): Promise<Record<string, unknown> | null> {
	try {
		const client = new Anthropic({ apiKey });
		const fileInfo = submission.files?.length
			? `\n\nAttached files:\n${submission.files.map((f) => `- ${f.name} (${f.type}, ${Math.round(f.size / 1024)}KB)`).join('\n')}`
			: '';

		const userMessage = `New project enquiry:
Name: ${submission.name}
Email: ${submission.email}
Company: ${submission.company || 'N/A'}
Project stage: ${submission.stage || 'Not specified'}
Budget range: ${submission.budget || 'Not specified'}
Desired timeline: ${submission.timeline || 'Not specified'}

Project description:
${submission.description}${fileInfo}`;

		const response = await client.messages.create({
			model: 'claude-haiku-4-5-20251001',
			max_tokens: 1024,
			system: SYSTEM_PROMPT,
			messages: [{ role: 'user', content: userMessage }],
		});

		const text = response.content[0].type === 'text' ? response.content[0].text : '';
		const jsonMatch = text.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			return JSON.parse(jsonMatch[0]);
		}
	} catch (e) {
		console.error('Claude API error:', e);
	}
	return null;
}

const RATE_KEY = 'rate:last_generation';
const RATE_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours

export async function canGenerate(kv: KVNamespace, clientIp: string, ownerIp: string): Promise<boolean> {
	if (clientIp === ownerIp) return true;
	const last = await kv.get(RATE_KEY);
	if (!last) return true;
	return Date.now() - parseInt(last) >= RATE_INTERVAL_MS;
}

export async function markGenerated(kv: KVNamespace): Promise<void> {
	await kv.put(RATE_KEY, String(Date.now()), { expirationTtl: 60 * 60 * 24 });
}

export async function addToQueue(kv: KVNamespace, id: string): Promise<void> {
	const queue = JSON.parse((await kv.get('queue')) || '[]') as string[];
	if (!queue.includes(id)) {
		queue.push(id);
		await kv.put('queue', JSON.stringify(queue));
	}
}

export async function processQueue(kv: KVNamespace, apiKey: string): Promise<string | null> {
	const queue = JSON.parse((await kv.get('queue')) || '[]') as string[];
	if (queue.length === 0) return null;

	const id = queue[0];
	const data = await kv.get(`submission:${id}`);
	if (!data) {
		// Stale entry, remove and recurse
		queue.shift();
		await kv.put('queue', JSON.stringify(queue));
		return processQueue(kv, apiKey);
	}

	const submission: Submission = JSON.parse(data);
	if (submission.status === 'ready') {
		queue.shift();
		await kv.put('queue', JSON.stringify(queue));
		return id;
	}

	// Mark processing
	submission.status = 'processing';
	await kv.put(`submission:${id}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });

	// Generate
	const assessment = await generateAssessment(submission, apiKey);
	if (assessment) {
		submission.assessment = assessment;
		submission.title = (assessment?.title as string) || null;
		submission.status = 'ready';
		await kv.put(`submission:${id}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });
		queue.shift();
		await kv.put('queue', JSON.stringify(queue));
		await markGenerated(kv);
		return id;
	} else {
		// Failed — revert to queued so it retries next run
		console.error(`Assessment generation failed for ${id}, will retry`);
		submission.status = 'queued';
		await kv.put(`submission:${id}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });
		return null;
	}
}
