export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/admin-auth";
import { notFound } from "next/navigation";

interface AdminDashboardPageProps {}

export default async function AdminDashboardPage({}: AdminDashboardPageProps) {
	const user = await getCurrentUser();

	if (!user) {
		return notFound();
	}

	return (
		<div className="flex flex-col items-center h-screen">
			<h1 aria-label="Admin Dashboard" className="text-4xl md:text-6xl font-bold tracking-tight text-center mt-8">
				Admin Dashboard
				<p>{user.email}</p>
			</h1>
		</div>
	);
}
