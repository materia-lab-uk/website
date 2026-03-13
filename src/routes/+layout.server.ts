import type { LayoutServerLoad } from './$types';
import { isAdmin } from '$lib/server/admin';

export const load: LayoutServerLoad = async ({ locals }) => {
	const userId = locals.session?.userId;
	return { isAdmin: userId ? isAdmin(userId) : false };
};
