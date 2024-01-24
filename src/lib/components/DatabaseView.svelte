<script lang="ts">
import { onMount } from "svelte";
import { browser } from "$app/environment";

import TextButton from "$lib/components/utils/TextButton.svelte";

import editedSequence from "$lib/stores/editedSequence";
import sequenceEntries from "$lib/stores/sequenceEntries";

import {
  PencilSquare,
  XSquare,
  CheckSquare,
  CloudDownload,
  Trash,
  ArrowDownUp,
  ArrowUp,
  ArrowDown,
} from "svelte-bootstrap-icons";

import {
  downloadSequence,
  editSequence,
  cancelEdits,
  saveEdits,
  getSequences,
  deleteSequence,
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
    sortBy(currentSortField, true);
  });
}

let currentSortField: string = "name";
let sortOrder = 1; // 1 for descending, -1 for ascending

const sortBy = (field: string, forceSortDesc: boolean = false) => {
  if (forceSortDesc) {
    sortOrder = 1;
  } else if (field === currentSortField) {
    sortOrder *= -1;
  } else {
    currentSortField = field;
    sortOrder = 1;
  }

  $sequenceEntries.sort((a, b) => {
    if (a.sequence[field] < b.sequence[field]) {
      return sortOrder * -1;
    }
    if (a.sequence[field] > b.sequence[field]) {
      return sortOrder;
    }
    return 0;
  });

  $sequenceEntries = $sequenceEntries;
};

// TODO: implement
const previewSequence = async (sequenceId: string) => {};
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
                callback={() => sortBy(field.field)}
                style="p-1 {currentSortField === field.field ? 'text-primary' : 'text-secondary'}"
              >
                {#if currentSortField === field.field}
                  {#if sortOrder === 1}
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
              <TextButton callback={() => cancelEdits(false)} style="p-1 text-danger">
                <XSquare />
              </TextButton>
              <TextButton callback={saveEdits} style="p-1 text-success">
                <CheckSquare />
              </TextButton>
            {:else}
              <TextButton callback={() => editSequence(entry.id)}>
                <PencilSquare />
              </TextButton>
            {/if}
          </td>
          <td class="database-view-link text-center">
            <TextButton callback={() => downloadSequence(entry.sequence.filepath)} style="p-1">
              <CloudDownload />
            </TextButton>
          </td>
          <td class="database-view-link text-center">
            <TextButton callback={() => deleteSequence(entry.id)} style="p-1 text-danger">
              <Trash />
            </TextButton>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
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
</style>
