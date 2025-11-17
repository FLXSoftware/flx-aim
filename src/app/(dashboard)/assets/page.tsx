import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireOrg } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SearchParams = {
	page?: string;
	limit?: string;
	q?: string;
};

export default async function AssetsPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const info = await requireOrg();
	const orgId = info.org?.id;
	if (!orgId) {
		// Ohne gültige Organisation keine Abfrage möglich
		return (
			<div className="flex flex-col gap-4">
				<Card>
					<CardHeader>
						<CardTitle>Assets</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-[#9BA9C1]">Kein Organisationskontext vorhanden.</p>
					</CardContent>
				</Card>
			</div>
		);
	}
	const supabase = await createSupabaseServerClient();

	const page = Math.max(parseInt(searchParams.page ?? "1", 10) || 1, 1);
	const limit = Math.min(Math.max(parseInt(searchParams.limit ?? "10", 10) || 10, 1), 50);
	const from = (page - 1) * limit;
	const to = from + limit - 1;
	const q = (searchParams.q ?? "").trim();

	let query = supabase
		.from("assets")
		.select("id, name, category, location, status, inventory_no, props", { count: "exact" })
		.eq("org_id", orgId);

	if (q) {
		const like = `%${q}%`;
		query = query.or(
			`name.ilike.${like},inventory_no.ilike.${like},category.ilike.${like},location.ilike.${like}`
		);
	}

	const { data: rows, count } = await query
		.order("created_at", { ascending: false })
		.range(from, to);

	const total = count ?? 0;
	const totalPages = Math.max(Math.ceil(total / limit), 1);

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Assets</CardTitle>
					<form className="flex items-center gap-2" action="/assets" method="GET">
						<Input name="q" placeholder="Suchen..." defaultValue={q} />
						<input type="hidden" name="limit" value={String(limit)} />
						<Button type="submit" variant="secondary">Suchen</Button>
					</form>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Kategorie</TableHead>
									<TableHead>Standort</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Inventar-Nr.</TableHead>
									<TableHead>Nächste Prüfung</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows?.map((a) => {
									const nextInspection =
										(a.props as any)?.next_inspection_at ??
										(a.props as any)?.nextInspection ??
										null;
									return (
										<TableRow key={a.id}>
											<TableCell>
												<Link href={`/assets/${a.id}`} className="underline underline-offset-4">
													{a.name}
												</Link>
											</TableCell>
											<TableCell>{a.category ?? "-"}</TableCell>
											<TableCell>{a.location ?? "-"}</TableCell>
											<TableCell>{a.status}</TableCell>
											<TableCell>{a.inventory_no}</TableCell>
											<TableCell>{nextInspection ? String(nextInspection) : "-"}</TableCell>
										</TableRow>
									);
								})}
								{!rows?.length ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
											Keine Einträge gefunden.
										</TableCell>
									</TableRow>
								) : null}
							</TableBody>
						</Table>
					</div>
					<div className="mt-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground">
							Seite {page} von {totalPages} — {total} Einträge
						</div>
						<div className="flex items-center gap-2">
							<Button asChild variant="outline" size="sm" disabled={page <= 1}>
								<Link href={`/assets?${new URLSearchParams({ q, limit: String(limit), page: String(page - 1) })}`}>
									Zurück
								</Link>
							</Button>
							<Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
								<Link href={`/assets?${new URLSearchParams({ q, limit: String(limit), page: String(page + 1) })}`}>
									Weiter
								</Link>
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


