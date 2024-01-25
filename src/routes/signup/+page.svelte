<script lang="ts">
import { VALID_PASSWORD } from "$lib/utils/constants";

let firstName: string = "";
let firstNameEdited: boolean = false;
$: firstNameValid = (firstName.length > 0 && firstName.length < 50) || !firstNameEdited;

let lastName: string = "";
let lastNameEdited: boolean = false;
$: lastNameValid = (lastName.length > 0 && lastName.length < 50) || !lastNameEdited;

let email: string = "";
let emailEdited: boolean = false;
$: emailValid = (email.length > 0 && email.length < 50) || !emailEdited;

let password: string = "";
let passwordEdited: boolean = false;
$: passwordValid = VALID_PASSWORD(password) || !passwordEdited;

let confirmPassword: string = "";
let confirmPasswordEdited: boolean = false;
$: confirmPasswordValid =
  (confirmPassword.length > 0 && confirmPassword === password) || !confirmPasswordEdited;

async function signUp() {
  if (
    firstNameValid &&
    firstNameEdited &&
    lastNameValid &&
    lastNameEdited &&
    emailValid &&
    emailEdited &&
    passwordValid &&
    passwordEdited &&
    confirmPasswordValid &&
    confirmPasswordEdited
  ) {
    const body = {
      firstName,
      lastName,
      email,
      password,
    };

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      alert("Signed up successfully. Please check your email to verify your account.");
    } else {
      alert("Failed to sign up.");
    }
  } else {
    firstNameEdited = true;
    lastNameEdited = true;
    emailEdited = true;
    passwordEdited = true;
    confirmPasswordEdited = true;
  }
}
</script>

<div id="sign-up" class="mb-5">
  <h1 class="mb-4">Database Sign Up</h1>

  <div id="sign-up-form" class="px-5 pt-4 pb-5">
    <div class="d-flex justify-content-between">
      <div class="me-4">
        <label for="first-name" class="form-label">First Name</label>
        <input
          id="first-name"
          type="text"
          class="form-control {firstNameValid ? '' : 'is-invalid'}"
          placeholder="First Name"
          on:input={() => (firstNameEdited = true)}
          bind:value={firstName}
        />
        <div class="invalid-feedback">Please enter a valid first name.</div>
      </div>
      <div>
        <label for="last-name" class="form-label">Last Name</label>
        <input
          id="last-name"
          type="text"
          class="form-control {lastNameValid ? '' : 'is-invalid'}"
          placeholder="Last Name"
          on:input={() => (lastNameEdited = true)}
          bind:value={lastName}
        />
        <div class="invalid-feedback">Please enter a valid last name.</div>
      </div>
    </div>
		<div>
			<label for="email" class="form-label mt-3">Email</label>
			<input
				id="email"
				type="text"
				class="form-control {emailValid ? '' : 'is-invalid'}"
				placeholder="Email"
				on:input={() => (emailEdited = true)}
				bind:value={email}
			/>
			<div class="invalid-feedback">Please enter a valid email.</div>
		</div>
		<div>
			<label for="password" class="form-label mt-3">Password</label>
			<input
				id="password"
				type="password"
				class="form-control {passwordValid ? '' : 'is-invalid'}"
				placeholder="Password"
				on:input={() => (passwordEdited = true)}
				bind:value={password}
			/>
			<div class="invalid-feedback">
				<span class="small">
					Please enter a valid password (12 characters, 1 number, 1 uppercase letter, 1 lowercase
					letter).
				</span>
			</div>
		</div>
		<div>
			<label for="confirm-password" class="form-label mt-3">Confirm Password</label>
			<input
				id="confirm-password"
				type="password"
				class="form-control {confirmPasswordValid ? '' : 'is-invalid'}"
				placeholder="Confirm Password"
				on:input={() => (confirmPasswordEdited = true)}
				bind:value={confirmPassword}
			/>
			<div class="invalid-feedback">Please enter the same password.</div>
		</div>
    <button class="btn btn-primary w-100 mt-4" on:click={signUp}>Sign Up</button>
  </div>
</div>

<style>
#sign-up {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#sign-up-form {
  border: 1px solid black;
  border-radius: 5px;
}
</style>
