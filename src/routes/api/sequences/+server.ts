import { supabase } from "$lib/services/supabaseClient.server";
import { NAME_LIMIT, DESCRIP_LIMIT, FILE_SIZE_LIMIT } from "$lib/utils/constants";
import { response, responseJSON } from "$lib/utils/utils";
import type { Sequence } from "$lib/types/sequences.interface";

export async function GET() {
	const { data, error }: { data: Sequence[] | null, error: any } = await supabase.from("sequences").select("*");

	if (error) {
		return responseJSON(500, { message: error.message });
	}

	if (!data) {
		return responseJSON(404, { message: `Sequences not found` });
	}

	return responseJSON(200, data);
}

// TODO: improve validation, upload to user folder
export async function POST({ request }: { request: Request }) {
	const formData = Object.fromEntries(await request.formData());
	const name = formData.name as string;
	const description = formData.description as string;
	const sequence = formData.sequenceFile as File;

	if (!name || !sequence) {
		return responseJSON(400, { message: `Missing required fields` });
	}

	if (name.length < 0 || name.length > NAME_LIMIT) {
		return responseJSON(400, { message: `Invalid name length` });
	}

	if (description.length < 0 || description.length > DESCRIP_LIMIT) {
		return responseJSON(400, { message: `Invalid description length` });
	}

	if (sequence.size > FILE_SIZE_LIMIT) {
		return responseJSON(400, { message: `File size limit exceeded` });
	}

	const { data: uploadData, error: uploadError } = await supabase.storage.from("sequences").upload(sequence.name, sequence);

	if (uploadError) {
		return responseJSON(500, { message: uploadError.message });
	}

	const { data: insertData, error: insertError } = await supabase.from("sequences").insert({ name, description, filename: sequence.name, filepath: uploadData.path })

	if (insertError) {
		// delete file if insert fails
		await supabase.storage.from("sequences").remove([uploadData.path]);
		return responseJSON(500, { message: insertError.message });
	}

	return response(200);
}