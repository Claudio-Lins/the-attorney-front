import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientLoading() {
	return (
		<div className="flex flex-col gap-4">
			{/* Header Skeleton */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-10 w-32" />
			</div>

			{/* Tabs Skeleton */}
			<div className="flex space-x-1 border-b">
				<Skeleton className="h-10 w-24" />
				<Skeleton className="h-10 w-28" />
				<Skeleton className="h-10 w-24" />
				<Skeleton className="h-10 w-32" />
			</div>

			{/* Content Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Left Column */}
				<div className="space-y-4">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-40" />
							<Skeleton className="h-4 w-64" />
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center space-x-4">
								<Skeleton className="h-16 w-16 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-24" />
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-4 w-32" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-4 w-28" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-36" />
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-40" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-36" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column */}
				<div className="space-y-4">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-2">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-4 w-40" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-36" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-32" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-40" />
						</CardHeader>
						<CardContent className="space-y-3">
							{[1, 2, 3].map((item) => (
								<div key={item} className="flex items-center justify-between p-3 border rounded">
									<div className="space-y-1">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-24" />
									</div>
									<Skeleton className="h-6 w-16" />
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
