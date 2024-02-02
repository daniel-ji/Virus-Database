/**
 * @file Stores the state of the sequence being edited by the dashboard. 
 */
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { SequenceState } from '$lib/types/sequences.interface';

const editedSequence: Writable<SequenceState | null> = writable(null);

export default editedSequence;