<script lang="ts">
import { onMount } from "svelte";
import { get } from "svelte/store";
import { browser } from "$app/environment";

import TextButton from "$lib/components/utils/TextButton.svelte";

import editedSequence from "$lib/stores/editedSequence";
import sequenceEntries from "$lib/stores/sequenceEntries";
import { SEQUNECE_SORT_SUBFIELD, currentSequencesSortField, currentSequencesSortOrder } from "$lib/stores/sortView";
import { IS_TEXT_FILE_NAME } from "$lib/utils/validation";

import PencilSquare from "svelte-bootstrap-icons/lib/PencilSquare.svelte";
import X from "svelte-bootstrap-icons/lib/X.svelte";
import XSquare from "svelte-bootstrap-icons/lib/XSquare.svelte";
import CheckSquare from "svelte-bootstrap-icons/lib/CheckSquare.svelte";
import CloudDownload from "svelte-bootstrap-icons/lib/CloudDownload.svelte";
import Trash from "svelte-bootstrap-icons/lib/Trash.svelte";
import ArrowDownUp from "svelte-bootstrap-icons/lib/ArrowDownUp.svelte";
import ArrowUp from "svelte-bootstrap-icons/lib/ArrowUp.svelte";
import ArrowDown from "svelte-bootstrap-icons/lib/ArrowDown.svelte";

import {
  downloadSequence,
  editSequence,
  cancelEdits,
  saveEdits,
  getSequences,
  deleteSequence,
  fetchSequence,
} from "$lib/utils/sequence.client";

import { sortViewBy } from "$lib/utils/table.client";

const DATABASE_VIEW_COLUMNS = [
  { field: "name", columnName: "Sequence Name" },
  { field: "description", columnName: "Sequence Description" },
  { field: "filename", columnName: "Sequence File" },
  { field: "created_at", columnName: "Upload Date" },
  { field: "updated_at", columnName: "Last Modified" },
];

if (browser) {
  onMount(async () => {
    await getSequences();
    sortViewBy(currentSequencesSortField, currentSequencesSortOrder, sequenceEntries, get(currentSequencesSortField), SEQUNECE_SORT_SUBFIELD, true);
  });
}

let previewText: string = "";

/**
 * Preview the sequence file. Runs when the user clicks the filename of a sequence (a text link).
 */
// TODO: Store previewed sequences in some cache or IndexedDB
// TODO: Allow loading of more than just the first 10KB of a file
const previewSequence = async (sequenceId: string) => {
  const index = $sequenceEntries.findIndex((entry) => entry.id === sequenceId);
  if (!IS_TEXT_FILE_NAME($sequenceEntries[index].sequence.filepath)) {
    alert("Cannot preview non-text files.");
    return;
  }

  // QUESTION: Should we do this?
  // If the file has already been previewed, don't re-fetch it
  if ($sequenceEntries[index].sequence.file_preview) {
    previewText = $sequenceEntries[index].sequence.file_preview!;
  } else {
    const filepath = $sequenceEntries[index].sequence.filepath;
    const sequenceFile = await fetchSequence(filepath, 100);
    previewText = await (await sequenceFile.blob()).text();
    $sequenceEntries[index].sequence.file_preview = previewText;
    $sequenceEntries = $sequenceEntries; // force reactivity
  }

  window.addEventListener("keydown", escClosePreview);
  document.body.classList.add("modal-open");
};

const closePreview = () => {
  previewText = "";
  document.body.classList.remove("modal-open");
  window.removeEventListener("keydown", escClosePreview);
};

// Close the preview modal when the user presses the escape key
const escClosePreview = (event: any) => {
  if (event.key === "Escape") {
    closePreview();
  }
};
</script>

<div id="database-view" class="d-flex align-items-start flex-column mb-4">
	<h3 class="mb-3">Database View</h3>
  <table class="table table-bordered w-100">
    <thead>
      <tr>
        {#each DATABASE_VIEW_COLUMNS as field}
          <th>
            <div class="d-flex flex-row justify-content-between align-items-center">
              <span>{field.columnName}</span>
              <TextButton
                callback={() => sortViewBy(currentSequencesSortField, currentSequencesSortOrder, sequenceEntries, SEQUNECE_SORT_SUBFIELD, field.field)}
                style="p-1 {$currentSequencesSortField === field.field ? 'text-primary' : 'text-secondary'}"
              >
                {#if $currentSequencesSortField === field.field}
                  {#if $currentSequencesSortOrder === 1}
                    <ArrowUp />
                  {:else}
                    <ArrowDown />
                  {/if}
                {:else}
                  <ArrowDownUp />
                {/if}
              </TextButton>
            </div>
          </th>
        {/each}
        <th class="text-center px-4">&nbsp;Edit&nbsp;</th>
        <th class="text-center">Download</th>
        <th class="text-center">Delete</th>
      </tr>
    </thead>
    <tbody>
      {#each $sequenceEntries as entry (entry.id)}
        <tr>
          <td>{entry.sequence.name}</td>
          <td>
            <div class="database-view-description">{entry.sequence.description}</div>
          </td>
          <td class="database-view-link link-offset-2">
            <TextButton
              callback={() => previewSequence(entry.id)}
              content={entry.sequence.filename}
            />
          </td>
          <td>{new Date(entry.sequence.created_at).toLocaleString()}</td>
          <td
            >{entry.sequence.updated_at === null
              ? "N/A"
              : new Date(entry.sequence.updated_at).toLocaleString()}</td
          >
          <td class="database-view-link text-center">
            {#if $editedSequence && $editedSequence.id === entry.id}
              <TextButton callback={() => cancelEdits(false)} style="text-danger">
                <XSquare />
              </TextButton>
              <TextButton callback={saveEdits} style="text-success">
                <CheckSquare />
              </TextButton>
            {:else}
              <TextButton callback={() => editSequence(entry.id)}>
                <PencilSquare />
              </TextButton>
            {/if}
          </td>
          <td class="database-view-link text-center">
            <TextButton callback={() => downloadSequence(entry.sequence.filepath)}>
              <CloudDownload />
            </TextButton>
          </td>
          <td class="database-view-link text-center">
            <TextButton callback={() => deleteSequence(entry.id)} style="text-danger">
              <Trash />
            </TextButton>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if previewText !== ""}
    <div id="preview-sequence-modal">
      <div id="preview-sequence-container">
        <div
          id="preview-sequence-header"
          class="w-100 d-flex align-items-center justify-content-between"
        >
          <h4>Preview (First 10KB)</h4>
          <TextButton callback={closePreview}>
            <X />
          </TextButton>
        </div>
        <hr />
        <pre>{previewText}</pre>
      </div>
    </div>
  {/if}
</div>

<style>
#database-view {
  width: 95%;
}

#database-view th {
  user-select: none;
}

#database-view td {
  max-width: 25vw;
  word-break: break-all;
  vertical-align: middle;
}

#database-view th {
  user-select: none;
}

.database-view-description {
  overflow: auto;
  max-height: 5rem;
}

.database-view-link {
  color: rgb(13, 110, 253);
}

#preview-sequence-modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#preview-sequence-container {
  width: 80%;
  height: 80%;
  background-color: white;
  padding: 1rem;
  overflow: auto;
}
</style>
