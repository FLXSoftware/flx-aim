export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Optional: sanfte Validierung (keine harten Throws, um Build nicht zu brechen)
if (!supabaseUrl) {
	console.warn("[warn:supabase-config] NEXT_PUBLIC_SUPABASE_URL ist nicht gesetzt.");
}
if (!supabaseAnonKey) {
	console.warn("[warn:supabase-config] NEXT_PUBLIC_SUPABASE_ANON_KEY ist nicht gesetzt.");
}


