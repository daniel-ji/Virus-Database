import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const currentSortField : Writable<string> = writable("name");
export const currentSortOrder : Writable<number> = writable(1); // 1 for descending, -1 for ascendin