"use server";

import { z } from "zod";
import { requireOrg } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const InviteEmployeeSchema = z.object({
	email: z.string().email(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	position: z.string().optional(),
	role: z.enum(["admin", "user"]),
});

export type InviteEmployeeInput = z.infer<typeof InviteEmployeeSchema>;

export async function inviteEmployeeAction(input: InviteEmployeeInput) {
	const parsed = InviteEmployeeSchema.safeParse(input);
	if (!parsed.success) {
		throw new Error("Ungültige Eingaben.");
	}
	const data = parsed.data;

	const info = await requireOrg();
	const supabase = await createSupabaseServerClient();
	const admin = createAdminClient();

	const userId = info.user!.id;
	const orgId = info.org!.id;

	// Admin-Check
	const { data: myRoles } = await supabase
		.from("user_roles")
		.select("role")
		.eq("user_id", userId)
		.eq("org_id", orgId);
	const isAdmin = (myRoles ?? []).some((r) => r.role === "admin");
	if (!isAdmin) {
		throw new Error("Not allowed to invite employees");
	}

	// Invite via Admin API
	const { data: inviteResult, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
		data.email
	);
	if (inviteError) {
		throw new Error(inviteError.message);
	}
	const invitedUserId = inviteResult.user?.id;
	if (!invitedUserId) {
		throw new Error("Invite fehlgeschlagen (keine User-ID).");
	}

	// generate personnel_no
	const personnelNo = `INV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

	// Insert employee
	const { error: empError } = await admin
		.from("employees")
		.insert({
			org_id: orgId,
			user_id: invitedUserId,
			email: data.email,
			first_name: data.first_name ?? null,
			last_name: data.last_name ?? null,
			position: data.position ?? null,
			personnel_no: personnelNo,
		} as any);
	if (empError) {
		throw new Error(empError.message);
	}

	// Insert role
	const { error: roleError } = await admin
		.from("user_roles")
		.insert({
			org_id: orgId,
			user_id: invitedUserId,
			role: data.role,
		} as any);
	if (roleError) {
		throw new Error(roleError.message);
	}
}


