<script lang="ts">
import { onMount } from "svelte";
import { browser } from "$app/environment";

import TextButton from "$lib/components/utils/TextButton.svelte";

import editedSequence from "$lib/stores/editedSequence";
import sequenceEntries from "$lib/stores/sequenceEntries";
import { currentSortField, currentSortOrder } from "$lib/stores/sortView";
import { IS_TEXT_FILE_NAME } from "$lib/utils/constants";

// import {
//   PencilSquare,
//   XSquare,
//   CheckSquare,
//   CloudDownload,
//   Trash,
//   ArrowDownUp,
//   ArrowUp,
//   ArrowDown,
// } from "svelte-bootstrap-icons";

import PencilSquare from "svelte-bootstrap-icons/lib/PencilSquare.svelte";
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
  sortViewBy,
  fetchSequence,
} from "$lib/utils/sequence.client";

const DATABASE_VIEW_FIELDS = [
  { field: "name", viewName: "Sequence Name" },
  { field: "description", viewName: "Sequence Description" },
  { field: "filename", viewName: "Sequence File" },
  { field: "created_at", viewName: "Upload Date" },
  { field: "updated_at", viewName: "Last Modified" },
];

if (browser) {
  onMount(async () => {
    await getSequences();
    sortViewBy($currentSortField, true);
  });
}

let previewText: string = "";

const previewSequence = async (sequenceId: string) => {
  const index = $sequenceEntries.findIndex((entry) => entry.id === sequenceId);
  if (!IS_TEXT_FILE_NAME($sequenceEntries[index].sequence.filepath)) {
    alert("Cannot preview non-text files.");
    return;
  }

  if ($sequenceEntries[index].sequence.file_preview) {
    previewText = $sequenceEntries[index].sequence.file_preview ?? "";
  } else {
    const filepath = $sequenceEntries[index].sequence.filepath;
    const sequenceFile = await fetchSequence(filepath, 100);
    previewText = await (await sequenceFile.blob()).text();
    $sequenceEntries[index].sequence.file_preview = previewText;
    $sequenceEntries = $sequenceEntries;
  }

  window.addEventListener("keydown", escClosePreview);
  document.body.classList.add("modal-open");
};

const closePreview = () => {
  previewText = "";
  document.body.classList.remove("modal-open");
  window.removeEventListener("keydown", escClosePreview);
};

const escClosePreview = (event: any) => {
  if (event.key === "Escape") {
    closePreview();
  }
};
</script>

<div id="database-view" class="d-flex align-items-start flex-column mb-4">
  <h2 class="mb-3">Database View</h2>
  <table class="table table-bordered w-100">
    <thead>
      <tr>
        {#each DATABASE_VIEW_FIELDS as field}
          <th>
            <div class="d-flex flex-row justify-content-between align-items-center">
              <span>{field.viewName}</span>
              <TextButton
                callback={() => sortViewBy(field.field)}
                style="p-1 {$currentSortField === field.field ? 'text-primary' : 'text-secondary'}"
              >
                {#if $currentSortField === field.field}
                  {#if $currentSortOrder === 1}
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
            <XSquare />
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
