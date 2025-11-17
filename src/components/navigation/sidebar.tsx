"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard, Box, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
	label: string;
	href: string;
	icon: React.ReactNode;
	disabled?: boolean;
	match?: "exact" | "startsWith";
};

const navItems: NavItem[] = [
	{ label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, match: "exact" },
	{ label: "Assets", href: "/assets", icon: <Box className="h-4 w-4" />, match: "startsWith" },
	{ label: "Employees", href: "/employees", icon: <Users className="h-4 w-4" />, disabled: true, match: "startsWith" },
];

export function Sidebar() {
	const pathname = usePathname();

	function isActive(item: NavItem) {
		if (item.match === "exact") {
			return pathname === item.href;
		}
		return pathname.startsWith(item.href);
	}

	return (
		<div className="flex h-screen flex-col">
			<div className="flex items-center gap-2 px-4 py-4 border-b border-[#1E2635]">
				<div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#0F172A] border border-[#1E2635]">
					<Boxes className="h-4 w-4 text-[#00A8FF]" />
				</div>
				<div className="text-sm font-semibold tracking-wide text-[#007BFF]">FLX AIM</div>
			</div>

			<nav className="flex-1 p-3">
				<ul className="space-y-1.5">
					{navItems.map((item) => {
						const active = isActive(item);
						return (
							<li key={item.href}>
								<Link
									href={item.disabled ? "#" : item.href}
									className={cn(
										"flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-900 hover:text-white",
										active && "bg-slate-900 text-white border-l-2 border-[#007BFF]",
										item.disabled && "opacity-50 cursor-not-allowed"
									)}
									aria-disabled={item.disabled}
									tabIndex={item.disabled ? -1 : 0}
								>
									{item.icon}
									<span className="text-sm">{item.label}</span>
									{item.disabled ? (
										<span className="ml-auto text-[10px] text-[#9BA9C1]">coming soon</span>
									) : null}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
}


