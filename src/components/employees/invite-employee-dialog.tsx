"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inviteEmployeeAction } from "@/app/(dashboard)/employees/actions";
import { inviteEmployeeSchema, type InviteEmployeeInput } from "@/lib/validation/employees";
import { toast } from "sonner";

type InviteValues = InviteEmployeeInput;

export function InviteEmployeeDialog() {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const form = useForm<InviteValues>({
		resolver: zodResolver(inviteEmployeeSchema),
		defaultValues: { email: "", first_name: "", last_name: "", position: "", role: "user" },
	});

	async function onSubmit(values: InviteValues) {
		try {
			await inviteEmployeeAction(values);
			toast.success("Einladung gesendet.");
			setOpen(false);
			router.refresh();
		} catch (e: any) {
			toast.error(e?.message ?? "Einladung fehlgeschlagen.");
		}
	}

	const isSubmitting = form.formState.isSubmitting;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="flxPrimary">Mitarbeiter einladen</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg border border-[#1E2635] bg-slate-900/90">
				<DialogHeader>
					<DialogTitle className="text-[#E6EEF7]">Mitarbeiter einladen</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm text-slate-100">E-Mail</FormLabel>
									<FormControl>
										<Input type="email" placeholder="name@firma.de" disabled={isSubmitting}
											className="bg-slate-900 border-[#1E2635] text-slate-100 placeholder:text-slate-400 focus-visible:ring-[#007BFF] focus-visible:border-[#007BFF]" {...field} />
									</FormControl>
									<FormMessage className="text-xs text-red-400" />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="first_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm text-slate-100">Vorname</FormLabel>
										<FormControl>
											<Input disabled={isSubmitting}
												className="bg-slate-900 border-[#1E2635] text-slate-100 placeholder:text-slate-400 focus-visible:ring-[#007BFF] focus-visible:border-[#007BFF]" {...field} />
										</FormControl>
										<FormMessage className="text-xs text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="last_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm text-slate-100">Nachname</FormLabel>
										<FormControl>
											<Input disabled={isSubmitting}
												className="bg-slate-900 border-[#1E2635] text-slate-100 placeholder:text-slate-400 focus-visible:ring-[#007BFF] focus-visible:border-[#007BFF]" {...field} />
										</FormControl>
										<FormMessage className="text-xs text-red-400" />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="position"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm text-slate-100">Position</FormLabel>
									<FormControl>
										<Input disabled={isSubmitting}
											className="bg-slate-900 border-[#1E2635] text-slate-100 placeholder:text-slate-400 focus-visible:ring-[#007BFF] focus-visible:border-[#007BFF]" {...field} />
									</FormControl>
									<FormMessage className="text-xs text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm text-slate-100">Rolle</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="bg-slate-900 border-[#1E2635] text-slate-100 focus-visible:ring-[#007BFF]">
												<SelectValue placeholder="Rolle wählen" />
											</SelectTrigger>
											<SelectContent className="bg-slate-900 border-[#1E2635] text-slate-100">
												<SelectItem value="user">User</SelectItem>
												<SelectItem value="admin">Admin</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage className="text-xs text-red-400" />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-2 pt-2">
							<Button type="button" variant="outline" onClick={() => setOpen(false)}>
								Abbrechen
							</Button>
							<Button type="submit" variant="flxPrimary" disabled={isSubmitting}>
								{isSubmitting ? "Senden..." : "Einladen"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}


