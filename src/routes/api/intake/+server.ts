import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	const { name, email, company, budget, timeline, description, stage, referral } = data;

	if (!name || !email || !description) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	// TODO: integrate Claude API to generate a unique project assessment page
	// TODO: send email notification via Stalwart or transactional email service

	// For now, log the submission and return success
	console.log('--- New project enquiry ---');
	console.log(`Name: ${name}`);
	console.log(`Email: ${email}`);
	console.log(`Company: ${company || 'N/A'}`);
	console.log(`Stage: ${stage}`);
	console.log(`Budget: ${budget}`);
	console.log(`Timeline: ${timeline}`);
	console.log(`Description: ${description}`);
	console.log(`Referral: ${referral || 'N/A'}`);
	console.log('---');

	return json({ success: true, message: 'Enquiry received' });
};
