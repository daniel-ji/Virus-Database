import { supabase } from '$lib/services/supabaseClient';
import { responseJSON, responseBlob } from '$lib/utils/utils';

export async function GET({ params }: { params: { filepath: string } }) {
	const { filepath } = params;
	const unescapedPath = decodeURIComponent(filepath);

	const { data, error }: { data: Blob | null, error: any } = await supabase.storage.from("sequences").download(unescapedPath);

	if (error) {
		return responseJSON(500, { message: error.message });
	}

	if (!data) {
		return responseJSON(404, { message: `Sequence ${unescapedPath} not found` });
	}

	return responseBlob(200, data);
}