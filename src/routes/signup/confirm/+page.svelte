<script>
import { onMount } from "svelte";
import { browser } from "$app/environment";

if (browser) {
  onMount(async () => {
		setTimeout(() => {
			window.location.href = "/dashboard";
		}, 2000);
  });
}
</script>

<div class="w-100 mt-5 text-center">
  <h4>Email confirmed! Redirecting to dashboard...</h4>
</div>
