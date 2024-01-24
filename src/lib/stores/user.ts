import { supabase } from "$lib/services/supabaseClient";
import type { User, Session } from "@supabase/supabase-js";
import { writable } from "svelte/store";

export const user = writable<User | null>(null);
export const session = writable<Session | null>(null);

export const retrieveSession = async () => {
	const { data, error } = await supabase.auth.getSession();

	if (error) {
		return;
	}

	session.set(data.session ?? null);
	user.set(data?.session?.user ?? null);
}