/**
 * @file Stores admin dashboard users entries.
 */
import type { UserData } from '$lib/types/user.interface';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

const userEntries: Writable<UserData[]> = writable([]);

export default userEntries;