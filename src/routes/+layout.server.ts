import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({locals}) => {
  return {
    session: await locals.getSession(), // so other routes can check if user is logged in
  }
}