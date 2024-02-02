<script>
import { onMount } from "svelte";
import { browser } from "$app/environment";
import { page } from "$app/stores";

if (browser) {
  if ($page.url.searchParams.get("error_code") === "401") {
    window.location.href = "/login";
  } else if ($page.url.searchParams.size !== 1 || !$page.url.searchParams.has("code")) {
    window.location.href = "/signup";
  } else {
    onMount(async () => {
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    });
  }
}
</script>

<div class="w-100 mt-5 text-center">
  <h4>Email confirmed! Redirecting to login...</h4>
</div>
