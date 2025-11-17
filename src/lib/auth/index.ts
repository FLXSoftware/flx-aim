import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type CurrentUserWithOrg = {
	user: User | null;
	employee: { id: string; org_id: string } | null;
	org: { id: string; name?: string | null; subdomain?: string | null } | null;
};

export async function getCurrentUserWithOrg(): Promise<CurrentUserWithOrg | null> {
	const supabase = await createSupabaseServerClient();

	// A) Nutzer laden
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return { user: null, employee: null, org: null };
	}

	// B) employees anhand user.id laden
	const { data: employee } = await supabase
		.from("employees")
		.select("id, org_id")
		.eq("user_id", user.id)
		.single();

	// C) organization anhand employee.org_id laden
	let org: { id: string; name?: string | null; subdomain?: string | null } | null = null;
	if (employee?.org_id) {
		const { data: orgRow } = await supabase
			.from("organizations")
			.select("id, name, subdomain")
			.eq("id", employee.org_id)
			.single();
		org = orgRow ?? null;
	}

	// D) Rückgabe ohne Redirect/Fallbacks
	return { user, employee: employee ?? null, org };
}

export async function requireOrg() {
	const info = await getCurrentUserWithOrg();
	if (!info?.user) {
		redirect("/login");
	}
	// WICHTIG: Kein Redirect mehr bei fehlender orgId, um Loops zu vermeiden.
	// Org-Handling erfolgt seiten-/layout-spezifisch (z. B. Hinweis-Seite).
	return info;
}


