<script>
import { supabase } from "$lib/services/supabaseClient";
import { onMount } from "svelte";

import { retrieveSession, session, user } from "$lib/stores/user";
import TextButton from "$lib/components/utils/TextButton.svelte";

import "$lib/styles/global.css";

onMount(() => {
  retrieveSession();
});

const logout = async () => {
  await supabase.auth.signOut();
  $user = null;
	$session = null;
};
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Virus Database Web Client</a>
    <span class="navbar-text me-2">
      {#if $user}
        <span class="me-2">
          Hello, {$user.user_metadata.first_name}!
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
