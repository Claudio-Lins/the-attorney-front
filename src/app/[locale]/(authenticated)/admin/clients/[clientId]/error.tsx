"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	useEffect(() => {
		// Log do erro para debugging em produção
		console.error("Erro na página do cliente:", error);

		// Log adicional para produção
		if (typeof window !== "undefined") {
			console.error("Error digest:", error.digest);
			console.error("Error message:", error.message);
			console.error("Error stack:", error.stack);
			console.error("URL atual:", window.location.href);
		}
	}, [error]);

	function handleGoBack() {
		router.push("/admin/clients");
	}

	function handleRetry() {
		reset();
	}

	return (
		<div className="container mx-auto py-8">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<div className="flex items-center space-x-2">
						<AlertCircle className="h-5 w-5 text-red-500" />
						<CardTitle className="text-red-600">Erro ao Carregar Cliente</CardTitle>
					</div>
					<CardDescription>
						Ocorreu um problema ao carregar os dados do cliente. Isso pode ser devido a problemas de conectividade ou
						configuração.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Detalhes do Erro</AlertTitle>
						<AlertDescription className="mt-2">
							{error.message || "Erro desconhecido ao carregar dados do cliente"}
							{error.digest && <div className="mt-2 text-xs opacity-70">ID do erro: {error.digest}</div>}
						</AlertDescription>
					</Alert>

					<div className="flex space-x-2">
						<Button onClick={handleRetry} variant="outline" className="flex items-center space-x-2">
							<RefreshCw className="h-4 w-4" />
							<span>Tentar Novamente</span>
						</Button>
						<Button onClick={handleGoBack} variant="secondary" className="flex items-center space-x-2">
							<ArrowLeft className="h-4 w-4" />
							<span>Voltar para Clientes</span>
						</Button>
					</div>

					{process.env.NODE_ENV === "development" && (
						<Alert>
							<AlertTitle>Informações de Debug (Desenvolvimento)</AlertTitle>
							<AlertDescription className="mt-2">
								<pre className="text-xs overflow-auto max-h-48 bg-gray-100 p-2 rounded">{error.stack}</pre>
							</AlertDescription>
						</Alert>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
