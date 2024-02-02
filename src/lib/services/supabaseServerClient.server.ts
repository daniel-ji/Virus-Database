import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { SUPABASE_SERVICE_KEY } from "$env/static/private";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default supabaseAdmin;