"use client";

import { getAuthenticatedClient } from "@/actions/client";
import { EditClientDialog } from "@/components/client/edit-client-dialog";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { address, client } from "@/generated/prisma/client";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ClientDataVerifierProps {
	clientRole?: "ADMIN" | "USER" | null;
}

interface MissingField {
	field: string;
	label: string;
	category: "personal" | "passport" | "contact" | "family" | "address";
}

export function ClientDataVerifier({ clientRole }: ClientDataVerifierProps) {
	const [clientData, setClientData] = useState<(client & { address?: address[] }) | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const [missingFields, setMissingFields] = useState<MissingField[]>([]);
	const [refreshKey, setRefreshKey] = useState(0); // Para forçar re-verificação
	const previousMissingCountRef = useRef<number | null>(null);
	const router = useRouter();

	useEffect(() => {
		async function checkClientData() {
			// Só verificar para clientes (USER), não para administradores
			if (clientRole !== "USER") {
				setIsLoading(false);
				return;
			}

			try {
				const client = await getAuthenticatedClient();
				if (!client) {
					setIsLoading(false);
					return;
				}

				setClientData(client);

				// Verificar campos obrigatórios para procuração
				const missing: MissingField[] = [];

				// Dados pessoais obrigatórios
				if (!client.first_name || client.first_name.length < 2)
					missing.push({ field: "firstName", label: "Nome", category: "personal" });
				if (!client.last_name || client.last_name.length < 2)
					missing.push({ field: "lastName", label: "Sobrenome", category: "personal" });
				if (!client.email) missing.push({ field: "email", label: "Email", category: "contact" });
				if (!client.nationality) missing.push({ field: "nationality", label: "Nacionalidade", category: "personal" });
				if (!client.place_of_birth)
					missing.push({ field: "placeOfBirth", label: "Local de nascimento", category: "personal" });
				if (!client.date_of_birth)
					missing.push({ field: "dateOfBirth", label: "Data de nascimento", category: "personal" });
				if (!client.gender) missing.push({ field: "gender", label: "Gênero", category: "personal" });
				if (!client.country_of_birth)
					missing.push({ field: "countryOfBirth", label: "País de nascimento", category: "personal" });

				// Passaporte obrigatório
				if (!client.passport_number)
					missing.push({ field: "passportNumber", label: "Número do passaporte", category: "passport" });
				if (!client.passport_issue_date)
					missing.push({ field: "passportIssueDate", label: "Data de emissão do passaporte", category: "passport" });
				if (!client.passport_expiry)
					missing.push({ field: "passportExpiry", label: "Data de expiração do passaporte", category: "passport" });

				// Contato obrigatório
				if (!client.phone) missing.push({ field: "phone", label: "Telefone", category: "contact" });

				// Filiação obrigatória
				const filiation = client.filiation as { father?: string; mother?: string } | null;
				if (!filiation?.father || filiation.father.length < 2)
					missing.push({ field: "fatherName", label: "Nome do pai", category: "family" });
				if (!filiation?.mother || filiation.mother.length < 2)
					missing.push({ field: "motherName", label: "Nome da mãe", category: "family" });

				// Endereço obrigatório
				if (!client.address || client.address.length === 0) {
					missing.push({ field: "address", label: "Endereço completo", category: "address" });
				} else {
					const address = client.address[0];
					if (!address.street || address.street.length < 2)
						missing.push({ field: "street", label: "Rua", category: "address" });
					if (!address.number || address.number.length < 1)
						missing.push({ field: "number", label: "Número", category: "address" });
					if (!address.neighborhood || address.neighborhood.length < 2)
						missing.push({ field: "neighborhood", label: "Bairro", category: "address" });
					if (!address.city || address.city.length < 2)
						missing.push({ field: "city", label: "Cidade", category: "address" });
					if (!address.state || address.state.length < 2)
						missing.push({ field: "state", label: "Estado", category: "address" });
					if (!address.zip_code || address.zip_code.length < 4)
						missing.push({ field: "zipCode", label: "CEP", category: "address" });
					if (!address.country || address.country.length < 2)
						missing.push({ field: "country", label: "País", category: "address" });
				}

				setMissingFields(missing);

				// Se havia campos faltando antes e agora está completo, mostrar mensagem de sucesso
				if (previousMissingCountRef.current !== null && previousMissingCountRef.current > 0 && missing.length === 0) {
					toast.success("Perfil completo! 🎉", {
						description: "Agora você pode gerar procurações.",
						duration: 5000,
					});
				}

				// Atualizar contagem anterior
				previousMissingCountRef.current = missing.length;

				// Se houver campos faltando, abrir o dialog após um pequeno delay
				if (missing.length > 0) {
					setTimeout(() => {
						setIsOpen(true);
						toast.warning(
							`Atenção! ${missing.length} campo${missing.length > 1 ? "s" : ""} obrigatório${
								missing.length > 1 ? "s" : ""
							} precisa${missing.length > 1 ? "m" : ""} ser preenchido${missing.length > 1 ? "s" : ""}.`,
							{
								description: "Complete seu perfil para poder gerar procurações.",
								duration: 5000,
							},
						);
					}, 1000);
				} else {
					// Se não houver mais campos faltando, fechar o dialog
					setIsOpen(false);
				}
			} catch (error) {
				console.error("Erro ao verificar dados do cliente:", JSON.stringify(error, null, 2));
			} finally {
				setIsLoading(false);
			}
		}

		checkClientData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientRole, refreshKey]); // Adicionar refreshKey de volta para forçar re-verificação

	// Função para re-verificar os dados (será chamada após salvar)
	const handleDataSaved = () => {
		// Aguardar um pouco para garantir que os dados foram atualizados no servidor
		setTimeout(() => {
			router.refresh();
			setRefreshKey((prev) => prev + 1); // Forçar re-verificação
		}, 500);
	};

	// Não renderizar nada se não for cliente
	if (clientRole !== "USER" || isLoading || !clientData) {
		return null;
	}

	const getCategoryLabel = (category: string) => {
		const labels = {
			personal: "Dados Pessoais",
			passport: "Passaporte",
			contact: "Contato",
			family: "Filiação",
			address: "Endereço",
		};
		return labels[category as keyof typeof labels] || category;
	};

	const getCategoryIcon = (category: string) => {
		if (category === "personal") return "👤";
		if (category === "passport") return "📄";
		if (category === "contact") return "📞";
		if (category === "family") return "👨‍👩‍👧‍👦";
		if (category === "address") return "🏠";
		return "📋";
	};

	// Agrupar campos faltantes por categoria
	const groupedMissingFields = missingFields.reduce(
		(acc, field) => {
			if (!acc[field.category]) {
				acc[field.category] = [];
			}
			acc[field.category].push(field);
			return acc;
		},
		{} as Record<string, MissingField[]>,
	);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-xl">
						<AlertCircle className="w-6 h-6 text-amber-500" />
						Perfil Incompleto
					</DialogTitle>
					<DialogDescription className="text-base">
						Para gerar procurações, é necessário que todos os seus dados estejam completos. Por favor, preencha os
						campos obrigatórios abaixo:
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 mt-4">
					{/* Resumo dos campos faltantes */}
					<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
						<p className="text-sm font-medium text-amber-800 mb-3">
							Campos obrigatórios faltando: {missingFields.length}
						</p>

						{/* Listar campos por categoria */}
						<div className="space-y-3">
							{Object.entries(groupedMissingFields).map(([category, fields]) => (
								<div key={category} className="space-y-1">
									<p className="text-sm font-medium text-slate-700 flex items-center gap-2">
										<span>{getCategoryIcon(category)}</span>
										{getCategoryLabel(category)}
									</p>
									<div className="flex flex-wrap gap-1.5">
										{fields.map((field) => (
											<Badge key={field.field} variant="outline" className="text-xs">
												<XCircle className="w-3 h-3 mr-1 text-red-500" />
												{field.label}
											</Badge>
										))}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Explicação */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<p className="text-sm text-blue-800">
							<strong>Por que isso é importante?</strong> As procurações são documentos legais que exigem informações
							completas e precisas. Todos os campos são necessários para garantir a validade do documento.
						</p>
					</div>

					{/* Botão para editar perfil */}
					<div className="flex justify-end pt-4">
						<EditClientDialog clientData={clientData} missingFields={missingFields} onDataSaved={handleDataSaved} />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
