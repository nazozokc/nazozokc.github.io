import type { PageServerLoad } from './$types';

interface ZennApiArticle {
	slug: string;
	title: string;
	emoji: string;
	published_at: string;
	article_type: string;
}

export const prerender = true;

const dateFormatter = new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium' });

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch('https://zenn.dev/api/articles?username=nazozokc&order=latest', {
			headers: { Accept: 'application/json' }
		});
		if (!res.ok) throw new Error(`Zenn API responded with ${res.status}`);

		const data = await res.json();
		const articles = Array.isArray(data.articles)
			? (data.articles as ZennApiArticle[]).map((article) => ({
					slug: article.slug,
					title: article.title,
					emoji: article.emoji || '📝',
					published: dateFormatter.format(new Date(article.published_at)),
					article_type: article.article_type
				}))
			: [];

		return { articles, error: false };
	} catch (err) {
		console.error('Failed to load Zenn articles:', err);
		return { articles: [], error: true };
	}
};
