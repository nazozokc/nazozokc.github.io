<script lang="ts">
	import type { PageData } from './$types';
	import AnimateOnView from '#lib/components/AnimateOnView.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Blog — nazozokc</title>
</svelte:head>

<section class="hero-card">
	<div class="hero-content">
		<h1 class="hero-title">Blog</h1>
		<p class="hero-subtitle">技術メモや日々の記録</p>
	</div>
</section>

<AnimateOnView>
	<section class="card-section">
		<h2 class="section-title">Posts</h2>
		{#if data.posts.length === 0}
			<p class="loading">No posts yet.</p>
		{:else}
			<div class="blog-grid">
				{#each data.posts as post}
					<a href={`/blog/${post.slug}`} class="blog-card">
						<div class="blog-header">
							<span class="blog-emoji">{post.emoji}</span>
							<span class="blog-date">{post.date}</span>
						</div>
						<h3 class="blog-title">{post.title}</h3>
						{#if post.category}
							<span class="blog-category">{post.category}</span>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	</section>
</AnimateOnView>
