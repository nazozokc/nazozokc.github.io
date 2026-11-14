<script lang="ts">
	let { children }: { children: import('svelte').Snippet } = $props();

	let element = $state<HTMLElement>();
	let isVisible = $state(false);

	$effect(() => {
		const target = element;
		if (!target) return;
		if (typeof IntersectionObserver === 'undefined') {
			isVisible = true;
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						isVisible = true;
						observer.unobserve(target);
					}
				}
			},
			{ threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
		);
		observer.observe(target);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={element}
	class="animate-in"
	class:visible={isVisible}
	style={isVisible ? '' : 'opacity:0;'}
>
	{@render children()}
</div>
