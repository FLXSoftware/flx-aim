import { redirect } from "next/navigation";
import { requireOrg } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const info = await requireOrg();
	if (!info) {
		redirect("/login");
	}

	return (
		<div className="min-h-dvh flex flex-col">
			<header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between p-4">
					<div className="flex items-center gap-2">
						<div className="font-semibold">FLX</div>
						<div className="text-sm text-muted-foreground">Dashboard</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="text-sm">
							<div className="font-medium">
								{info.email ?? "Unbekannter Nutzer"}
							</div>
							<div className="text-muted-foreground">
								{info.orgName ?? (info.orgId ? `Org: ${info.orgId}` : "Keine Organisation")}
							</div>
						</div>
						<LogoutButton />
					</div>
				</div>
			</header>
			<main className="mx-auto w-full max-w-6xl flex-1 p-4">
				{children}
			</main>
		</div>
	);
}


