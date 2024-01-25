import type { SupabaseClient } from '@supabase/supabase-js';
import { DESCRIP_LIMIT, NAME_LIMIT } from '$lib/utils/constants';
import { response, responseJSON } from '$lib/utils/utils';
import type { Sequence } from '$lib/types/sequences.interface';

export async function GET({ params, locals: { supabase } }: { params: { id: string }, locals: { supabase: SupabaseClient } }) {
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

export async function PATCH({ request, locals: { supabase } }: { request: Request, locals: { supabase: SupabaseClient } }) {
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

export async function DELETE({ request, locals: { supabase } }: { request: Request, locals: { supabase: SupabaseClient } }) {
	const id = request.url.split("/").slice(-1)[0];

	const { data, error: sequenceError }: { data: Sequence | null, error: any } = await supabase.from("sequences").select("filepath").eq("id", id).single();

	if (!data) {
		return responseJSON(404, { message: `Sequence ${id} not found` });
	}

	if (sequenceError) {
		return responseJSON(500, { message: sequenceError.message });
	}

	const { error: fileError }: { error: any } = await supabase.storage.from("sequences").remove([data.filepath]);

	const { error: deleteError }: { error: any } = await supabase.from("sequences").delete().eq("id", id);

	if (fileError || deleteError) {
		if (fileError) {
			fileError.message = `File error: ${fileError.message} \n`;
		}

		if (deleteError) {
			deleteError.message = `Delete error: ${deleteError.message}`;
		}
		return responseJSON(500, { message: fileError?.message ?? "" + deleteError?.message ?? "" });
	}

	return response(200);
}