import { redirect } from "next/navigation";
import { getCurrentUserWithOrg } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { Sidebar } from "@/components/navigation/sidebar";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const info = await getCurrentUserWithOrg();
	if (!info?.user) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen w-full bg-[#0F172A] text-[#E6EEF7]">
			<div className="flex">
				<aside className="w-64 shrink-0 bg-[#0A0F1A] border-r border-[#1E2635]">
					<Sidebar />
				</aside>
				<div className="flex min-h-screen flex-1 flex-col">
					<header className="bg-[#0A0F1A] border-b border-[#1E2635]">
						<div className="flex items-center justify-between px-6 py-4">
							<div className="text-lg font-semibold tracking-tight text-[#E6EEF7]">Dashboard</div>
							<div className="flex items-center gap-3">
								<div className="text-right">
									<div className="text-sm text-[#E6EEF7]">{info.user.email ?? "Unbekannter Nutzer"}</div>
									<div className="text-xs text-[#9BA9C1]">
										{info.org?.name ?? (info.org?.id ? `Org: ${info.org.id}` : "Keine Organisation")}
									</div>
								</div>
								<LogoutButton />
							</div>
						</div>
					</header>
					<main className="flex-1">
						<div className="mx-auto max-w-6xl p-6 space-y-6">
							{children}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}


