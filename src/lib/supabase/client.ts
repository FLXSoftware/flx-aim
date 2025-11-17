import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config";

export function createSupabaseBrowserClient() {
	return createBrowserClient(
		supabaseUrl!,
		supabaseAnonKey!
	);
}


