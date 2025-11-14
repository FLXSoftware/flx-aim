"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { baseUrl } from "@/lib/env";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const LoginSchema = z.object({
	email: z.string().email("Bitte gib eine gültige E-Mail ein"),
	password: z.string().min(8, "Mindestens 8 Zeichen"),
	remember: z.boolean().optional(),
});

type LoginValues = z.infer<typeof LoginSchema>;

export function LoginForm() {
	const router = useRouter();
	const supabase = createSupabaseBrowserClient();
	const [globalError, setGlobalError] = useState<string | null>(null);

	const form = useForm<LoginValues>({
		resolver: zodResolver(LoginSchema),
		defaultValues: { email: "", password: "", remember: false },
		mode: "onSubmit",
	});

	async function onSubmit(values: LoginValues) {
		setGlobalError(null);
		const { error } = await supabase.auth.signInWithPassword({
			email: values.email,
			password: values.password,
		});
		if (error) {
			setGlobalError("Login fehlgeschlagen. Bitte E-Mail und Passwort prüfen.");
			return;
		}
		router.replace("/dashboard");
	}

	const isSubmitting = form.formState.isSubmitting;

	async function onForgotPassword() {
		setGlobalError(null);
		const email = form.getValues("email");
		if (!email) {
			setGlobalError("Bitte zuerst deine E-Mail eingeben.");
			return;
		}
		const redirectTo = `${baseUrl}/reset-password`;
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
		if (error) {
			setGlobalError("Senden der Reset-E-Mail fehlgeschlagen. Bitte später erneut versuchen.");
			return;
		}
		toast.success("Reset-Link gesendet. Bitte prüfe dein Postfach.");
	}

	return (
		<div className="w-full max-w-md">
			<div className="mb-6 flex flex-col text-left">
				<div className="mb-1 text-2xl font-semibold tracking-tight text-[#007BFF]">
					FLX SOFTWARE
				</div>
				<p className="text-sm text-[#9BA9C1]">Melde dich mit deinem Firmen-Account an.</p>
			</div>

			{globalError ? (
				<div className="mb-4 rounded-md border border-red-700 bg-red-900/40 p-3 text-sm text-red-100">
					{globalError}
				</div>
			) : null}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium text-slate-100">E-Mail</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="name@firma.de"
										disabled={isSubmitting}
										className="bg-slate-900 border-[#1E2635] text-slate-100 placeholder:text-slate-400 focus-visible:ring-[#007BFF] focus-visible:border-[#007BFF]"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-xs text-red-400" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium text-slate-100">Passwort</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="••••••••"
										disabled={isSubmitting}
										className="bg-slate-900 border-[#1E2635] text-slate-100 placeholder:text-slate-400 focus-visible:ring-[#007BFF] focus-visible:border-[#007BFF]"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-xs text-red-400" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="remember"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={(v) => field.onChange(Boolean(v))}
										disabled={isSubmitting}
									/>
								</FormControl>
								<FormLabel className="m-0 text-sm text-[#9BA9C1]">Eingeloggt bleiben</FormLabel>
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full" variant="flxPrimary" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
								Anmelden...
							</>
						) : (
							"Anmelden"
						)}
					</Button>
					<div className="pt-1 text-right">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="h-auto px-1 text-xs text-[#007BFF] hover:text-[#00A8FF]"
							onClick={onForgotPassword}
							title="Passwort zurücksetzen"
						>
							Passwort vergessen?
						</Button>
					</div>
				</form>
			</Form>

			<p className="mt-6 text-center text-xs text-[#9BA9C1]">
				Probleme beim Login? Wende dich an deinen Administrator.
			</p>

			<Toaster />
		</div>
	);
}


