import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAdmin } from '$lib/server/admin';

export const GET: RequestHandler = async ({ locals, platform }) => {
	const userId = locals.session?.userId;
	return json({
		hasSession: !!locals.session,
		userId,
		isAdmin: userId ? isAdmin(userId) : false,
		hasKV: !!platform?.env?.SUBMISSIONS,
		hasR2: !!platform?.env?.UPLOADS,
		hasAnthropicKey: !!platform?.env?.ANTHROPIC_API_KEY,
	});
};
