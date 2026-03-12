const RELAY_URL = 'https://cloud.materia-lab.uk/api/email';

interface EmailOptions {
	to: string;
	subject: string;
	html: string;
}

export async function sendEmail(options: EmailOptions, relayToken: string): Promise<boolean> {
	try {
		const response = await fetch(RELAY_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${relayToken}`,
			},
			body: JSON.stringify(options),
		});

		if (!response.ok) {
			console.error('Email send failed:', response.status, await response.text());
		}

		return response.ok;
	} catch (e) {
		console.error('Email send error:', e);
		return false;
	}
}

export function newSubmissionEmail(name: string, projectId: string, description: string): EmailOptions {
	return {
		to: 'nic@materia-lab.uk',
		subject: `New project enquiry from ${name}`,
		html: `
			<div style="font-family: sans-serif; max-width: 600px;">
				<h2 style="color: #00cc77;">New Project Enquiry</h2>
				<p><strong>${name}</strong> has submitted a new project.</p>
				<div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
					<p style="margin: 0; color: #333;">${description.slice(0, 300)}${description.length > 300 ? '...' : ''}</p>
				</div>
				<a href="https://materia-lab.uk/project/${projectId}" style="display: inline-block; background: #00cc77; color: #050810; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Project</a>
			</div>
		`,
	};
}

export function assessmentReadyEmail(name: string, email: string, projectId: string, title: string): EmailOptions {
	return {
		to: email,
		subject: `Your project assessment is ready — ${title}`,
		html: `
			<div style="font-family: sans-serif; max-width: 600px;">
				<h2 style="color: #00cc77;">Your Assessment is Ready</h2>
				<p>Hi ${name},</p>
				<p>Your project assessment for <strong>${title}</strong> is ready to view.</p>
				<a href="https://materia-lab.uk/project/${projectId}" style="display: inline-block; background: #00cc77; color: #050810; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Assessment</a>
				<p style="color: #888; margin-top: 24px; font-size: 14px;">&mdash; Materia Lab</p>
			</div>
		`,
	};
}
