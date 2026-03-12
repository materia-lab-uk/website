// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: {
				userId: string;
				claims?: Record<string, unknown>;
			};
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				SUBMISSIONS: KVNamespace;
				UPLOADS: R2Bucket;
				ANTHROPIC_API_KEY: string;
				CRON_SECRET: string;
				EMAIL_RELAY_TOKEN: string;
			};
		}
	}
}

export {};
