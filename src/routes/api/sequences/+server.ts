import type { SupabaseClient } from "@supabase/supabase-js";
import { FILE_SIZE_LIMIT, VALID_SEQUENCE_NAME, VALID_DESCRIPTION } from "$lib/utils/validation";
import { responseJSON } from "$lib/utils/responses";
import type { Sequence } from "$lib/types/sequences.interface";

/**
 * GET all sequences from the server.
 */
export const GET = async ({ url, locals: { supabase } }: { url: URL, locals: { supabase: SupabaseClient } }) => {
	const { data, error }: { data: Sequence[] | null, error: any } = await supabase.from("sequences").select("*");

	if (error) {
		return responseJSON(500, { message: error.message });
	}

	if (!data) {
		return responseJSON(404, { message: `Sequences not found` });
	}

	return responseJSON(200, data);
}

/**
 * POST a new sequence to the server.
 */
// TODO: upload to user folder
export const POST = async ({ request, locals: { supabase } }: { request: Request, locals: { supabase: SupabaseClient } }) => {
	const formData = Object.fromEntries(await request.formData());
	const name = formData.name as string;
	const description = formData.description as string;
	const sequence = formData.sequenceFile as File;

	if (!name || !sequence) {
		return responseJSON(400, { message: `Missing required fields` });
	}

	if (!VALID_SEQUENCE_NAME(name) || !VALID_DESCRIPTION(description)) {
		return responseJSON(400, { message: `Invalid input` });
	}

	if (sequence.size > FILE_SIZE_LIMIT) {
		return responseJSON(400, { message: `File size limit exceeded` });
	}

	const { data: uploadData, error: uploadError } = await supabase.storage.from("sequences").upload(sequence.name, sequence);

	if (uploadError) {
		return responseJSON(500, { message: uploadError.message });
	}

	const { data: insertData, error: insertError } = await supabase.from("sequences").insert({ name, description, filename: sequence.name, filepath: uploadData.path }).select();

	if (insertError) {
		// delete file if insert fails
		await supabase.storage.from("sequences").remove([uploadData.path]);
		return responseJSON(500, { message: insertError.message });
	}

	return responseJSON(200, insertData);
}