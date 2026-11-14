<script lang="ts">
	import { theme } from '#lib/theme.js';

	let isNight = $derived($theme === 'night');
</script>

<button
	class="theme-toggle"
	aria-label="Toggle theme"
	aria-pressed={isNight ? 'true' : 'false'}
	onclick={() => theme.toggle()}
>
	<span class="toggle-track">
		<span class="toggle-thumb">
			<span class="toggle-icon toggle-icon-sun">☀</span>
			<span class="toggle-icon toggle-icon-moon">☾</span>
		</span>
	</span>
</button>
