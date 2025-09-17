import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ServiceSkeletonProps {}

export function ServiceSkeleton({}: ServiceSkeletonProps) {
	const skeletonKeys = ["a", "b", "c", "d", "e", "f", "g"];

	return (
		<>
			<div className="flex justify-between items-center gap-2 mb-6">
				<Skeleton className="h-20 w-full" />
			</div>
			<div className="space-y-2">
				{skeletonKeys.map((key) => (
					<Skeleton key={key} className="h-20 w-full rounded-lg p-4 gap-2" />
				))}
			</div>
		</>
	);
}
