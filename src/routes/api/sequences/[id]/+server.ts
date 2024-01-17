import { supabase } from '$lib/supabase-client.server';
import { response } from '$lib/utils';
import type { Sequence } from '$lib/types/sequences.interface';

export async function GET({ params }: { params: { id: string } }) {
	const { id } = params;

	const { data, error }: { data: Sequence | null, error: any } = await supabase.from("sequences").select("*").eq("id", id).single();

	if (error) {
		return response(500, { message: error.message });
	}

	if (!data) {
		return response(404, { message: `Sequence ${id} not found` });
	}

	return response(200, data);
}