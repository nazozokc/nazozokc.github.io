const CACHE_EXPIRY = 5 * 60 * 1000; // 5 min

function getStorage(): Storage | null {
	if (typeof window === 'undefined') return null;
	try {
		return window.localStorage;
	} catch {
		return null;
	}
}

export function getCachedData<T>(key: string): T | null {
	const storage = getStorage();
	if (!storage) return null;

	try {
		const cached = storage.getItem(key);
		if (!cached) return null;
		const { data, timestamp } = JSON.parse(cached);
		if (Date.now() - timestamp < CACHE_EXPIRY) return data as T;
	} catch {
		// Ignore malformed cache entries and unavailable storage.
	}
	return null;
}

export function setCachedData<T>(key: string, data: T): void {
	const storage = getStorage();
	if (!storage) return;

	try {
		storage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
	} catch {
		// Ignore quota/security errors; the page still works without caching.
	}
}
