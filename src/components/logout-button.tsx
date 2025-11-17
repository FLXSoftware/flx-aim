"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LogoutButton() {
	const supabase = createSupabaseBrowserClient();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	async function onLogout() {
		await supabase.auth.signOut();
		startTransition(() => router.replace("/login"));
	}

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={onLogout}
			disabled={isPending}
			className="border-[#1E2635] text-[#E6EEF7] hover:bg-[#1F2937] hover:text-[#E6EEF7]"
		>
			<LogOut className="mr-2 h-4 w-4" />
			Logout
		</Button>
	);
}


