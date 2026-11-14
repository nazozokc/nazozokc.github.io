import type { PageServerLoad } from './$types';
import { getBlogSlugs, getBlogPost, getPostTimestamp } from '#lib/utils/blog.js';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const slugs = await getBlogSlugs();
	const posts = slugs
		.map((slug) => getBlogPost(slug))
		.filter((post): post is NonNullable<typeof post> => post !== null)
		.map((post) => post.meta)
		.sort((a, b) => getPostTimestamp(b.date) - getPostTimestamp(a.date));

	return { posts };
};
