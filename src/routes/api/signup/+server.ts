import type { SupabaseClient } from "@supabase/supabase-js";
import supabaseAdmin from "$lib/services/supabaseServerClient.server";
import { response, responseJSON } from "$lib/utils/responses";
import { VALID_EMAIL, VALID_FIRST_NAME, VALID_LAST_NAME, VALID_PASSWORD } from "$lib/utils/validation";

/**
 * POST a new user to the server.
 */
export async function POST({ request, locals: { supabase } }: { request: Request, locals: { supabase: SupabaseClient } }) {
	const userData = await request.json();
	const email = userData.email as string;
	const password = userData.password as string;
	const firstName = userData.firstName as string;
	const lastName = userData.lastName as string;

	if (!email || !password || !firstName || !lastName) {
		return responseJSON(400, { message: "Missing required fields" });
	}

	if (!VALID_EMAIL(email) || !VALID_PASSWORD(password) || !VALID_FIRST_NAME(firstName) || !VALID_LAST_NAME(lastName)) {
		return responseJSON(400, { message: "Invalid input" });
	}

	const { data, error } = await supabase.auth.signUp({
		email, password, options: {
			data: {
				first_name: firstName,
				last_name: lastName
			}
		}
	});

	if (error) {
		return responseJSON(error.status ?? 500, { message: error.message });
	}

	if (data?.user) {
		const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(data.user.id);
		if (userData?.user === null) {
			await supabase.auth.signInWithOtp({
				email
			});
		}
	}

	return response(200);
}