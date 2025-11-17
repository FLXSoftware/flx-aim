import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config";

export async function createSupabaseServerClient() {
	const cookieStore = await cookies();

	return createServerClient(
		supabaseUrl!,
		supabaseAnonKey!,
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
				// In Server Components, setting cookies is only allowed in specific contexts (e.g., Route Handlers).
				// Supabase SSR client gracefully no-ops if cookie mutation isn't permitted in the current context.
				set(name: string, value: string, options: CookieOptions) {
					try {
						cookieStore.set({ name, value, ...options });
					} catch {
						// noop
					}
				},
				remove(name: string, options: CookieOptions) {
					try {
						cookieStore.set({ name, value: "", ...options, maxAge: 0 });
					} catch {
						// noop
					}
				},
			},
		}
	);
}


