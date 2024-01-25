export const FILE_SIZE_LIMIT = 1024 * 1024 * 50; // 50MB
export const NAME_LIMIT = 100;
export const DESCRIP_LIMIT = 1000;

export const IS_TEXT_FILE = (file: File) => {
	return file.type.startsWith("text/") ||
		(file.type === "" && (file.name.endsWith(".fas") ||
			file.name.endsWith(".fasta") || file.name.endsWith(".fastq") || file.name.endsWith(".fq") ||
			file.name.endsWith(".fa") || file.name.endsWith(".txt")));
}

// TODO: eventually remove
export const IS_TEXT_FILE_NAME = (name: string) => {
	return name.endsWith(".fas") || name.endsWith(".fasta") || name.endsWith(".fastq") || name.endsWith(".fq") ||
		name.endsWith(".fa") || name.endsWith(".txt");
}

export const VALID_PASSWORD = (password: string) => {
	// 12-50 characters, 1 uppercase, 1 lowercase, 1 number
	return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{12,50}$/);
}