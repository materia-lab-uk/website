import type { PageServerLoad } from './$types';

interface DevToArticle {
	id: number;
	title: string;
	description: string;
	url: string;
	published_at: string;
	tag_list: string[];
	reading_time_minutes: number;
	cover_image: string | null;
}

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch('https://dev.to/api/articles?username=dr_nicole&per_page=20', {
			headers: {
				'Accept': 'application/json',
				'User-Agent': 'materia-lab.uk',
			},
		});
		if (!res.ok) {
			console.error(`Dev.to API returned ${res.status}: ${res.statusText}`);
			return { articles: [] };
		}
		const articles: DevToArticle[] = await res.json();
		return {
			articles: articles.map((a) => ({
				id: a.id,
				title: a.title,
				description: a.description,
				url: a.url,
				date: a.published_at,
				tags: a.tag_list,
				readingTime: a.reading_time_minutes,
				coverImage: a.cover_image,
			})),
		};
	} catch (e) {
		console.error('Dev.to fetch error:', e);
		return { articles: [] };
	}
};
