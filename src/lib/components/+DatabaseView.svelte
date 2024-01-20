<script lang="ts">
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
    sequences = await sequencesResponse.json() as Sequence[];
		console.log(sequences)
  }
</script>

<div id="database-view" class="w-75 d-flex align-items-start flex-column mb-4">
	<h2 class="text-center mb-3">Database View</h2>
  <table class="table table-bordered w-100">
    <thead>
      <tr>
        <th>Sequence Name</th>
        <th>Sequence Description</th>
        <th>Sequence</th>
      </tr>
    </thead>
    <tbody>
      <!-- TODO: add key -->
      {#each sequences as sequence}
        <tr>
          <td>{sequence.name}</td>
          <td>{sequence.description}</td>
          <td>{sequence.sequence_path}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
