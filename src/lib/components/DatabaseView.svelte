<script lang="ts">
import FileSaver from "file-saver";
import { onMount } from "svelte";
import { browser } from "$app/environment";

import type { Sequence } from "$lib/types/sequences.interface";
import Link from "$lib/components/utils/Link.svelte";

import PencilSquare from "svelte-bootstrap-icons/lib/PencilSquare.svelte";
import CloudDownload from "svelte-bootstrap-icons/lib/CloudDownload.svelte";

let sequences: Sequence[] = [];
let sequencesState: Map<string, string> = new Map();
enum SequenceState {
  EDITING = "editing",
  SAVED = "saved",
}

if (browser) {
  onMount(async () => {
    getSequences();
  });
}

async function getSequences() {
  const sequencesResponse = await fetch("/api/sequences");
  if (!sequencesResponse.ok) {
    return;
  }
  sequences = (await sequencesResponse.json()) as Sequence[];
  sequencesState = new Map(sequences.map((sequence) => [sequence.id, SequenceState.SAVED]));
  console.log(sequencesState);
}

async function downloadSequence(filepath: string) {
  const escapedFilepath = encodeURIComponent(filepath);
  const downloadResponse = await fetch(`/api/sequences/filepath/${escapedFilepath}`);

  if (!downloadResponse.ok) {
    alert("Could not download sequence");
    return;
  }

  FileSaver.saveAs(await downloadResponse.blob(), filepath);
}
</script>

<div id="database-view" class="d-flex align-items-start flex-column mb-4">
  <h2 class="text-center mb-3">Database View</h2>
  <table class="table table-bordered w-100">
    <thead>
      <tr>
        <th>Sequence Name</th>
        <th>Sequence Description</th>
        <th>Sequence File</th>
        <th>Upload Date</th>
        <th class="text-center">Edit</th>
        <th class="text-center">Save</th>
      </tr>
    </thead>
    <tbody>
      {#each sequences as sequence (sequence.id)}
        <tr>
          <td>{sequence.name}</td>
          <td>
            <div class="database-view-description">{sequence.description}</div>
          </td>
          <td class="database-view-link link-offset-2">
            <Link callback={() => previewSequence(sequence.id)} content={sequence.name} />
          </td>
          <td>{new Date(sequence.created_at).toLocaleString()}</td>
          <td class="database-view-link text-center">
            <Link callback={() => editSequence(sequence.id)}><PencilSquare /></Link>
          </td>
          <td class="database-view-link text-center">
            <Link callback={() => downloadSequence(sequence.filepath)}><CloudDownload /></Link>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
#database-view {
  width: 85%;
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
  text-decoration: underline;
}
</style>
