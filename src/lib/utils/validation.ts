/**
 * @file Validation functions for user input
 */
export const FILE_SIZE_LIMIT = 1024 * 1024 * 50; // 50MB
export const NAME_LIMIT = 50;
export const SEQUENCE_NAME_LIMIT = 100;
export const DESCRIP_LIMIT = 1000;

export const IS_TEXT_FILE = (file: File) => {
	return file.type.startsWith("text/") ||
		(file.type === "" && IS_TEXT_FILE_NAME(file.name));
}

// TODO: eventually remove
export const IS_TEXT_FILE_NAME = (name: string) => {
	return name.endsWith(".fas") || name.endsWith(".fasta") || name.endsWith(".fastq") || name.endsWith(".fq") ||
		name.endsWith(".fa") || name.endsWith(".txt");
}

export const VALID_FIRST_NAME = (name: string) => {
	return name.length <= NAME_LIMIT && name.length > 0;
}

export const VALID_LAST_NAME = (name: string) => {
	return name.length <= NAME_LIMIT && name.length > 0;
}

export const VALID_EMAIL = (email: string) => {
	if (email.length > 254) return false;
	return email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

export const VALID_PASSWORD = (password: string) => {
	// 12-50 characters, 1 uppercase, 1 lowercase, 1 number
	return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/? ]{12,50}$/);
}

export const VALID_PATH = (path: string) => {
	const dangerousPatterns = /(\.\.\/|\/\.\.|\~\/|\/\/|\\)/g;
	const normalizedPath = path.replace(/\/$/, '');

	return !(dangerousPatterns.test(normalizedPath));
}

export const VALID_SEQUENCE_NAME = (name: string) => {
	return name.length <= SEQUENCE_NAME_LIMIT && name.length > 0;
}

export const VALID_DESCRIPTION = (description: string) => {
	return description.length <= DESCRIP_LIMIT;
}

export const VALID_POSITIVE_INT = (num: any) => {
	if (typeof num !== "number" && typeof num !== "string") return false;
	if (typeof num === "string") num = parseInt(num);
	if (isNaN(num)) return false;
	return num > 0 && Number.isInteger(num);
}