<script>
import { page } from "$app/stores";
import DatabaseEdit from "$lib/components/DatabaseEdit.svelte";
import DatabaseUpload from "$lib/components/DatabaseUpload.svelte";
import DatabaseView from "$lib/components/DatabaseView.svelte";

</script>

<div id="dashboard" class="mb-5">
  <DatabaseView supabase={$page.data.supabase}/>
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
