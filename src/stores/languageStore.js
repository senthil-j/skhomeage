import { readable, writable } from 'svelte/store';

export const langStore = writable({
	language: 'en',
	store: 'sa'
});

export const defaultAppSettings = readable({
	defaultLanguage: 'en',
	defaultStore: 'sa'
});

export const languageStoreDetails = readable({
	availableLanguages: ['en', 'sa'],
	availableStore: ['sa', 'bh', 'om', 'eg']
});
