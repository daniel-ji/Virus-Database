/**
 * @file Used in hooks.server.ts for auth guard.
 */
export const AUTHORIZED_API_PATHS: string[] = [
	'/api/sequences',
];
export const AUTHORIZED_PAGES: string[] = [
	'/dashboard',
];
export const AUTHORIZED_REDIRECT_PAGES: string[] = [
	'/login',
	'/signup',
	'/signup/confirm',
];