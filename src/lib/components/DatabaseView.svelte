<script lang="ts">
import { onMount } from "svelte";
import { browser } from "$app/environment";

import Link from "$lib/components/utils/Link.svelte";

import editedSequence from "$lib/stores/editedSequence";
import sequenceEntries from "$lib/stores/sequenceEntries";

import { PencilSquare, XSquare, CheckSquare, CloudDownload, Trash } from "svelte-bootstrap-icons";

import {
  downloadSequence,
  editSequence,
  cancelEdits,
  saveEdits,
	getSequences,
	deleteSequence,
} from "$lib/utils/sequence.client";

if (browser) {
  onMount(getSequences);
}

// TODO: implement
const previewSequence = async (sequenceId: string) => {};
</script>

<div id="database-view" class="d-flex align-items-start flex-column mb-4">
  <h2 class="mb-3">Database View</h2>
  <table class="table table-bordered w-100">
    <thead>
      <tr>
        <th>Sequence Name</th>
        <th>Sequence Description</th>
        <th>Sequence File</th>
        <th>Upload Date</th>
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
            <Link callback={() => previewSequence(entry.id)} content={entry.sequence.filename} />
          </td>
          <td>{new Date(entry.sequence.created_at).toLocaleString()}</td>
          <td class="database-view-link text-center">
            {#if $editedSequence && $editedSequence.id === entry.id}
              <Link callback={() => cancelEdits(false)} style="p-1 text-danger">
                <XSquare />
              </Link>
              <Link callback={saveEdits} style="p-1 text-success">
                <CheckSquare />
              </Link>
            {:else}
              <Link callback={() => editSequence(entry.id)}>
                <PencilSquare />
              </Link>
            {/if}
          </td>
          <td class="database-view-link text-center">
            <Link callback={() => downloadSequence(entry.sequence.filepath)} style="p-1">
              <CloudDownload />
            </Link>
          </td>
					<td class="database-view-link text-center">
						<Link callback={() => deleteSequence(entry.id)} style="p-1 text-danger">
							<Trash />
						</Link>
					</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
#database-view {
  width: 90%;
}

#database-view td {
  max-width: 30vw;
  word-break: break-all;
}

.database-view-description {
  overflow: auto;
  max-height: 5rem;
}

.database-view-link {
  color: rgb(13, 110, 253);
}
</style>
