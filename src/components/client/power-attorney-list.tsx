"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { DocumentResponse } from "@/types/document-types";
import { AlertCircle, FileX } from "lucide-react";
import { DocumentCard } from "./document-card";

interface PowerAttorneyListProps {
	documents: DocumentResponse;
}

export function PowerAttorneyList({ documents }: PowerAttorneyListProps) {
	if (documents.error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>
					Erro ao carregar procurações: {documents.error.message}
				</AlertDescription>
			</Alert>
		);
	}

	if (!documents.data || documents.data.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<FileX className="h-12 w-12 text-muted-foreground mb-4" />
				<h3 className="text-lg font-medium text-muted-foreground">
					Não há Procurações disponíveis
				</h3>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-medium">
					Procurações ({documents.data.length})
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{documents.data.map((file) => (
					<DocumentCard key={file.id} file={file} />
				))}
			</div>
		</div>
	);
}
