"use client";

import { createClient } from "@/actions/client";
import { sendCreateClientWebhook } from "@/actions/create-client-webhook";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, Plus, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const createClientSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	passportNumber: z.string().min(1, "Número do passaporte é obrigatório"),
	email: z.string().email("Email inválido").optional().or(z.literal("")),
	phone: z.string().min(1, "Telefone é obrigatório"),
	nationality: z.string().optional(),
	dateOfBirth: z.date().optional(),
	gender: z.enum(["MASCULINO", "FEMININO", "OUTRO"]).optional().or(z.literal("")),
	role: z.enum(["ADMIN", "USER"]),
});

type CreateClientForm = z.infer<typeof createClientSchema>;

interface CreateClientDialogProps {
	onClientCreated?: () => void;
}

export function CreateClientDialog({ onClientCreated }: CreateClientDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<CreateClientForm>({
		resolver: zodResolver(createClientSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			passportNumber: "",
			email: "",
			phone: "",
			nationality: "",
			gender: "",
			role: "USER",
		},
	});

	async function onSubmit(data: CreateClientForm) {
		setIsLoading(true);

		try {
			// ✅ Preparar dados para criar cliente
			const clientData = {
				firstName: data.firstName || "Cliente",
				lastName: data.lastName || data.passportNumber,
				passportNumber: data.passportNumber,
				clientId: data.passportNumber, // clientId é o mesmo que o número do passaporte
				email: data.email || undefined,
				phone: data.phone,
				nationality: data.nationality || undefined,
				dateOfBirth: data.dateOfBirth || undefined,
				gender: data.gender || undefined,
				role: data.role,
			};

			// ✅ Criar cliente
			const newClient = await createClient(clientData);

			if (newClient) {
				toast.success("Cliente criado com sucesso!", {
					description: `Client ID: ${newClient.client_id}`,
				});

				// ✅ Enviar dados para webhook do n8n
				try {
					console.log("Enviando dados para webhook do n8n...");
					const webhookResult = await sendCreateClientWebhook({
						passportNumber: data.passportNumber,
						email: data.email || undefined,
						phone: data.phone || undefined,
					});

					if (webhookResult === "ok") {
						console.log("✅ Webhook enviado com sucesso para n8n");
						toast.success("Automação iniciada!", {
							description: "Os dados foram enviados para o sistema de automação.",
						});
					} else {
						console.warn("⚠️ Webhook não foi enviado, mas cliente foi criado");
						toast.warning("Cliente criado", {
							description: "Cliente criado com sucesso, mas a automação pode não ter sido iniciada.",
						});
					}
				} catch (webhookError) {
					console.error("❌ Erro ao enviar webhook:", webhookError);
					toast.warning("Cliente criado", {
						description: "Cliente criado com sucesso, mas houve problema ao iniciar a automação.",
					});
				}

				// ✅ Resetar formulário e fechar dialog
				form.reset();
				setOpen(false);

				// ✅ Callback para atualizar lista
				if (onClientCreated) {
					onClientCreated();
				}
			}
		} catch (error: any) {
			console.error("Erro ao criar cliente:", error);
			const errorMessage = error?.message || "Erro ao criar cliente";

			if (errorMessage.includes("já existe") || errorMessage.includes("já está cadastrado")) {
				toast.error("Dados duplicados", {
					description: errorMessage,
				});
			} else {
				toast.error("Erro ao criar cliente", {
					description: errorMessage,
				});
			}
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-blue-900 hover:bg-blue-800 text-white">
					<Plus className="mr-2 h-4 w-4" />
					Novo Cliente
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader className="space-y-3">
					<div className="flex items-center space-x-2">
						<User className="h-5 w-5 text-blue-600" />
						<DialogTitle className="text-xl font-semibold text-slate-900">Criar Novo Cliente</DialogTitle>
					</div>
					<DialogDescription className="text-slate-600">
						Preencha as informações básicas do cliente. O cliente poderá completar os dados posteriormente via sign-up.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Passaporte e Telefone */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="passportNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Número do Passaporte *</FormLabel>
										<FormControl>
											<Input placeholder="AB123456" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Telefone *</FormLabel>
										<FormControl>
											<Input placeholder="+351 912 345 678" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Nome e Sobrenome */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome</FormLabel>
										<FormControl>
											<Input placeholder="João" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Sobrenome</FormLabel>
										<FormControl>
											<Input placeholder="Silva" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Email e Nacionalidade */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" placeholder="cliente@email.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="nationality"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nacionalidade</FormLabel>
										<FormControl>
											<Input placeholder="Brasileira" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Gênero e Data de Nascimento */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gênero</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecione" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="MASCULINO">Masculino</SelectItem>
												<SelectItem value="FEMININO">Feminino</SelectItem>
												<SelectItem value="OUTRO">Outro</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dateOfBirth"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Data de Nascimento</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
													>
														{field.value ? (
															format(field.value, "PPP", { locale: ptBR })
														) : (
															<span>Selecione uma data</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Role */}
						<div className="grid grid-cols-1">
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo de Usuário</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecione o tipo" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="USER">Cliente</SelectItem>
												<SelectItem value="ADMIN">Administrador</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter className="pt-4">
							<Button type="button" variant="outline" onClick={() => setOpen(false)}>
								Cancelar
							</Button>
							<Button type="submit" disabled={isLoading} className="bg-blue-900 hover:bg-blue-800">
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Criando...
									</>
								) : (
									"Criar Cliente"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
