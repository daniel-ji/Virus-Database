import { response, responseJSON } from '$lib/utils/responses';
import supabaseAdmin from '$lib/services/supabaseServerClient.server';

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
export async function DELETE({ request }: { request: Request }) {
	const urlSegments = new URL(request.url).pathname.split("/");
	const id = urlSegments.pop() || urlSegments.pop(); // get the last segment of the URL (the ID), account for trailing slash

	if (!id) {
		return responseJSON(400, { message: "No user ID provided" });
	}

	const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);

	if (error) {
		return responseJSON(500, { message: error.message });
	}

	return response(204);
}