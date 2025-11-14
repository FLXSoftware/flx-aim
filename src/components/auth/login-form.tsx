"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, KeyRound } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
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

	return (
		<div className="w-full max-w-md">
			<div className="mb-6 flex flex-col items-center text-center">
				<div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 ring-1 ring-slate-700">
					<KeyRound className="h-5 w-5 text-slate-200" />
				</div>
				<h1 className="text-2xl font-semibold tracking-tight">FLX AIM</h1>
				<p className="mt-1 text-sm text-slate-300">
					Melde dich mit deinem Firmen-Account an.
				</p>
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
								<FormLabel>E-Mail</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="name@firma.de"
										disabled={isSubmitting}
										className="bg-slate-900 border-slate-700 focus-visible:ring-slate-500"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Passwort</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="••••••••"
										disabled={isSubmitting}
										className="bg-slate-900 border-slate-700 focus-visible:ring-slate-500"
										{...field}
									/>
								</FormControl>
								<FormMessage />
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
								<FormLabel className="m-0">Eingeloggt bleiben</FormLabel>
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Anmelden...
							</>
						) : (
							"Anmelden"
						)}
					</Button>
					<div className="pt-1 text-right">
						<button
							type="button"
							disabled
							className="cursor-not-allowed text-xs text-slate-400"
							title="Demnächst verfügbar"
						>
							Passwort vergessen?
						</button>
					</div>
				</form>
			</Form>

			<p className="mt-6 text-center text-xs text-slate-400">
				Probleme beim Login? Wende dich an deinen Administrator.
			</p>
		</div>
	);
}


