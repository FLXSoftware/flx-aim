import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
	const supabase = await createSupabaseServerClient();
	const { data } = await supabase.auth.getUser();
	if (data.user) {
		redirect("/dashboard");
	}

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8">
				<Card className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
					<CardContent className="p-8">
						<LoginForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}


