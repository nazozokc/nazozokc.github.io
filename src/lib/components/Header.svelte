<script lang="ts">
	import { page } from '$app/state';
	import ThemeToggle from './ThemeToggle.svelte';

	const navItems = [
		{ path: '/', label: 'Home' },
		{ path: '/blog', label: 'Blog' },
		{ path: '/zenn', label: 'Zenn' },
	];
</script>

<header class="top-bar">
	<div class="top-bar-inner">
		<div class="profile-mini">
			<a href="/">
				<div class="avatar" aria-hidden="true">@</div>
				<span class="username">nazozokc</span>
			</a>
		</div>
		<nav class="top-bar-links" aria-label="Navigation">
			{#each navItems as item}
				<a
					href={item.path}
					class="nav-link"
					class:active={item.path === '/'
						? page.url.pathname === '/'
						: page.url.pathname === item.path || page.url.pathname.startsWith(`${item.path}/`)}
					data-sveltekit-preload-data="hover"
				>
					{item.label}
				</a>
			{/each}
			<ThemeToggle />
			<a href="https://x.com/nazozokc" target="_blank" rel="noopener noreferrer" class="nav-link">X</a>
			<a href="https://github.com/nazozokc" target="_blank" rel="noopener noreferrer" class="nav-link">GitHub</a>
		</nav>
	</div>
</header>
