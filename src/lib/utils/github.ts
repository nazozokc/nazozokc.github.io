import { getCachedData, setCachedData } from './cache';

const GITHUB_USER = 'nazozokc';
const CACHE_KEY_REPOS = 'github_repos';
const CACHE_KEY_STATS = 'github_stats';
const GITHUB_HEADERS = { Accept: 'application/vnd.github+json' };

const LANGUAGE_COLORS: Record<string, string> = {
	TypeScript: '#3178c6',
	JavaScript: '#f1e05a',
	Python: '#3572A5',
	Rust: '#dea584',
	Go: '#00ADD8',
	HTML: '#e34c26',
	CSS: '#563d7c',
	Shell: '#89e051',
	Nix: '#7e7eff',
	Lua: '#000080'
};

export function getLanguageColor(lang: string): string {
	return LANGUAGE_COLORS[lang] || '#858585';
}

export interface GitHubRepo {
	name: string;
	description: string | null;
	html_url: string;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	fork: boolean;
}

export async function fetchRepos(): Promise<GitHubRepo[]> {
	const cached = getCachedData<GitHubRepo[]>(CACHE_KEY_REPOS);
	if (cached) return cached;

	const res = await fetch(
		`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=20`,
		{ headers: GITHUB_HEADERS }
	);
	if (!res.ok) throw new Error(res.status === 403 || res.status === 429 ? 'rate_limit' : 'network');
	const data = await res.json();
	const repos = Array.isArray(data) ? (data as GitHubRepo[]) : [];
	setCachedData(CACHE_KEY_REPOS, repos);
	return repos;
}

export interface ContributionStats {
	total: number;
	today: number;
}

function toIsoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

/**
 * Count commits with the public commit search API.
 * The events API no longer includes `payload.commits`, so it cannot be used
 * to count commits (it reports 0 for every PushEvent).
 */
async function countCommitsSince(date: string): Promise<number> {
	const params = new URLSearchParams({
		q: `author:${GITHUB_USER} committer-date:>=${date}`,
		per_page: '1'
	});
	const res = await fetch(`https://api.github.com/search/commits?${params}`, {
		headers: GITHUB_HEADERS
	});
	if (!res.ok) throw new Error(res.status === 403 || res.status === 429 ? 'rate_limit' : 'network');
	const data = await res.json();
	return typeof data.total_count === 'number' ? data.total_count : 0;
}

export async function fetchContributionStats(): Promise<ContributionStats> {
	const cached = getCachedData<ContributionStats>(CACHE_KEY_STATS);
	if (cached) return cached;

	const now = new Date();
	const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

	const [total, today] = await Promise.all([
		countCommitsSince(toIsoDate(ninetyDaysAgo)),
		countCommitsSince(toIsoDate(now))
	]);

	const stats: ContributionStats = { total, today };
	setCachedData(CACHE_KEY_STATS, stats);
	return stats;
}
