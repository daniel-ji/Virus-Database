export interface UserData {
	id: string;
	first_name: string;
	last_name: string;
	role: string;
	email: string;
	email_verified: boolean;
	last_sign_in_at: string | undefined;
}