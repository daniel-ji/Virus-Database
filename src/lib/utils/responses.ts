/**
 * @file Provides helper functions for creating HTTP responses.
 */
export const response = (status: number) => {
	return new Response(undefined, {
		status,
	});
}

export const responseJSON = (status: number, body: any) => {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export const responseBlob = (status: number, body: Blob) => {
	return new Response(body, {
		status,
		headers: {
			"Content-Type": "application/octet-stream",
		},
	});
}