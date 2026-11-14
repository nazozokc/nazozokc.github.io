import fs from 'node:fs';
import path from 'node:path';

export interface BlogPostMeta {
	slug: string;
	title: string;
	emoji: string;
	date: string;
	category: string;
}

export interface BlogPost {
	meta: BlogPostMeta;
	markdown: string;
}

const BLOG_DIR = path.resolve('blog');
const MANIFEST_PATH = path.resolve('static/blog-manifest.json');
const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;

function parseFrontmatter(markdown: string): Record<string, string> | null {
	const normalized = markdown.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
	const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
	if (!match) return null;

	const fm: Record<string, string> = Object.create(null);
	for (const line of match[1].split('\n')) {
		const ci = line.indexOf(':');
		if (ci === -1) continue;
		const key = line.slice(0, ci).trim();
		let value = line.slice(ci + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		fm[key] = value;
	}
	return fm;
}

export async function getBlogSlugs(): Promise<string[]> {
	const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
	const manifest = JSON.parse(raw);
	const slugs = Array.isArray(manifest) ? manifest : manifest.posts;
	if (!Array.isArray(slugs)) return [];
	return slugs.filter((slug): slug is string => typeof slug === 'string' && SLUG_PATTERN.test(slug));
}

export function getBlogPost(slug: string): BlogPost | null {
	if (!SLUG_PATTERN.test(slug)) return null;

	const filePath = path.join(BLOG_DIR, `${slug}.md`);
	if (!fs.existsSync(filePath)) return null;

	const source = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
	const fm = parseFrontmatter(source);
	if (!fm) return null;

	// Strip frontmatter; the body stays as Markdown so it can be rendered at build time.
	const body = source.replace(/^---\n[\s\S]*?\n---(?:\n|$)/, '');

	return {
		meta: {
			slug,
			title: fm.title || slug,
			emoji: fm.emoji || '📝',
			date: fm.date || '',
			category: fm.category || ''
		},
		markdown: body
	};
}

/** Sort posts newest-first. Dates may be written as `2025-3-15` or `2025-03-15`. */
export function getPostTimestamp(date: string): number {
	const timestamp = Date.parse(date.replace(/-/g, '/'));
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
