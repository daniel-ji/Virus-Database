<script>
import { onMount } from "svelte";
import { browser } from "$app/environment";

import { sortViewBy } from "$lib/utils/table.client";
import {
  USER_SORT_SUBFIELD,
  currentUsersSortField,
  currentUsersSortOrder,
} from "$lib/stores/sortView";

import { getUsers, deleteUser } from "$lib/utils/manage-users.client";
import userEntries from "$lib/stores/userEntries";

import TextButton from "$lib/components/utils/TextButton.svelte";
import Trash from "svelte-bootstrap-icons/lib/Trash.svelte";
import ArrowDown from "svelte-bootstrap-icons/lib/ArrowDown.svelte";
import ArrowUp from "svelte-bootstrap-icons/lib/ArrowUp.svelte";
import ArrowDownUp from "svelte-bootstrap-icons/lib/ArrowDownUp.svelte";

const ADMIN_USERS_COLUMNS = [
  { field: "first_name", columnName: "First Name" },
  { field: "last_name", columnName: "Last Name" },
  { field: "email", columnName: "Email" },
  { field: "role", columnName: "User Role" },
  { field: "email_verified", columnName: "Email Verified" },
  { field: "last_sign_in_at", columnName: "Last Signed In" },
];

if (browser) {
  onMount(async () => {
    await getUsers();
    // sortViewBy($currentSortField, true);
  });
}
</script>

<h3 class="mb-3">Manage Users</h3>
<table class="table table-bordered w-100">
  <thead>
    <tr>
      {#each ADMIN_USERS_COLUMNS as field}
        <th>
          <div class="d-flex flex-row justify-content-between align-items-center">
            <span>{field.columnName}</span>
            <TextButton
              callback={() =>
                sortViewBy(
                  currentUsersSortField,
                  currentUsersSortOrder,
                  userEntries,
                  USER_SORT_SUBFIELD,
                  field.field,
                )}
              style="p-1 {$currentUsersSortField === field.field
                ? 'text-primary'
                : 'text-secondary'}"
            >
              {#if $currentUsersSortField === field.field}
                {#if $currentUsersSortOrder === 1}
                  <ArrowUp />
                {:else}
                  <ArrowDown />
                {/if}
              {:else}
                <ArrowDownUp />
              {/if}
            </TextButton>
          </div>
        </th>
      {/each}
      <th class="text-center">Delete User</th>
    </tr>
  </thead>
  <tbody>
    {#each $userEntries as entry (entry.email)}
      <tr>
        <td>{entry.first_name}</td>
        <td>{entry.last_name}</td>
        <td>{entry.email}</td>
        <td>{entry.role}</td>
        <td>{entry.email_verified ? "Yes" : "No"}</td>
        <td
          >{entry.last_sign_in_at === undefined
            ? "N/A"
            : new Date(entry.last_sign_in_at).toLocaleString()}</td
        >
        <td class="database-view-link text-center">
          <TextButton
            callback={() => deleteUser(entry.id, entry.first_name + " " + entry.last_name)}
            style="text-danger"
          >
            <Trash />
          </TextButton>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
#admin-dashboard th {
  user-select: none;
}
</style>
