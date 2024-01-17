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
    const sequencesResponse = await fetch("/api/sequences/all");
    if (!sequencesResponse.ok) {
      return;
    }
    sequences = await sequencesResponse.json();
  }
</script>

<div id="content">
  <h1 class="w-100 text-center my-4">Virus Database Web Client</h1>

  <table class="table table-bordered w-75">
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
          <td>{sequence.sequence}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
	#content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
