"use client";

import { updateClientService } from "@/actions/client-service";
import { registerClientServiceHistory } from "@/actions/client-service-history";
import { sendProcessStatus } from "@/actions/process-status";
import type { client, client_service } from "@/generated/prisma/client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

interface ClientProcessStatusProps {
	client: client;
	clientService: client_service;
}

export function ClientProcessStatus({ client, clientService }: ClientProcessStatusProps) {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: `${client?.first_name} ${client?.last_name}` || "",
		phone: client?.phone || "",
		email: client?.email || "",
		status: statusToN8n(clientService?.status || "PENDING"),
		message: "",
		url: `${process.env.NEXT_PUBLIC_APP_URL}/en/client/dashboard`,
	});

	function statusToN8n(status: string) {
		switch (status) {
			case "PENDING":
				return "Pendente";
			case "IN_PROGRESS":
				return "Em andamento";
			case "COMPLETED":
				return "Concluído";
			case "CANCELLED":
				return "Cancelado";
			default:
				return "Pendente";
		}
	}

	function statusFromN8nToDb(status: string) {
		switch (status) {
			case "Pendente":
				return "PENDING";
			case "Em andamento":
				return "IN_PROGRESS";
			case "Concluído":
				return "COMPLETED";
			case "Cancelado":
				return "CANCELLED";
			default:
				return "PENDING";
		}
	}

	const handleChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		console.log("=== DADOS DO FORMULÁRIO ===");
		console.log("Form data:", JSON.stringify(formData, null, 2));
		console.log("Client:", JSON.stringify(client, null, 2));
		console.log("Client service:", JSON.stringify(clientService, null, 2));

		try {
			// ✅ Validação de dados antes do envio
			if (!formData.name || !formData.email || !formData.status) {
				toast.error("Dados obrigatórios em falta!");
				return;
			}

			// ✅ Converte o status de volta para o enum do banco
			const statusEnum = statusFromN8nToDb(formData.status);
			console.log("Status convertido:", formData.status, "->", statusEnum);

			// Atualiza o status no banco
			console.log("Atualizando status no banco...");
			await updateClientService(clientService.id, { status: statusEnum });

			// ✅ Prepara dados seguros para o n8n
			const webhookData = {
				name: formData.name.trim(),
				phone: formData.phone || "Não informado",
				email: formData.email.trim(),
				status: formData.status,
				message: formData.message.trim() || "Atualização de status",
				url: formData.url || `${window.location.origin}/client/dashboard`,
				osNumber: clientService?.os_number || "N/A",
			};

			console.log("Enviando para n8n:", JSON.stringify(webhookData, null, 2));

			// Envia para o n8n
			const webhookResult = await sendProcessStatus(webhookData);

			console.log("Resultado do envio para n8n:", webhookResult);

			// Registrar histórico
			await registerClientServiceHistory({
				client_service_id: clientService.id,
				field: "status",
				oldValue: clientService.status,
				newValue: statusEnum, // ✅ Usa o status convertido
				note: formData.message,
				changedBy: null, // Pode ser preenchido com o id do usuário logado se disponível
			});

			toast.success("Dados enviados com sucesso!");
			setOpen(false);
			setFormData({
				name: client?.first_name || "",
				phone: client?.phone || "",
				email: client?.email || "",
				status: statusToN8n(clientService?.status || "PENDING"),
				message: "",
				url: `${process.env.NEXT_PUBLIC_APP_URL}/en/client/dashboard`,
			});
		} catch (error) {
			console.error("❌ Erro completo:", error);
			console.error("❌ Erro stack:", error instanceof Error ? error.stack : "Sem stack");

			const errorMessage = error instanceof Error ? error.message : String(error);
			console.error("❌ Mensagem do erro:", errorMessage);

			toast.error(`Erro ao enviar dados: ${errorMessage}`);
		}
	};

	console.log(formData);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-blue-800 text-white hover:bg-blue-900">Atualizar Status/Notificar Cliente</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Atualizar Status do Serviço</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex items-center gap-2">
						<Label htmlFor="name" className="text-xl font-bold">
							Nome:
						</Label>
						<span className="text-sm text-gray-500">{`${client?.first_name} ${client?.last_name}`}</span>
					</div>
					<div className="flex items-center gap-2">
						<Label htmlFor="osNumber" className="text-xl font-bold">
							OS Number:
						</Label>
						<span className="text-sm text-gray-500">{clientService?.os_number}</span>
					</div>
					<div className="flex items-center gap-2">
						<Label htmlFor="phone" className="text-xl font-bold">
							Telefone:
						</Label>
						<span className="text-sm text-gray-500">{client?.phone}</span>
					</div>
					<div className="flex items-center gap-2">
						<Label htmlFor="email" className="text-xl font-bold">
							Email:
						</Label>
						<span className="text-sm text-gray-500">{client?.email}</span>
					</div>
					<div className="flex items-center gap-2">
						<Label htmlFor="status" className="text-xl font-bold">
							Status:
						</Label>
						<Select
							name="status"
							value={formData.status}
							onValueChange={(value) => handleChange("status", value)}
							required
						>
							<SelectTrigger>
								<SelectValue placeholder="Selecione o status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Pendente">Pendente</SelectItem>
								<SelectItem value="Em andamento">Em andamento</SelectItem>
								<SelectItem value="Concluído">Concluído</SelectItem>
								<SelectItem value="Cancelado">Cancelado</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center gap-2">
						<Label htmlFor="message" className="text-xl font-bold">
							Mensagem:
						</Label>
						<Textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={(e) => handleChange("message", e.target.value)}
						/>
					</div>
					<div className="flex items-center gap-2">
						<Label htmlFor="url" className="text-xl font-bold">
							URL:
						</Label>
						<span className="text-sm text-gray-500">{formData.url}</span>
					</div>
					<Button type="submit" className="bg-blue-800 text-white hover:bg-blue-900">
						Enviar para automação
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
