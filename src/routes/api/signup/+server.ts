import { supabase } from "$lib/services/supabaseClient.server";
import { response, responseJSON } from "$lib/utils/utils";

export async function POST({ request }: { request: Request }) {
	const userData = await request.json();
	const email = userData.email as string;
	const password = userData.password as string;

	if (!email || !password) {
		return responseJSON(400, { message: `Missing required fields` });
	}

	const { data, error } = await supabase.auth.signUp({
		email, password, options: {
			data: {
				first_name: userData.firstName,
				last_name: userData.lastName
			}
		}
	});

	if (error) {
		return responseJSON(error.status ?? 500, { message: error.message });
	}

	return response(200);
}