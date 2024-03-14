<script>
import DatabaseEdit from "$lib/components/DatabaseEdit.svelte";
import DatabaseUpload from "$lib/components/DatabaseUpload.svelte";
import DatabaseView from "$lib/components/DatabaseView.svelte";
</script>

<div id="dashboard" class="mb-5">
	<h2 class="mb-3 w-100 text-center">Sequence Database</h2>
  <DatabaseView />
  <DatabaseEdit />
  <DatabaseUpload />
</div>

<style>
#dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
