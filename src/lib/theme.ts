import { writable } from 'svelte/store';

export type Theme = 'day' | 'night';

function readStoredTheme(): Theme {
	if (typeof window === 'undefined') return 'day';
	try {
		return localStorage.getItem('theme') === 'night' ? 'night' : 'day';
	} catch {
		return 'day';
	}
}

function createThemeStore() {
	const { subscribe, set, update } = writable<Theme>(readStoredTheme());

	subscribe((value) => {
		if (typeof document === 'undefined') return;
		if (value === 'night') {
			document.documentElement.setAttribute('data-theme', 'night');
		} else {
			document.documentElement.removeAttribute('data-theme');
		}
		try {
			localStorage.setItem('theme', value);
		} catch {
			// Storage can be unavailable (private mode, quota); theme still applies for this page view.
		}
	});

	return {
		subscribe,
		toggle: () => update((t) => (t === 'night' ? 'day' : 'night')),
		set
	};
}

export const theme = createThemeStore();
