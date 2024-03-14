import supabaseAdmin from "$lib/services/supabaseServerClient.server";
import type { UserData } from "$lib/types/user.interface";
import { responseJSON } from "$lib/utils/responses";
import { VALID_POSITIVE_INT } from "$lib/utils/validation";

/**
 * GET all users from the server.
 */
export const GET = async ({ url }: { url: URL }) => {
	const page = url.searchParams.get('page') ?? "1";
	const result = await supabaseAdmin.auth.admin.listUsers({
		page: VALID_POSITIVE_INT(page) ? parseInt(page) : 1,
		perPage: 1000
	})

	if (result.error) {
		return responseJSON(500, { message: result.error.message });
	}

	if (!result.data?.users) {
		return responseJSON(404, { message: `Sequences not found` });
	}

	const filteredUsers : UserData[] = result.data.users.map((user) => {
		return {
			id: user.id,
			first_name: user.user_metadata.first_name ?? "N/A",
			last_name: user.user_metadata.last_name ?? "N/A",
			role: user.user_metadata.role ?? "user",
			email: user.email	?? "N/A",
			email_verified: user.user_metadata.email_verified as boolean,
			last_sign_in_at: user.last_sign_in_at
		}
	});

	return responseJSON(200, filteredUsers);
}