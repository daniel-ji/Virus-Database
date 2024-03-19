<script>
import UsersAdd from "$lib/components/UsersAdd.svelte";
import UsersView from "$lib/components/UsersView.svelte";
</script>

<div id="admin-dashboard">
  <h2 class="mb-3 w-100 text-center">Admin Dashboard</h2>
  <UsersView />
	<UsersAdd />
</div>

<style>
#admin-dashboard {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 2.5%;
  width: 95%;
}
</style>
