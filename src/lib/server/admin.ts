import { ADMIN_USER_IDS } from '$env/static/private';

const adminIds = ADMIN_USER_IDS.split(',').map((id) => id.trim());

export function isAdmin(userId: string): boolean {
	return adminIds.includes(userId);
}
