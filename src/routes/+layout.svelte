<script>
import { invalidate } from "$app/navigation";
import { onMount } from "svelte";
import TextButton from "$lib/components/utils/TextButton.svelte";

import "$lib/styles/global.css";

export let data;
let { supabase, session } = data;
$: ({ supabase, session } = data);

onMount(() => {
	// invalidate the session if it changes
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, _session) => {
    if (_session?.expires_at !== session?.expires_at) {
      invalidate("supabase:auth");
    }
  });

  return () => subscription.unsubscribe();
});

const logout = async () => {
  const { error } = await supabase.auth.signOut();
	if (error) {
		return alert("Error logging out: " + error.message);
	}
  alert("Logged out successfully. Redirecting to home page...");
  window.location.href = "/";
};
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Virus Database Web Client</a>
    <span class="navbar-text me-2">
      {#if session}
        <span class="me-2">
          Hello, {session.user.user_metadata.first_name}!
        </span>
        <TextButton callback={logout} style="underline">Log Out</TextButton>
      {:else}
        <a href="/login">Log In</a>
        <a href="/signup">Sign Up</a>
      {/if}
    </span>
  </div>
</nav>

<div id="content" class="mt-4">
  <slot />
</div>

<style>
.navbar-text {
  color: white;
}
</style>
