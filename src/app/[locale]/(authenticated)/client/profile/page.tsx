import { getAuthenticatedClient } from "@/actions/client";
import { ClientCard } from "@/components/client/client-card";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface ProfilePageProps {}

export default async function ProfilePage({}: ProfilePageProps) {
	const client = await getAuthenticatedClient();
	if (!client) {
		return notFound();
	}

	return (
		<div className="flex flex-col w-full min-h-full">
			<Suspense
				fallback={
					<div className="flex flex-col gap-4">
						<Skeleton className="w-full h-20 rounded-xl" />
						<Skeleton className="w-full h-20 rounded-xl" />
					</div>
				}
			>
				<ClientCard clientData={client} />
			</Suspense>
		</div>
	);
}
