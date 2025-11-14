import { Card, CardContent } from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
	return (
		<div className="min-h-screen bg-[#0A0F1A] bg-gradient-to-br from-[#0A0F1A] via-[#0F172A] to-[#111827] text-[#E6EEF7]">
			<div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8">
				<Card className="w-full max-w-md rounded-2xl border border-[#1E2635] bg-slate-900/80 shadow-lg">
					<CardContent className="p-8">
						<ResetPasswordForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}


