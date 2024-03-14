/**
 * @file Stores sorting states. Used for sorting table views.
 */
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const SEQUNECE_SORT_SUBFIELD = "sequence";
export const currentSequencesSortField : Writable<string> = writable("name");
export const currentSequencesSortOrder : Writable<number> = writable(1); // 1 for descending, -1 for ascending
export const USER_SORT_SUBFIELD = null;
export const currentUsersSortField : Writable<string> = writable("email");
export const currentUsersSortOrder : Writable<number> = writable(1); // 1 for descending, -1 for ascending