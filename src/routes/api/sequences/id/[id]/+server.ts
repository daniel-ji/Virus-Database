import { supabase } from '$lib/services/supabaseClient.server';
import { DESCRIP_LIMIT, NAME_LIMIT } from '$lib/utils/constants';
import { response, responseJSON } from '$lib/utils/utils';
import type { Sequence } from '$lib/types/sequences.interface';

export async function GET({ params }: { params: { id: string } }) {
	const { id } = params;

	const { data, error }: { data: Sequence | null, error: any } = await supabase.from("sequences").select("*").eq("id", id).single();

	if (error) {
		return responseJSON(500, { message: error.message });
	}

	if (!data) {
		return responseJSON(404, { message: `Sequence ${id} not found` });
	}

	return responseJSON(200, data);
}

export async function PATCH({ request }: { request: Request }) {
	const id = request.url.split("/").slice(-1)[0];
	const { name, description } = await request.json();

	if (!name) {
		return responseJSON(400, { message: `Missing required fields` });
	}

	if (name.length < 0 || name.length > NAME_LIMIT) {
		return responseJSON(400, { message: `Invalid name length` });
	}

	if (description !== undefined && description.length > DESCRIP_LIMIT) {
		return responseJSON(400, { message: `Invalid description length` });
	}

	const { data, error }: { data: Sequence | null, error: any } = await supabase.from("sequences").update({ name, description }).eq("id", id);

	if (error) {
		return responseJSON(500, { message: error.message });
	}

	return response(200);
}