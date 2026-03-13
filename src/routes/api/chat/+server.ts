import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Submission, Message } from '$lib/server/assess';
import { isAdmin } from '$lib/server/admin';
import Anthropic from '@anthropic-ai/sdk';

const CHAT_SYSTEM_PROMPT = `You are an AI assistant for Materia Lab, a boutique engineering and technology consultancy founded by Dr Nicole Martin. You are chatting with a client who has submitted a project enquiry.

Your role is to ask clarifying follow-up questions to better understand the project. The more detail you gather here, the better Nicole can prepare for the discovery call.

How the process works:
- The client has submitted a project and received an AI-generated assessment
- This chat is for gathering additional technical detail and answering questions about the assessment
- The next step for the client is to book a discovery call with Nicole using the link on this page
- Nicole reads this chat before the call, so anything discussed here saves time
- You do NOT know Nicole's schedule or availability — never promise timelines for when Nicole will respond or reach out
- If the client asks when they can speak to Nicole, tell them to book a discovery call using the button on this page

Guidelines:
- Ask one or two focused questions at a time, not a long list
- Dig into technical requirements, constraints, and priorities
- If something is vague, ask for specifics
- If you spot potential issues or risks, flag them constructively
- Keep responses concise (2-4 sentences typically)
- Be warm but professional
- You can reference the project assessment if one exists
- NEVER make up timelines, promises, or commitments on Nicole's behalf
- NEVER say Nicole will "reach out" or "be in touch" — the client books the call themselves`;

function buildChatMessages(submission: Submission) {
	const context = `Project: ${submission.title || 'Untitled'}
Description: ${submission.description}
Stage: ${submission.stage || 'Not specified'}
Budget: ${submission.budget || 'Not specified'}
Timeline: ${submission.timeline || 'Not specified'}
${submission.assessment ? `\nAssessment summary: ${(submission.assessment as Record<string, unknown>).summary}` : ''}`;

	const messages: { role: 'user' | 'assistant'; content: string }[] = [
		{ role: 'user', content: `[Project context]\n${context}` },
		{ role: 'assistant', content: 'Thanks for submitting your project. I\'ve reviewed the details — let me know if you have any questions about the assessment, or I can ask some follow-up questions to help Nicole prepare a more detailed proposal.' },
	];

	for (const msg of submission.messages || []) {
		const role = msg.userName === 'Materia Lab AI' ? 'assistant' as const : 'user' as const;
		messages.push({ role, content: msg.content });
	}

	return messages;
}

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	const userId = locals.session?.userId;
	if (!userId) {
		throw error(401, 'You must be signed in');
	}

	const kv = platform?.env?.SUBMISSIONS;
	const apiKey = platform?.env?.ANTHROPIC_API_KEY;
	if (!kv) {
		throw error(503, 'Service unavailable');
	}

	const { projectId, content, userName } = await request.json();

	if (!projectId || !content) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const data = await kv.get(`submission:${projectId}`);
	if (!data) {
		throw error(404, 'Project not found');
	}

	const submission: Submission = JSON.parse(data);

	// Only the project owner or admin can chat
	if (submission.userId !== userId && !isAdmin(userId)) {
		throw error(403, 'Access denied');
	}

	// Save user message
	const message: Message = {
		id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
		userId,
		userName: userName || 'User',
		content,
		createdAt: new Date().toISOString(),
	};

	if (!submission.messages) submission.messages = [];
	submission.messages.push(message);
	await kv.put(`submission:${projectId}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });

	// Generate AI follow-up (non-admin messages only, max 10 AI replies per project)
	const MAX_AI_MESSAGES = 4;
	const aiMessageCount = submission.messages.filter((m: Message) => m.userId === 'ai').length;
	let aiMessage: Message | null = null;
	if (apiKey && !isAdmin(userId) && aiMessageCount < MAX_AI_MESSAGES) {
		try {
			const client = new Anthropic({ apiKey });
			const chatMessages = buildChatMessages(submission);

			const response = await client.messages.create({
				model: 'claude-haiku-4-5-20251001',
				max_tokens: 512,
				system: CHAT_SYSTEM_PROMPT,
				messages: chatMessages,
			});

			const aiText = response.content[0].type === 'text' ? response.content[0].text : '';
			if (aiText) {
				aiMessage = {
					id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
					userId: 'ai',
					userName: 'Materia Lab AI',
					content: aiText,
					createdAt: new Date().toISOString(),
				};
				submission.messages.push(aiMessage);
				await kv.put(`submission:${projectId}`, JSON.stringify(submission), { expirationTtl: 60 * 60 * 24 * 90 });
			}
		} catch (e) {
			console.error('Chat AI error:', e);
		}
	}

	return json({ success: true, message, aiMessage });
};
