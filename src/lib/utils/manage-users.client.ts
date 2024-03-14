import type { UserData } from "$lib/types/user.interface";
import userEntries from "$lib/stores/userEntries";

let $userEntries: UserData[] = [];
userEntries.subscribe((value) => {
	$userEntries = value;
});

/**
 * Gets users from the server and sets the userEntries store.
 */
export const getUsers = async () => {
	const usersResponse = await fetch("/api/users");
	if (!usersResponse.ok) {
		return;
	}
	const users = await usersResponse.json();

	userEntries.set(users);
}

/**
 * Deletes a user from the server and updates the userEntries store.
 * 
 * @param id - The id of the user to delete
 */
export const deleteUser = async (id: string, name: string) => {
	if (!confirm("Delete user " + name + "?")) {
		return;
	}

	const response = await fetch(`/api/users/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) {
		alert("Failed to delete user");
		return;
	}

	alert("User " + name + " deleted");
	userEntries.set($userEntries.filter((user) => user.id !== id));
}