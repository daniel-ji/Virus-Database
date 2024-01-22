<script>
import DatabaseUpload from "$lib/components/DatabaseUpload.svelte";
import DatabaseView from "$lib/components/DatabaseView.svelte";
</script>

<div id="landing-page" class="mb-5">
  <h1 class="w-100 text-center mt-4 mb-5">Virus Database Web Client</h1>

  <DatabaseView />
  <DatabaseUpload />
</div>

<style>
#landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
