<script lang="ts">
import DatabaseEdit from "$lib/components/DatabaseEdit.svelte";
import DatabaseUpload from "$lib/components/DatabaseUpload.svelte";
import DatabaseView from "$lib/components/DatabaseView.svelte";

import { user } from "$lib/stores/user";
</script>

<div id="landing-page" class="mb-5">
  {#if $user}
    <DatabaseView />
    <DatabaseEdit />
    <DatabaseUpload />
  {:else}
    <p class="text-center">Welcome. Please log in to view the database.</p>
  {/if}
</div>

<style>
#landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
