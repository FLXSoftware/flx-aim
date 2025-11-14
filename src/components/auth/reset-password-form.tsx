"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const ResetSchema = z
	.object({
		password: z.string().min(8, "Mindestens 8 Zeichen"),
		confirm: z.string().min(8, "Mindestens 8 Zeichen"),
	})
	.refine((v) => v.password === v.confirm, {
		message: "Passwörter stimmen nicht überein",
		path: ["confirm"],
	});

type ResetValues = z.infer<typeof ResetSchema>;

export function ResetPasswordForm() {
	const router = useRouter();
	const supabase = createSupabaseBrowserClient();
	const [hasSession, setHasSession] = useState<boolean | null>(null);
	const [globalError, setGlobalError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (!mounted) return;
			if (!data.user) {
				setHasSession(false);
			} else {
				setHasSession(true);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [supabase]);

	const form = useForm<ResetValues>({
		resolver: zodResolver(ResetSchema),
		defaultValues: { password: "", confirm: "" },
	});

	async function onSubmit(values: ResetValues) {
		setGlobalError(null);
		const { error } = await supabase.auth.updateUser({ password: values.password });
		if (error) {
			setGlobalError("Aktualisierung fehlgeschlagen. Link möglicherweise ungültig.");
			return;
		}
		touch();
		toast.success("Passwort erfolgreich aktualisiert.");
		router.replace("/login");
	}

	function touch() {
		// noop helper in case we want to refresh UI later
	}

	if (hasSession === null) {
		return <div className="text-sm text-[#9BA9C1]">Lade...</div>;
	}

	if (hasSession === false) {
		return (
			<div className="space-y-4">
				<div className="rounded-md border border-red-700 bg-red-900/40 p-3 text-sm text-red-100">
					Der Link ist ungültig oder abgelaufen.
				</div>
				<Button
					type="button"
					variant="flxPrimary"
					onClick={() => router.replace("/login")}
				>
					Zur Login-Seite
				</Button>
				<Toaster />
			</div>
		);
	}

	const isSubmitting = form.formState.isSubmitting;

	return (
		<div className="w-full max-w-md">
			<div className="mb-6 flex flex-col text-left">
				<div className="mb-1 text-2xl font-semibold tracking-tight text-[#007BFF]">
					Neues Passwort festlegen
				</div>
				<p className="text-sm text-[#9BA9C1]">Gib bitte dein neues Passwort ein.</p>
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
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium text-slate-100">Neues Passwort</FormLabel>
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
						name="confirm"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium text-slate-100">Passwort wiederholen</FormLabel>
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
					<Button type="submit" className="w-full" variant="flxPrimary" disabled={isSubmitting}>
						Passwort speichern
					</Button>
				</form>
			</Form>
			<Toaster />
		</div>
	);
}


