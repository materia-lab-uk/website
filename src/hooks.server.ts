import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleClerk } from 'clerk-sveltekit/server';
import { CLERK_SECRET_KEY } from '$env/static/private';

const publicApiPaths = ['/api/process-queue'];

const clerkHandle = handleClerk(CLERK_SECRET_KEY, {
	debug: false,
	protectedPaths: ['/admin', '/project', '/start'],
	signInUrl: '/sign-in',
});

const bypassClerkForPublicApi: Handle = async ({ event, resolve }) => {
	if (publicApiPaths.some((p) => event.url.pathname.startsWith(p))) {
		return resolve(event);
	}
	return clerkHandle({ event, resolve });
};

export const handle: Handle = sequence(bypassClerkForPublicApi);
