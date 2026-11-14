import type { PageServerLoad, EntryGenerator } from './$types';
import { getBlogSlugs, getBlogPost } from '#lib/utils/blog.js';
import { Marked } from 'marked';

const marked = new Marked();

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const slugs = await getBlogSlugs();
	return slugs.map((slug: string) => ({ slug }));
};

export const load: PageServerLoad = async ({ params }) => {
	const post = getBlogPost(params.slug);

	if (!post) {
		throw new Error(`Post not found: ${params.slug}`);
	}

	// Render markdown to HTML at build time
	const html = await marked.parse(post.markdown);

	return {
		meta: post.meta,
		html
	};
};
