// Functions for CRUD & editing sequences

import FileSaver from "file-saver";
import editedSequence from "$lib/stores/editedSequence";
import sequenceEntries from "$lib/stores/sequenceEntries";
import { currentSortField, currentSortOrder } from "$lib/stores/sortView";
import type { Sequence, SequenceState } from "$lib/types/sequences.interface";

let $currentSortField: string = "name";
let $currentSortOrder: number = 1;
currentSortField.subscribe((value) => {
	$currentSortField = value;
});
currentSortOrder.subscribe((value) => {
	$currentSortOrder = value;
});

let $sequenceEntries: SequenceState[] = [];
let $editedSequence: SequenceState | null = null;
sequenceEntries.subscribe((value) => {
	$sequenceEntries = value;
});
editedSequence.subscribe((value) => {
	$editedSequence = value;
});

const getSequences = async () => {
	const sequencesResponse = await fetch("/api/sequences");
	if (!sequencesResponse.ok) {
		return;
	}
	sequenceEntries.set((await sequencesResponse.json()).map((sequence: Sequence) => ({
		id: sequence.id,
		sequence,
		oldSequence: structuredClone(sequence),
	})));
}

const sortViewBy = (field: string, forceSortDesc: boolean = false) => {
	if (forceSortDesc) {
		currentSortOrder.set(1);
	} else if (field === $currentSortField) {
		currentSortOrder.set($currentSortOrder * -1);
	} else {
		currentSortField.set(field);
		currentSortOrder.set(1);
	}

	$sequenceEntries.sort((a, b) => {
		if (a.sequence[field] < b.sequence[field]) {
			return $currentSortOrder * -1;
		}
		if (a.sequence[field] > b.sequence[field]) {
			return $currentSortOrder;
		}
		return 0;
	});

	sequenceEntries.set($sequenceEntries);
};

const downloadSequence = async (filepath: string) => {
	const escapedFilepath = encodeURIComponent(filepath);
	const downloadResponse = await fetch(`/api/sequences/filepath/${escapedFilepath}`);

	if (!downloadResponse.ok) {
		alert("Could not download sequence");
		return;
	}

	FileSaver.saveAs(await downloadResponse.blob(), filepath);
}

const editSequence = async (sequenceId: string) => {
	if (!cancelEdits(true)) {
		return;
	}

	const index = $sequenceEntries.findIndex((sequence) => sequence.id === sequenceId);

	$sequenceEntries[index].oldSequence = structuredClone($sequenceEntries[index].sequence);
	sequenceEntries.set($sequenceEntries);
	editedSequence.set($sequenceEntries[index]);
}

/**
 * @returns {Boolean} True if edits were cancelled or there were no edits to cancel, false otherwise
 */
const cancelEdits = (forceConfirm: boolean) => {
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
	} else {
		if (confirm("Currently editing a sequence, cancel edits?")) {
			$sequenceEntries[unsavedIndex].sequence = structuredClone(
				$sequenceEntries[unsavedIndex].oldSequence,
			);
			sequenceEntries.set($sequenceEntries);
			editedSequence.set(null);
			return true;
		} else {
			return false;
		}
	}
}

// TODO: validation
const saveEdits = async () => {
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

// TODO: implement
async function deleteSequence(sequenceId: string) {
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

export { downloadSequence, editSequence, cancelEdits, saveEdits, deleteSequence, getSequences, sortViewBy };