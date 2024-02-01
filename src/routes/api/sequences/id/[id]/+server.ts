import type { SupabaseClient } from '@supabase/supabase-js';
import { VALID_DESCRIPTION, VALID_SEQUENCE_NAME } from '$lib/utils/validation';
import { response, responseJSON } from '$lib/utils/responses';
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

// QUESTION: allow for updating the file? if so, do validation
export async function PATCH({ request, locals: { supabase } }: { request: Request, locals: { supabase: SupabaseClient } }) {
	const id = request.url.split("/").slice(-1)[0];
	const { name, description } = await request.json();

	if (!name) {
		return responseJSON(400, { message: `Missing required fields` });
	}

	if (!VALID_SEQUENCE_NAME(name) || (description !== undefined && !VALID_DESCRIPTION(description))) {
		return responseJSON(400, { message: `Invalid input` });
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