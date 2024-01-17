import { supabase } from "$lib/supabase-client.server";
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