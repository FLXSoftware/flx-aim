import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserWithOrg } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function parseNextInspection(props: any): Date | null {
	if (!props) return null;
	const iso = props.next_inspection_at ?? props.nextInspection ?? null;
	if (!iso) return null;
	const d = new Date(iso);
	return isNaN(d.getTime()) ? null : d;
}

export default async function DashboardPage() {
	const info = await getCurrentUserWithOrg();
	// Layout schützt bereits vor nicht eingeloggten Nutzern.
	const orgId = info?.org?.id ?? null;

	if (!orgId) {
		return (
			<div className="space-y-6">
				<Card className="rounded-xl border border-[#1E2635] bg-slate-900/80">
					<CardHeader>
						<CardTitle className="text-base text-[#E6EEF7]">Kein Organisationskontext</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-[#9BA9C1]">Dein Benutzer ist derzeit keiner Organisation zugeordnet.</p>
					</CardContent>
				</Card>
			</div>
		);
	}
	const supabase = await createSupabaseServerClient();

	// Gesamtanzahl der Assets
	const totalAssetsRes = await supabase
		.from("assets")
		.select("id", { count: "exact", head: true })
		.eq("org_id", orgId);
	const totalAssets = totalAssetsRes.count ?? 0;

	// Für KPI-Berechnung und Top-5 Liste: begrenzte Menge laden und clientseitig berechnen
	const { data: assetRows } = await supabase
		.from("assets")
		.select("id, name, location, props")
		.eq("org_id", orgId)
		.order("created_at", { ascending: false })
		.limit(200);

	const now = new Date();
	const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

	const upcoming = (assetRows ?? [])
		.map((a) => ({ ...a, nextInspection: parseNextInspection(a.props as any) }))
		.filter((a) => a.nextInspection && a.nextInspection >= now && a.nextInspection <= in30)
		.sort((a, b) => (a.nextInspection!.getTime() - b.nextInspection!.getTime()));

	const overdue = (assetRows ?? [])
		.map((a) => ({ ...a, nextInspection: parseNextInspection(a.props as any) }))
		.filter((a) => a.nextInspection && a.nextInspection < now)
		.sort((a, b) => (a.nextInspection!.getTime() - b.nextInspection!.getTime()));

	const top5 = upcoming.slice(0, 5);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card className="rounded-xl border border-[#1E2635] bg-[#1A2234] text-[#E6EEF7]">
					<CardHeader>
						<CardTitle className="text-base text-[#E6EEF7]">Assets gesamt</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">{totalAssets}</div>
						<div className="text-sm text-[#9BA9C1]">Alle Assets der Organisation</div>
					</CardContent>
				</Card>
				<Card className="rounded-xl border border-[#1E2635] bg-[#1A2234] text-[#E6EEF7]">
					<CardHeader>
						<CardTitle className="text-base text-[#E6EEF7]">Bevorstehende Prüfungen (30 Tage)</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">{upcoming.length}</div>
						<div className="text-sm text-[#9BA9C1]">Bis {in30.toLocaleDateString()}</div>
					</CardContent>
				</Card>
				<Card className="rounded-xl border border-[#1E2635] bg-[#1A2234] text-[#E6EEF7]">
					<CardHeader>
						<CardTitle className="text-base text-[#E6EEF7]">Überfällige Prüfungen</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">{overdue.length}</div>
						<div className="text-sm text-[#9BA9C1]">Stand heute</div>
					</CardContent>
				</Card>
			</div>

			<Card className="rounded-xl border border-[#1E2635] bg-[#1A2234] text-[#E6EEF7]">
				<CardHeader>
					<CardTitle className="text-base text-[#E6EEF7]">Bevorstehende Prüfungen</CardTitle>
				</CardHeader>
				<CardContent>
					{top5.length === 0 ? (
						<p className="text-sm text-[#9BA9C1]">Aktuell stehen keine Prüfungen an.</p>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="border-b border-[#1E2635]">
									<tr className="text-left text-[#9BA9C1] uppercase text-xs tracking-wider">
										<th className="py-2 pr-4 font-medium">Name</th>
										<th className="py-2 pr-4 font-medium">Standort</th>
										<th className="py-2 pr-4 font-medium">Nächste Prüfung</th>
									</tr>
								</thead>
								<tbody>
									{top5.map((a) => (
										<tr key={a.id} className="border-t border-[#1E2635] hover:bg-[#1F2937]">
											<td className="py-2 pr-4 text-[#E6EEF7]">{a.name}</td>
											<td className="py-2 pr-4 text-[#E6EEF7]">{a.location ?? "-"}</td>
											<td className="py-2 pr-4 text-[#E6EEF7]">
												{a.nextInspection ? a.nextInspection.toLocaleDateString() : "-"}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}


