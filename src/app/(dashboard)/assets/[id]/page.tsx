import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireOrg } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AssetDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const { orgId } = await requireOrg();
	const supabase = await createSupabaseServerClient();

	const { data: asset } = await supabase
		.from("assets")
		.select("id, name, category, location, status, inventory_no, props, created_at, updated_at")
		.eq("org_id", orgId)
		.eq("id", params.id)
		.limit(1)
		.single();

	if (!asset) {
		notFound();
	}

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Asset: {asset.name}</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4">
					<DetailRow label="Inventar-Nr." value={asset.inventory_no} />
					<DetailRow label="Kategorie" value={asset.category ?? "-"} />
					<DetailRow label="Standort" value={asset.location ?? "-"} />
					<DetailRow label="Status" value={asset.status} />
					<DetailRow
						label="Nächste Prüfung"
						value={
							(asset.props as any)?.next_inspection_at ??
							(asset.props as any)?.nextInspection ??
							"-"
						}
					/>
					<DetailRow label="Erstellt" value={new Date(asset.created_at).toLocaleString()} />
					<DetailRow label="Geändert" value={new Date(asset.updated_at).toLocaleString()} />
				</CardContent>
			</Card>
		</div>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid grid-cols-3 items-center gap-2">
			<div className="text-sm text-muted-foreground">{label}</div>
			<div className="col-span-2">{value}</div>
		</div>
	);
}


