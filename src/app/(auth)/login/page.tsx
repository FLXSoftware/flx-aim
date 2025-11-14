import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
	return (
		<div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center p-6">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-xl">Login</CardTitle>
					<CardDescription>Melde dich bei deinem Konto an</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">E-Mail</Label>
							<Input id="email" type="email" placeholder="you@example.com" />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Passwort</Label>
							<Input id="password" type="password" placeholder="••••••••" />
						</div>
						<Button type="button" className="w-full">Anmelden</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}


