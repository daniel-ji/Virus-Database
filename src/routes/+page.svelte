<script lang="ts">
import { page } from "$app/stores";
import { Role } from "$lib/utils/auth";
</script>

<div id="landing-page" class="mb-5">
  {#if $page.data.session}
		<h2 class="text-center mb-3">Welcome, {$page.data.session?.user.user_metadata.first_name}!</h2>
		<p class="text-center mb-2">You can now view the database <a href="/dashboard">here</a>.</p>
		{#if $page.data.session.user.user_metadata.role === Role.ADMIN}
			<p class="text-center mt-0">You are an admin. Manage users <a href="/admin-dashboard">here</a>.</p>
		{/if}
  {:else}
    <p class="text-center">Welcome. Please <a href="/login">log in</a> or <a href="/signup">sign up</a> to view the database.</p>
  {/if}
</div>

<style>
#landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
