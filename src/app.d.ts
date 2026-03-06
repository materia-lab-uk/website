// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				SUBMISSIONS: KVNamespace;
				ANTHROPIC_API_KEY: string;
				CRON_SECRET: string;
			};
		}
	}
}

export {};
