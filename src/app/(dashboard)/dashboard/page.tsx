import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
	return (
		<div className="p-6">
			<Card>
				<CardHeader>
					<CardTitle>Dashboard</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Grundgerüst ist bereit. Inhalte folgen.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}


