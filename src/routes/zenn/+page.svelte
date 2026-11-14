<script lang="ts">
	import type { PageData } from './$types';
	import AnimateOnView from '#lib/components/AnimateOnView.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Zenn — nazozokc</title>
</svelte:head>

<section class="hero-card">
	<div class="hero-content">
		<h1 class="hero-title">Zenn</h1>
		<p class="hero-subtitle">技術記事</p>
	</div>
</section>

<AnimateOnView>
	<section class="card-section">
		<h2 class="section-title">Articles</h2>
		{#if data.error}
			<p class="error-msg">Zenn記事の読み込みに失敗しました</p>
		{:else if data.articles.length === 0}
			<p class="loading">No articles found</p>
		{:else}
			<div class="blog-grid">
				{#each data.articles as article}
					<a
						href="https://zenn.dev/nazozokc/articles/{article.slug}"
						target="_blank"
						rel="noopener noreferrer"
						class="blog-card"
					>
						<div class="blog-header">
							<span class="blog-emoji">{article.emoji}</span>
							<span class="blog-date">{article.published}</span>
						</div>
						<h3 class="blog-title">{article.title}</h3>
						{#if article.article_type}
							<span class="blog-category">{article.article_type}</span>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	</section>
</AnimateOnView>
