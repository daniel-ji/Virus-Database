/**
 * @file Used in hooks.server.ts for auth guard.
 */
export const ADMIN_API_PATHS: string[] = [
	'/api/users',
];
export const ADMIN_PAGES: string[] = [
	'/admin-dashboard',
];
export const AUTHORIZED_API_PATHS: string[] = [
	'/api/sequences',
	...ADMIN_API_PATHS,
];
export const AUTHORIZED_PAGES: string[] = [
	'/dashboard',
	...ADMIN_PAGES,
];
export const AUTHORIZED_REDIRECT_PAGES: string[] = [
	'/login',
	'/signup',
	'/signup/confirm',
];
export enum Role {
	ADMIN = 'admin',
	USER = 'user',
}