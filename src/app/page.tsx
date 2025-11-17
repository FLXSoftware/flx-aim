import { redirect } from "next/navigation";
import { getCurrentUserWithOrg } from "@/lib/auth";

export default async function RootPage() {
	const info = await getCurrentUserWithOrg();
	if (!info?.userId) {
		redirect("/login");
	}
	redirect("/dashboard");
}
