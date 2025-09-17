import { ServiceListClient } from "@/components/service/service-list-client";
import { ServiceSkeleton } from "@/components/service/service-skeleton";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

export default function ServicePage() {
	return (
		<div className={cn("")}>
			<Suspense fallback={<ServiceSkeleton />}>
				<ServiceListClient />
			</Suspense>
		</div>
	);
}
