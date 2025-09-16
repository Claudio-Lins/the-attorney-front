"use client";

import { getClientIdByClientId } from "@/actions/client";
import { createClientService } from "@/actions/client-service";
import { getServices } from "@/actions/service";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Função utilitária para buscar o id (UUID) do cliente a partir do clientId amigável
async function getClientIdFromClientId(clientId: string): Promise<string | null> {
	try {
		const res = await fetch(`/api/client/by-client-id/${clientId}`);
		if (!res.ok) return null;
		const data = await res.json();
		return data.id || null;
	} catch {
		return null;
	}
}

const clientServiceSchema = z.object({
	serviceId: z.string().min(1, "Serviço é obrigatório"),
	status: z.enum(["PENDING", "IN_PROGRESS", "DOCUMENTS_PENDING", "REVIEW", "COMPLETED", "CANCELLED", "ON_HOLD"]),
	priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	notes: z.string().optional(),
});

type ClientServiceForm = z.infer<typeof clientServiceSchema>;

export function ClientServiceFormDialog({
	clientId,
	onServiceCreated,
}: { clientId: string; onServiceCreated?: () => void }) {
	const [open, setOpen] = useState(false);
	const [services, setServices] = useState<any[]>([]);

	const form = useForm<ClientServiceForm>({
		resolver: zodResolver(clientServiceSchema),
		defaultValues: {
			serviceId: "",
			status: "PENDING",
			priority: "MEDIUM",
			startDate: "",
			endDate: "",
			notes: "",
		},
	});

	useEffect(() => {
		async function fetchServices() {
			const data = await getServices();
			setServices(data);
		}
		fetchServices();
	}, []);

	async function onSubmit(data: ClientServiceForm) {
		try {
			let clientUUID = clientId;
			// Se não for UUID, busca via server action
			if (!clientId.match(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i)) {
				const foundId = await getClientIdByClientId(clientId);
				if (!foundId) throw new Error("Cliente não encontrado");
				clientUUID = foundId;
			}

			// Mapear os dados do formulário para o formato esperado pelo schema
			const clientServiceData = {
				client_id: clientUUID,
				service_id: data.serviceId,
				status: data.status,
				priority: data.priority,
				start_date: data.startDate ? new Date(data.startDate) : null,
				end_date: data.endDate ? new Date(data.endDate) : null,
				notes: data.notes || null,
			};

			console.log("Dados enviados para createClientService:", JSON.stringify(clientServiceData, null, 2));

			await createClientService(clientServiceData);
			setOpen(false);
			form.reset();
			if (onServiceCreated) onServiceCreated();
		} catch (error) {
			console.log("Erro detalhado:", JSON.stringify(error, null, 2));
			alert(`Erro ao vincular serviço ao cliente: ${error}`);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-slate-900 hover:bg-slate-800 text-white">Adicionar Serviço</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Vincular Serviço ao Cliente</DialogTitle>
					<DialogDescription>Selecione o serviço e preencha os detalhes do vínculo.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
						<FormField
							control={form.control}
							name="serviceId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Serviço</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="Selecione um serviço" />
											</SelectTrigger>
											<SelectContent>
												{services.map((service) => (
													<SelectItem key={service.id} value={service.id}>
														{service.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<FormControl>
											<Select onValueChange={field.onChange} value={field.value}>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="PENDING">Pendente</SelectItem>
													<SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
													<SelectItem value="DOCUMENTS_PENDING">Aguardando documentos</SelectItem>
													<SelectItem value="REVIEW">Em revisão</SelectItem>
													<SelectItem value="COMPLETED">Concluído</SelectItem>
													<SelectItem value="CANCELLED">Cancelado</SelectItem>
													<SelectItem value="ON_HOLD">Em espera</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="priority"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Prioridade</FormLabel>
										<FormControl>
											<Select onValueChange={field.onChange} value={field.value}>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="LOW">Baixa</SelectItem>
													<SelectItem value="MEDIUM">Média</SelectItem>
													<SelectItem value="HIGH">Alta</SelectItem>
													<SelectItem value="URGENT">Urgente</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Data de início</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Data de término</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Notas</FormLabel>
									<FormControl>
										<Textarea placeholder="Observações, detalhes, etc." {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<Separator />
						<div className="flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={() => setOpen(false)}>
								Cancelar
							</Button>
							<Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-6">
								Vincular Serviço
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
