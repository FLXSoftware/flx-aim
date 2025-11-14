import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { baseUrl } from "@/lib/env";

export default async function LoginPage() {
	// Referenziert baseUrl, damit die Variable build-time geprüft wird (kein Hardcoding).
	void baseUrl;
	const supabase = await createSupabaseServerClient();
	const { data } = await supabase.auth.getUser();
	if (data.user) {
		redirect("/dashboard");
	}

	return (
		<div className="min-h-screen bg-[#0A0F1A] bg-gradient-to-br from-[#0A0F1A] via-[#0F172A] to-[#111827] text-[#E6EEF7]">
			<div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8">
				<Card className="w-full max-w-md rounded-2xl border border-[#1E2635] bg-slate-900/80 shadow-lg">
					<CardContent className="p-8">
						<LoginForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}


