export const FILE_SIZE_LIMIT = 1024 * 1024 * 50; // 50MB
export const NAME_LIMIT = 100;
export const DESCRIP_LIMIT = 1000;

export const IS_TEXT_FILE = (file: File) => {
	return file.type.startsWith("text/") ||
		(file.type === "" && (file.name.endsWith(".fas") ||
			file.name.endsWith(".fasta") || file.name.endsWith(".fastq") || file.name.endsWith(".fq") ||
			file.name.endsWith(".fa") || file.name.endsWith(".txt")));
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