<script lang="ts">
import editedSequence from "$lib/stores/editedSequence";
import { saveEdits, cancelEdits } from "$lib/utils/sequence.client";
</script>

<!-- QUESTION: Allow editing of files? If so, add remove delete multiple files. Should we store previous versions of a 
	database entry? -->
{#if $editedSequence}
  <div id="database-edit" class="mb-4">
    <h2 class="mb-3">Edit Sequence</h2>
    <label for="edit-sequence-name" class="mb-2">Sequence Name</label>
    <input
      type="text"
      id="edit-sequence-name"
      class="form-control mb-3"
      placeholder={"Original name: " + $editedSequence.oldSequence.name}
      bind:value={$editedSequence.sequence.name}
    />
    <label for="edit-sequence-description" class="mb-2">Sequence Description</label>
    <textarea
      id="edit-sequence-description"
      class="form-control"
      placeholder={"Original description:\n" + $editedSequence.oldSequence.description}
      bind:value={$editedSequence.sequence.description}
    />
    <div class="mt-4 d-flex w-100 justify-content-end">
      <button type="button" class="btn btn-danger me-3" on:click={() => cancelEdits(false)}>
        Cancel Edits
      </button>
      <button type="button" class="btn btn-success" on:click={saveEdits}>Save Edits</button>
    </div>
  </div>
{/if}

<style>
#database-edit {
  width: 95%;
}

#database-edit textarea {
  min-height: max(200px, 30vh);
  max-height: min(400px, 60vh);
  vertical-align: top;
}
</style>
