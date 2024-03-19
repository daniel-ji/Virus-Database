import { response, responseJSON } from '$lib/utils/responses';
import supabaseAdmin from '$lib/services/supabaseServerClient.server';
import type { Session } from '@supabase/supabase-js';

/**
 * GET a user entry from the server by its id.
 */
export async function GET({ params }: { params: { id: string } }) {
	const { id } = params;

	const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);

	if (error) {
		return responseJSON(500, { message: error.message });
	}

	if (!data) {
		return responseJSON(404, { message: `Sequence ${id} not found` });
	}

	return responseJSON(200, data);
}


/**
 * DELETE a user entry from the server by its id.
 */
export async function DELETE({ request, locals }: { request: Request, locals: App.Locals }) {
	const urlSegments = new URL(request.url).pathname.split("/");
	const id = urlSegments.pop() || urlSegments.pop(); // get the last segment of the URL (the ID), account for trailing slash

	if (!id) {
		return responseJSON(400, { message: "No user ID provided." });
	}

	const session : Session | null = await locals.getSession();

	if (session?.user.id === id) {
		return responseJSON(403, { message: "You cannot delete yourself in this view. Please go to your profile to delete your account." });
	}

	const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);

	if (error) {
		return responseJSON(500, { message: "Failed to delete user." });
	}

	return response(204);
}