<script lang="ts">
  import FileSaver from "file-saver";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import type { Sequence } from "$lib/types/sequences.interface";

  let sequences: Sequence[] = [];

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
  }

  async function downloadSequence(filepath: string) {
    const escapedFilepath = encodeURIComponent(filepath);
    const downloadResponse = await fetch(
      `/api/sequences/filepath/${escapedFilepath}`,
    );

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
      </tr>
    </thead>
    <tbody>
      {#each sequences as sequence (sequence.id)}
        <tr>
          <td>{sequence.name}</td>
          <td><div class="database-view-description">{sequence.description}</div></td>
          <td
            ><a
              href=""
              class="link-offset-2"
              on:click={() => downloadSequence(sequence.filepath)}
              >{sequence.filename}</a
            ></td
          >
          <td>{new Date(sequence.created_at).toLocaleString()}</td>
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
</style>