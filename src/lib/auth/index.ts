import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentUserWithOrg = {
	userId: string;
	email: string | null;
	orgId: string | null;
	orgName: string | null;
	isAdmin: boolean;
	isHr: boolean;
};

export async function getCurrentUserWithOrg(): Promise<CurrentUserWithOrg | null> {
	const supabase = await createSupabaseServerClient();

	const { data: authData } = await supabase.auth.getUser();
	const user = authData?.user;
	if (!user) return null;

	// Versuch: aktive Employee-Zuordnung der Person finden (liefert org_id)
	const { data: employee } = await supabase
		.from("employees")
		.select("id, org_id, status")
		.eq("user_id", user.id)
		.eq("status", "active")
		.order("created_at", { ascending: true })
		.limit(1)
		.single();

	const orgId = employee?.org_id ?? null;

	let isAdmin = false;
	let isHr = false;
	let orgName: string | null = null;

	if (orgId) {
		// Rollen prüfen über Helper-Funktionen
		const [{ data: adminRes }, { data: hrRes }] = await Promise.all([
			supabase.rpc("is_admin", { p_org_id: orgId }),
			supabase.rpc("is_hr", { p_org_id: orgId }),
		]);
		isAdmin = Boolean(adminRes);
		isHr = Boolean(hrRes);

		// Org-Namen nur abrufen, wenn Policy dies erlaubt (Admins dürfen organizations lesen)
		if (isAdmin) {
			const { data: orgRow } = await supabase
				.from("organizations")
				.select("name")
				.eq("id", orgId)
				.limit(1)
				.single();
			orgName = orgRow?.name ?? null;
		}
	}

	return {
		userId: user.id,
		email: user.email ?? null,
		orgId,
		orgName,
		isAdmin,
		isHr,
	};
}

export async function requireOrg() {
	const info = await getCurrentUserWithOrg();
	if (!info?.userId) {
		redirect("/login");
	}
	// WICHTIG: Kein Redirect mehr bei fehlender orgId, um Loops zu vermeiden.
	// Org-Handling erfolgt seiten-/layout-spezifisch (z. B. Hinweis-Seite).
	return info;
}


