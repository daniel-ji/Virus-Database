import { supabase } from "$lib/supabaseClient.server";
import { response } from "$lib/utils";
import type { Sequence } from "$lib/types/sequences.interface";

export async function GET() {
	const { data, error }: { data: Sequence[] | null, error: any } = await supabase.from("sequences").select("*");

	if (error) {
		return response(500, { message: error.message });
	}

	if (!data) {
		return response(404, { message: `Sequences not found` });
	}

	return response(200, data);

}

// TODO: improve validation, upload to user folder
// TODO: generate random uuid for file name
export async function POST({ request }: { request: Request }) {
	const formData = Object.fromEntries(await request.formData());
	const name = formData.name;
	const description = formData.description;
	const sequence = formData.sequenceFile as File;

	if (!name || !description || !sequence) {
		return response(400, { message: `Missing required fields` });
	}

	const { data: uploadData, error: uploadError } = await supabase.storage.from("sequences").upload(sequence.name, sequence);

	if (uploadError) {
		return response(500, { message: uploadError.message });
	}

	const { data: insertData, error: insertError } = await supabase.from("sequences").insert({ name, description, sequence: uploadData.path })

	if (insertError) {
		return response(500, { message: insertError.message });
	}

	return response(200, insertData);

}