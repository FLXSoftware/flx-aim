import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "@/lib/supabase/config";

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createAdminClient() {
	return createClient(supabaseUrl!, serviceRoleKey, {
		auth: { autoRefreshToken: false, persistSession: false },
	});
}


