<script lang="ts">
	let { value, duration = 800 }: { value: number; duration?: number } = $props();

	let display = $state(0);

	$effect(() => {
		const target = value;

		if (typeof requestAnimationFrame === 'undefined') {
			display = target;
			return;
		}

		const startTime = performance.now();
		let frame = 0;

		const tick = (now: number) => {
			const progress = Math.min((now - startTime) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			display = Math.round(target * eased);
			if (progress < 1) frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	});
</script>

<span>{display}</span>
