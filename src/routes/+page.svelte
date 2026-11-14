<script lang="ts">
	import { onMount } from 'svelte';
	import AnimateOnView from '#lib/components/AnimateOnView.svelte';
	import AnimatedNumber from '#lib/components/AnimatedNumber.svelte';
	import { skillCategories, environmentCards, interests, wipItems, timeline } from '#lib/data/skills.js';
	import { getLanguageColor, fetchRepos, fetchContributionStats } from '#lib/utils/github.js';
	import type { GitHubRepo } from '#lib/utils/github.js';

	let repos = $state<GitHubRepo[]>([]);
	let repoError = $state<string | null>(null);
	let totalContributions = $state<number | null>(null);
	let todayContributions = $state<number | null>(null);
	let statsError = $state<string | null>(null);

	onMount(() => {
		loadRepos();
		loadStats();
	});

	async function loadRepos() {
		try {
			const data = await fetchRepos();
			repos = data.filter((repo) => !repo.fork).slice(0, 8);
		} catch (err) {
			repoError = err instanceof Error && err.message === 'rate_limit'
				? 'API制限に達しました。しばらくお待ちください。'
				: 'リポジトリの読み込みに失敗しました';
		}
	}

	async function loadStats() {
		try {
			const stats = await fetchContributionStats();
			totalContributions = stats.total;
			todayContributions = stats.today;
		} catch (err) {
			statsError = err instanceof Error && err.message === 'rate_limit' ? 'API制限' : 'エラー';
		}
	}
</script>

<!-- Hero -->
<section class="hero-card">
	<div class="hero-content">
		<img src="/image/icon.jpg" alt="nazozokc" class="hero-profile-image" />
		<h1 class="hero-title">nazozokc</h1>
		<p class="hero-subtitle">ITオタク・エンジニア志望</p>
		<p class="hero-desc">Arch Linux / Neovim / TypeScript</p>
		<p class="hero-desc">API開発・CLIツール・環境構築が好き</p>
	</div>
</section>

<!-- Skills -->
<AnimateOnView>
	<section class="card-section">
		<h2 class="section-title">Skills</h2>
		<div class="skills-categories">
			{#each skillCategories as category}
				<div class="skill-category">
					<span class="skill-cat-label {category.class}">{category.label}</span>

					{#if 'items' in category && category.items}
						<div class="skill-rows">
							{#each category.items as item}
								<div class="skill-row">
									<span class="skill-name">{item.name}</span>
									<div class="skill-bar" role="progressbar" aria-valuenow={item.pct} aria-valuemin="0" aria-valuemax="100" aria-label="{item.name} {item.pct}%">
										<div class="skill-fill animated" style="width:{item.pct}%;--bar-color:{item.color}"></div>
									</div>
									<span class="skill-pct" aria-hidden="true">Learning</span>
								</div>
							{/each}
						</div>
					{/if}

					{#if 'tags' in category && category.tags}
						<div class="skill-tags-mini">
							{#each category.tags as tag}
								<span class="skill-mini">{tag}</span>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>
</AnimateOnView>

<!-- Environment -->
<AnimateOnView>
	<section class="card-section">
		<h2 class="section-title">Environment</h2>
		<div class="env-grid">
			{#each environmentCards as env}
				<div class="env-card">
					<h3 class="env-title">{env.title}</h3>
					{#each env.details as detail}
						<p class="env-detail">{detail}</p>
					{/each}
				</div>
			{/each}
		</div>
	</section>
</AnimateOnView>

<!-- Interests -->
<AnimateOnView>
	<section class="card-section">
		<h2 class="section-title">Interests</h2>
		<div class="interests-grid">
			{#each interests as item}
				<div class="interest-item">
					<span class="interest-icon">{item.icon}</span>
					<span class="interest-label">{item.label}</span>
				</div>
			{/each}
		</div>
	</section>
</AnimateOnView>

<!-- Stats -->
<AnimateOnView>
	<section class="card-section">
		<h2 class="section-title">Stats</h2>
		{#if statsError}
			<p class="error-msg">{statsError}</p>
		{:else}
			<div class="stats-grid">
				<div class="stat-card">
					<div class="stat-value">
						{#if totalContributions === null}
							-
						{:else}
							<AnimatedNumber value={totalContributions} />
						{/if}
					</div>
					<div class="stat-label">Total / 90 days</div>
				</div>
				<div class="stat-card">
					<div class="stat-value">
						{#if todayContributions === null}
							-
						{:else}
							<AnimatedNumber value={todayContributions} />
						{/if}
					</div>
					<div class="stat-label">Today</div>
				</div>
			</div>
		{/if}
	</section>
</AnimateOnView>

<!-- Now / WIP -->
<AnimateOnView>
	<section class="card-section">
		<h2 class="section-title">Now / WIP</h2>
		<div class="wip-list">
			{#each wipItems as item}
				<div class="wip-item">
					<span class="wip-status {item.status}">{item.status}</span>
					<div class="wip-body">
						<span class="wip-title">{item.title}</span>
						<span class="wip-desc">{item.desc}</span>
					</div>
					{#if item.url}
						<a href={item.url} target="_blank" rel="noopener noreferrer" class="wip-link">→</a>
					{:else}
						<span class="wip-link" style="opacity:0.3">—</span>
					{/if}
				</div>
			{/each}
		</div>
	</section>
</AnimateOnView>

<!-- Repositories -->
<AnimateOnView>
	<section class="card-section">
		<h2 class="section-title">Repositories</h2>
		<div class="repos-grid">
			{#if repoError}
				<p class="error-msg">{repoError}</p>
			{:else if repos.length === 0}
				<p class="loading">Loading <span class="loading-spinner"></span></p>
			{:else}
				{#each repos as repo}
					<a href={repo.html_url} target="_blank" rel="noopener noreferrer" class="repo-card">
						<div class="repo-name">{repo.name}</div>
						<p class="repo-desc">{repo.description || 'No description'}</p>
						<div class="repo-meta">
							{#if repo.language}
								<span class="repo-language">
									<span class="language-dot" style="background:{getLanguageColor(repo.language)}"></span>
									{repo.language}
								</span>
							{/if}
							<span>★ {repo.stargazers_count}</span>
							<span>⑂ {repo.forks_count}</span>
						</div>
					</a>
				{/each}
			{/if}
		</div>
	</section>
</AnimateOnView>

<!-- Timeline -->
<AnimateOnView>
	<section class="card-section">
		<h2 class="section-title">Timeline</h2>
		<div class="timeline">
			{#each timeline as item}
				<div class="tl-item">
					<div class="tl-dot"></div>
					<div class="tl-content">
						<span class="tl-date">{item.date}</span>
						<span class="tl-title">{item.title}</span>
						{#if item.desc}
							<span class="tl-desc">{item.desc}</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>
</AnimateOnView>
