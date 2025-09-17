'use client';

import { getPowerAttorneyDocuments } from "@/actions/power-attorney-documents";
import { PowerAttorneyList } from "@/components/client/power-attorney-list";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DocumentResponse } from "@/types/document-types";
import { useCallback, useEffect, useState } from "react";

interface PowerAttorneyProps {}

export default function PowerAttorney({}: PowerAttorneyProps) {
	const [documents, setDocuments] = useState<DocumentResponse>({ data: [] });
	const [isLoading, setIsLoading] = useState(true);

	const loadDocuments = useCallback(async () => {
		try {
			setIsLoading(true);
			const result = await getPowerAttorneyDocuments();
			setDocuments(result);
		} catch (error) {
			console.error("Erro ao carregar procurações:", JSON.stringify(error, null, 2));
			setDocuments({
				error: {
					message: "Erro ao carregar procurações",
					statusCode: "500",
				},
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadDocuments();
	}, [loadDocuments]);

	return (
		<div className={cn("container mx-auto p-6")}>
			<div className="mb-6">
				<h1 className="text-2xl font-bold">Minhas Procurações</h1>
				<p className="text-muted-foreground">Visualize e baixe suas procurações enviadas pelo escritório</p>
			</div>

			{isLoading ? (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Skeleton className="h-6 w-32" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{Array.from({ length: 6 }).map((_, i) => (
							<Skeleton key={i} className="h-32 w-full" />
						))}
					</div>
				</div>
			) : (
				<PowerAttorneyList documents={documents} />
			)}
		</div>
	);
}
