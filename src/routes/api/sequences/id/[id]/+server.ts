import { supabase } from '$lib/services/supabaseClient.server';
import { responseJSON } from '$lib/utils';
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