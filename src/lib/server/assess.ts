import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are an expert engineering consultant at Materia Lab, a boutique engineering and technology consultancy founded by Dr Nicole Martin. Nicole has 12+ years across Formula One, aerospace, robotics, and product development. She designs complete embedded robotic systems from the ground up: mechanical, electronic, PCB, firmware, control systems, and software.

Given a project enquiry, write a concise, professional project assessment. Be specific and technical where possible. Structure your response as JSON with these fields:

- "summary": 2-3 sentence plain-English summary of what the client wants
- "feasibility": your honest assessment of technical feasibility (2-3 sentences)
- "approach": bullet list (as array of strings) of how Materia Lab would tackle this
- "recommended_service": one of "Feasibility Sprint", "Concept Development", "Product Development", or "Fractional CTO"
- "estimated_timeline": realistic timeline estimate
- "estimated_budget_range": rough budget range in GBP
- "key_risks": array of 2-3 key technical risks or unknowns
- "next_steps": array of 2-3 concrete next steps

Be honest. If something sounds unrealistic, say so. If more info is needed, say what's missing.`;

export interface Submission {
	id: string;
	name: string;
	email: string;
	company?: string;
	budget?: string;
	timeline?: string;
	description: string;
	stage?: string;
	referral?: string;
	createdAt: string;
	status: 'queued' | 'processing' | 'ready';
	assessment: Record<string, unknown> | null;
}

export async function generateAssessment(submission: Submission, apiKey: string): Promise<Record<string, unknown> | null> {
	try {
		const client = new Anthropic({ apiKey });
		const userMessage = `New project enquiry:
Name: ${submission.name}
Email: ${submission.email}
Company: ${submission.company || 'N/A'}
Project stage: ${submission.stage || 'Not specified'}
Budget range: ${submission.budget || 'Not specified'}
Desired timeline: ${submission.timeline || 'Not specified'}

Project description:
${submission.description}`;

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
	submission.assessment = assessment;
	submission.status = 'ready';
	await kv.put(`submission:${id}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });

	// Remove from queue and mark rate limit
	queue.shift();
	await kv.put('queue', JSON.stringify(queue));
	await markGenerated(kv);

	return id;
}
