import type { SupabaseClient } from '@supabase/supabase-js';
import { responseJSON, responseBlob } from '$lib/utils/responses';
import { VALID_PATH } from '$lib/utils/validation';

export async function GET({ url, params, locals: { supabase } }: { url: URL, params: { filepath: string }, locals: { supabase: SupabaseClient } }) {
	const { filepath } = params;
	const kilabytes = url.searchParams.get("kb");
	const unescapedPath = decodeURIComponent(filepath);

	if (!VALID_PATH(filepath)) {
		return responseJSON(400, { message: `Invalid filepath` });
	}
	
	const { data, error }: { data: Blob | null, error: any } = await supabase.storage.from("sequences").download(unescapedPath);

	if (error) {
		if (error.status === 400) {
			return responseJSON(400, { message: `Sequence ${unescapedPath} not found` });
		} else {
			return responseJSON(500, { message: error.message });
		}
	}

	if (!data) {
		return responseJSON(400, { message: `Sequence ${unescapedPath} not found` });
	}

	if (kilabytes) {
		const kilabytesNum = parseInt(kilabytes);
		if (isNaN(kilabytesNum)) {
			return responseJSON(400, { message: `Invalid kilobytes parameter` });
		}
		const bytes = kilabytesNum * 1024;
		const blob = new Blob([data.slice(0, bytes)], { type: data.type });
		return responseBlob(200, blob);
	} else {
		return responseBlob(200, data);
	}
}