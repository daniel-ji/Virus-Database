/**
 * @file Stores dashboard sequence entries.
 */
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { SequenceState } from '$lib/types/sequences.interface';

const sequenceEntries: Writable<SequenceState[]> = writable([]);

export default sequenceEntries;