import { requireOrg } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InviteEmployeeDialog } from "@/components/employees/invite-employee-dialog";

export default async function EmployeesPage() {
	const info = await requireOrg();
	const supabase = await createSupabaseServerClient();

	const userId = info.user!.id;
	const orgId = info.org?.id;

	if (!orgId) {
		return (
			<div className="space-y-6">
				<Card className="rounded-xl border border-[#1E2635] bg-[#1A2234] text-[#E6EEF7]">
					<CardHeader>
						<CardTitle className="text-base text-[#E6EEF7]">Mitarbeiter</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-[#9BA9C1]">Kein Organisationskontext vorhanden.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Rollen des aktuellen Users
	const { data: roles } = await supabase
		.from("user_org_roles")
		.select("role")
		.eq("user_id", userId)
		.eq("org_id", orgId);
	const isAdmin = (roles ?? []).some((r) => r.role === "admin");

	// Employees
	const { data: employees } = await supabase
		.from("employees")
		.select("id, org_id, user_id, personnel_no, email, first_name, last_name, position, created_at")
		.eq("org_id", orgId)
		.order("created_at", { ascending: true });

	// Rollen aller Nutzer in der Org
	const { data: employeeRoles } = await supabase
		.from("user_org_roles")
		.select("user_id, role")
		.eq("org_id", orgId);

	function rolesForUser(userId: string | null) {
		if (!userId) return "–";
		const list = (employeeRoles ?? []).filter((r) => r.user_id === userId).map((r) => r.role);
		return list.length ? list.join(", ") : "–";
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold tracking-tight text-[#E6EEF7]">Mitarbeiter</h1>
				{isAdmin ? <InviteEmployeeDialog /> : null}
			</div>
			<Card className="rounded-xl border border-[#1E2635] bg-[#1A2234] text-[#E6EEF7]">
				<CardHeader>
					<CardTitle className="text-base text-[#E6EEF7]">Übersicht</CardTitle>
				</CardHeader>
				<CardContent>
					{!employees?.length ? (
						<p className="text-sm text-[#9BA9C1]">Noch keine Mitarbeiter angelegt.</p>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader className="border-b border-[#1E2635]">
									<TableRow className="text-[#9BA9C1] uppercase text-xs tracking-wider">
										<TableHead>Personalnr.</TableHead>
										<TableHead>Name</TableHead>
										<TableHead>E-Mail</TableHead>
										<TableHead>Position</TableHead>
										<TableHead>Rolle</TableHead>
										<TableHead>Angelegt am</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{employees!.map((e) => (
										<TableRow key={e.id} className="hover:bg-[#1F2937]">
											<TableCell className="text-[#E6EEF7]">{e.personnel_no ?? "–"}</TableCell>
											<TableCell className="text-[#E6EEF7]">{[e.first_name, e.last_name].filter(Boolean).join(" ") || "–"}</TableCell>
											<TableCell className="text-[#E6EEF7]">{e.email}</TableCell>
											<TableCell className="text-[#E6EEF7]">{e.position ?? "–"}</TableCell>
											<TableCell className="text-[#E6EEF7]">{rolesForUser(e.user_id)}</TableCell>
											<TableCell className="text-[#E6EEF7]">{new Date(e.created_at as any).toLocaleString()}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}


