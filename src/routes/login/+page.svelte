<script lang="ts">
import { VALID_PASSWORD } from "$lib/utils/constants.js";
import { fail } from "@sveltejs/kit";

export let data;
let { supabase } = data;
$: ({ supabase } = data);

let email: string = "";
let emailEdited: boolean = false;
$: emailValid = (email.length > 0 && email.length < 50) || !emailEdited;

let password: string = "";
let passwordEdited: boolean = false;
$: passwordValid = password.length > 0 || !passwordEdited;

let failedLogin: boolean = false;
let succesfulLogin: boolean = false;

async function login() {
  if (emailValid && emailEdited && passwordValid && passwordEdited) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.status === 400) {
        alert("Invalid email or password.");
        failedLogin = true;
      } else {
        alert("Failed to log in. Please try again later.");
      }
    } else {
      failedLogin = false;
			succesfulLogin = true;
			setTimeout(() => {
				window.location.href = "/dashboard";
			}, 1000);
    }
  } else {
    emailEdited = true;
    passwordEdited = true;
  }
}
</script>

<div id="log-in" class="mb-5">
  <h1 class="mb-4">Database Log In</h1>

  <div id="log-in-form" class="px-5 pt-4 pb-4">
    <label for="email" class="form-label">Email</label>
    <input
      id="email"
      type="text"
      class="form-control {emailValid ? '' : 'is-invalid'}"
      placeholder="Email"
      on:input={() => (emailEdited = true)}
      bind:value={email}
    />
    <label for="password" class="form-label mt-3">Password</label>
    <input
      id="password"
      type="password"
      class="form-control {passwordValid ? '' : 'is-invalid'}"
      placeholder="Password"
      on:input={() => (passwordEdited = true)}
      bind:value={password}
    />
    <button class="btn btn-primary w-100 mt-4 mb-4" on:click={login}>Log In</button>
    {#if failedLogin}
      <div class="text-danger w-100 text-center">Invalid email and/or password.</div>
    {/if}
		{#if succesfulLogin}
			<div class="text-success w-100 text-center">Logged in, redirecting to dashboard...</div>
		{/if}
  </div>
</div>

<style>
#log-in {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#log-in-form {
  width: 400px;
  border: 1px solid black;
  border-radius: 5px;
}
</style>
