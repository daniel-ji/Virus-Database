import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'
import type { Handle } from '@sveltejs/kit'

import { AUTHORIZED_API_PATHS, AUTHORIZED_PAGES, AUTHORIZED_REDIRECT_PAGES } from '$lib/utils/path-auth';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '' })
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '' })
			},
		},
	})

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session },
		} = await event.locals.supabase.auth.getSession()
		return session
	}

	if (AUTHORIZED_API_PATHS.some((path) => event.url.pathname.startsWith(path))) {
		const session = await event.locals.getSession()
		if (!session) {
			return new Response(null, { status: 302, headers: { location: '/no-auth' } })
		}
	}

	if (AUTHORIZED_PAGES.includes(event.url.pathname)) {
		const session = await event.locals.getSession()
		if (!session) {
			return new Response(null, { status: 302, headers: { location: '/no-auth' } })
		}
	} else if (AUTHORIZED_REDIRECT_PAGES.includes(event.url.pathname)) {
		const session = await event.locals.getSession()
		if (session) {
			return new Response(null, { status: 302, headers: { location: '/dashboard' } })
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range'
		},
	})
}