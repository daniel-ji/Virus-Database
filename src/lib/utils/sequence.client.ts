/**
 * @file Functions for CRUD operations on sequences and viewing / editing sequences. 
 * For DatabaseEdit and DatabaseView components (client-side).
 */
import FileSaver from "file-saver";

import editedSequence from "$lib/stores/editedSequence";
import sequenceEntries from "$lib/stores/sequenceEntries";
import { currentSequencesSortField, currentSequencesSortOrder } from "$lib/stores/sortView";
import type { Sequence, SequenceState } from "$lib/types/sequences.interface";

import { VALID_SEQUENCE_NAME, VALID_DESCRIPTION, NAME_LIMIT, DESCRIP_LIMIT } from "$lib/utils/validation";

// Can't use SvelteKit stores in non-SvelteKit files, so use regular variables and subscribe to the stores.
let $currentSequencesSortField: string = "name";
let $currentSequencesSortOrder: number = 1;
currentSequencesSortField.subscribe((value) => {
	$currentSequencesSortField = value;
});
currentSequencesSortOrder.subscribe((value) => {
	$currentSequencesSortOrder = value;
});

let $sequenceEntries: SequenceState[] = [];
let $editedSequence: SequenceState | null = null;
sequenceEntries.subscribe((value) => {
	$sequenceEntries = value;
});
editedSequence.subscribe((value) => {
	$editedSequence = value;
});

/**
 * Gets sequences from the server and sets the sequenceEntries store.
 */
export const getSequences = async () => {
	const sequencesResponse = await fetch("/api/sequences");
	if (!sequencesResponse.ok) {
		return;
	}
	const sequences = await sequencesResponse.json();

	sequenceEntries.set(sequences.map((sequence: Sequence) => ({
		id: sequence.id,
		sequence,
		oldSequence: structuredClone(sequence),
	})));
}

/**
 * Get sequence file content. 
 * 
 * @param filepath - The path to the sequence file
 * @param kilabytes - The number of kilabytes to fetch from the start of the file
 * 
 * @returns Server response.
 */
export const fetchSequence = async (filepath: string, kilabytes?: number): Promise<Response> => {
	const escapedFilepath = encodeURIComponent(filepath);
	const params = kilabytes ? `?kb=${kilabytes}` : "";
	return fetch(`/api/sequences/filepath/${escapedFilepath}${params}`);
}

/**
 * Download sequence file content.
 */
export const downloadSequence = async (filepath: string, kilabytes?: number) => {
	const downloadResponse = await fetchSequence(filepath, kilabytes);

	if (!downloadResponse.ok) {
		alert("Could not download sequence");
		return;
	}

	FileSaver.saveAs(await downloadResponse.blob(), filepath);
}

/**
 * Edit a sequence. 
 * 
 * @param sequenceId - The ID of the sequence to edit
 */
export const editSequence = async (sequenceId: string) => {
	if (!cancelEdits(true)) {
		return;
	}

	const index = $sequenceEntries.findIndex((sequence) => sequence.id === sequenceId);

	$sequenceEntries[index].oldSequence = structuredClone($sequenceEntries[index].sequence);
	sequenceEntries.set($sequenceEntries);
	editedSequence.set($sequenceEntries[index]);
}

/**
 * Cancel edits to a sequence. 
 * 
 * @param forceConfirm - Force a confirmation dialog (doesn't confirm if the sequence is unedited)
 * 
 * @returns True if edits were cancelled or there were no edits to cancel, false otherwise
 */
export const cancelEdits = (forceConfirm: boolean): boolean => {
	if ($editedSequence === null) {
		return true;
	}

	const unsavedIndex = $sequenceEntries.findIndex((sequence) => sequence.id === $editedSequence?.id);
	const edited =
		JSON.stringify($sequenceEntries[unsavedIndex].sequence) !==
		JSON.stringify($sequenceEntries[unsavedIndex].oldSequence);

	if (!edited && !forceConfirm) {
		editedSequence.set(null);
		return true;
	}

	if (confirm("Currently editing a sequence, cancel edits?")) {
		$sequenceEntries[unsavedIndex].sequence = structuredClone(
			$sequenceEntries[unsavedIndex].oldSequence,
		);
		sequenceEntries.set($sequenceEntries);
		editedSequence.set(null);
		return true;
	}

	return false;
}

/**
 * Save edits to a sequence.
 */
export const saveEdits = async () => {
	if ($editedSequence === null) {
		return;
	}

	if (!VALID_SEQUENCE_NAME($editedSequence.sequence.name)) {
		alert("Name must be between 1 and " + NAME_LIMIT + " characters");
		return;
	}

	if (!VALID_DESCRIPTION($editedSequence.sequence.description)) {
		alert("Description must be less than " + DESCRIP_LIMIT + " characters.");
		return;
	}

	const saveResponse = await fetch(`/api/sequences/id/${$editedSequence?.id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: $editedSequence?.sequence.name,
			description: $editedSequence?.sequence.description
		})
	});

	if (!saveResponse.ok) {
		alert("Could not save sequence");
		return;
	}

	alert("Saved edits for sequence " + $editedSequence?.sequence.name);
	$editedSequence !== null && ($editedSequence.oldSequence = structuredClone($editedSequence.sequence));
	sequenceEntries.set($sequenceEntries);
	editedSequence.set(null);
}

/**
 * Delete a sequence.
 * 
 * @param sequenceId - The ID of the sequence to delete
 */
export const deleteSequence = async (sequenceId: string) => {
	const index = $sequenceEntries.findIndex((sequence) => sequence.id === sequenceId);
	const sequenceName = $sequenceEntries[index].sequence.name;
	if (!confirm("Delete sequence " + sequenceName + "?")) {
		return;
	}

	const deleteResponse = await fetch(`/api/sequences/id/${sequenceId}`, {
		method: "DELETE",
	});

	if (!deleteResponse.ok) {
		alert("Could not delete sequence");
		return;
	}

	alert("Deleted sequence " + sequenceName);
	$sequenceEntries.splice(index, 1);
	sequenceEntries.set($sequenceEntries);
}