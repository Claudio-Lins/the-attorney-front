"use client";

import { updateClient } from "@/actions/client";
import { uploadClientPhotoServer } from "@/actions/upload-photo-server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { address, client } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	AlertCircle,
	BookCheckIcon,
	CalendarIcon,
	Camera,
	CheckCircle,
	Edit,
	Edit3,
	Loader2,
	Mail,
	MapPin,
	Phone,
	Upload,
	User,
	Users,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
	firstName: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
	lastName: z.string().min(2, { message: "Sobrenome deve ter pelo menos 2 caracteres" }),
	email: z.string().email({ message: "Email inválido" }),
	passportNumber: z.string().min(5, { message: "Número de passaporte inválido" }),
	passportExpiry: z.date({ required_error: "Data de expiração é obrigatória" }),
	passportIssueDate: z.date({ required_error: "Data de emissão é obrigatória" }),
	nationality: z.string().min(2, { message: "Nacionalidade é obrigatória" }),
	countryOfBirth: z.string().min(2, { message: "País de nascimento é obrigatório" }),
	placeOfBirth: z.string().min(2, { message: "Local de nascimento é obrigatório" }),
	dateOfBirth: z.date({ required_error: "Data de nascimento é obrigatória" }),
	gender: z.enum(["M", "F"], { required_error: "Gênero é obrigatório" }),
	maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"], {
		required_error: "Estado civil é obrigatório",
	}),
	fatherName: z.string().min(2, { message: "Nome do pai é obrigatório" }),
	motherName: z.string().min(2, { message: "Nome da mãe é obrigatório" }),
	phone: z.string().min(8, { message: "Telefone inválido" }),
	street: z.string().min(2, { message: "Rua é obrigatória" }),
	number: z.string().min(1, { message: "Número é obrigatório" }),
	complement: z.string().optional().nullable(),
	neighborhood: z.string().min(2, { message: "Bairro é obrigatório" }),
	city: z.string().min(2, { message: "Cidade é obrigatória" }),
	state: z.string().min(2, { message: "Estado é obrigatório" }),
	zipCode: z.string().min(4, { message: "CEP é obrigatório" }),
	country: z.string().min(2, { message: "País é obrigatório" }),
});

interface MissingField {
	field: string;
	label: string;
	category: "personal" | "passport" | "contact" | "family" | "address";
}

interface EditClientDialogProps {
	clientData: client & { address?: address[] };
	missingFields?: MissingField[];
	onDataSaved?: () => void;
}

export function EditClientDialog({ clientData, missingFields = [], onDataSaved }: EditClientDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
	const [photoPreview, setPhotoPreview] = useState<string | null>(clientData.photo_url || null);
	const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
	const photoInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const address = clientData.address && clientData.address.length > 0 ? clientData.address[0] : undefined;

	// Mapear campos para suas respectivas abas
	const fieldToTabMap: Record<string, string> = {
		// Personal
		firstName: "personal",
		lastName: "personal",
		dateOfBirth: "personal",
		gender: "personal",
		maritalStatus: "personal",
		nationality: "personal",
		countryOfBirth: "personal",
		placeOfBirth: "personal",
		// Passport
		passportNumber: "passport",
		passportIssueDate: "passport",
		passportExpiry: "passport",
		// Contact
		email: "contact",
		phone: "contact",
		street: "contact",
		number: "contact",
		complement: "contact",
		neighborhood: "contact",
		city: "contact",
		state: "contact",
		zipCode: "contact",
		country: "contact",
		address: "contact", // para o caso de endereço completo
		// Family
		fatherName: "family",
		motherName: "family",
	};

	// Identificar quais abas têm campos faltantes
	const tabsWithErrors = new Set<string>();
	for (const field of missingFields) {
		const tab = fieldToTabMap[field.field];
		if (tab) {
			tabsWithErrors.add(tab);
		}
	}

	// Função para verificar se uma aba tem erros
	function hasTabErrors(tabValue: string): boolean {
		return tabsWithErrors.has(tabValue);
	}

	// Função para contar erros por aba
	function getTabErrorCount(tabValue: string): number {
		return missingFields.filter((field) => fieldToTabMap[field.field] === tabValue).length;
	}

	// Função para verificar se um campo específico está faltando
	function isFieldMissing(fieldName: string): boolean {
		return missingFields.some((field) => field.field === fieldName);
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: clientData.first_name,
			lastName: clientData.last_name,
			email: clientData.email ?? "",
			passportNumber: clientData.passport_number ?? "",
			passportExpiry: clientData.passport_expiry ? new Date(clientData.passport_expiry) : undefined,
			passportIssueDate: clientData.passport_issue_date ? new Date(clientData.passport_issue_date) : undefined,
			nationality: clientData.nationality ?? "",
			countryOfBirth: clientData.country_of_birth ?? "",
			placeOfBirth: clientData.place_of_birth ?? "",
			dateOfBirth: clientData.date_of_birth ? new Date(clientData.date_of_birth) : undefined,
			gender: clientData.gender as "M" | "F",
			maritalStatus: clientData.marital_status as "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | "SEPARATED",
			motherName: (clientData.filiation as { mother: string })?.mother ?? "",
			fatherName: (clientData.filiation as { father: string })?.father ?? "",
			phone: clientData.phone ?? "",
			street: address?.street ?? "",
			number: address?.number ?? "",
			complement: address?.complement ?? "",
			neighborhood: address?.neighborhood ?? "",
			city: address?.city ?? "",
			state: address?.state ?? "",
			zipCode: address?.zip_code ?? "",
			country: address?.country ?? "",
		},
	});

	function handlePhotoSelect() {
		photoInputRef.current?.click();
	}

	function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validar se é imagem
		if (!file.type.startsWith("image/")) {
			toast.error("Por favor, selecione apenas arquivos de imagem");
			return;
		}

		// Validar tamanho
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Imagem muito grande. Tamanho máximo: 5MB");
			return;
		}

		setSelectedPhoto(file);

		// Criar preview
		const reader = new FileReader();
		reader.onload = (e) => {
			setPhotoPreview(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	}

	function handleRemovePhoto() {
		setSelectedPhoto(null);
		setPhotoPreview(clientData.photo_url || null);
		if (photoInputRef.current) {
			photoInputRef.current.value = "";
		}
	}

	function getInitials(firstName: string, lastName: string) {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		try {
			let photoUrl = clientData.photo_url;

			// Se uma nova foto foi selecionada, fazer upload primeiro
			if (selectedPhoto) {
				setIsUploadingPhoto(true);

				try {
					// Converter File para ArrayBuffer
					const arrayBuffer = await selectedPhoto.arrayBuffer();

					// Usar a nova função server-side que bypassa RLS
					const photoResult = await uploadClientPhotoServer(
						arrayBuffer,
						selectedPhoto.name,
						selectedPhoto.type,
						clientData.client_id,
					);

					if (photoResult.success) {
						photoUrl = photoResult.photoUrl ?? "";
						toast.success("Foto atualizada com sucesso!");
					} else {
						toast.error(photoResult.message);
						setIsLoading(false);
						setIsUploadingPhoto(false);
						return;
					}
				} catch (error) {
					console.error("Erro ao processar foto:", error);
					toast.error("Erro ao processar a foto. Tente novamente.");
					setIsLoading(false);
					setIsUploadingPhoto(false);
					return;
				}

				setIsUploadingPhoto(false);
			}

			const dataToUpdate = {
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				passportNumber: values.passportNumber,
				passportExpiry: values.passportExpiry,
				passportIssueDate: values.passportIssueDate,
				nationality: values.nationality,
				countryOfBirth: values.countryOfBirth,
				placeOfBirth: values.placeOfBirth,
				dateOfBirth: values.dateOfBirth,
				gender: values.gender,
				maritalStatus: values.maritalStatus,
				fatherName: values.fatherName,
				motherName: values.motherName,
				phone: values.phone,
				photoUrl: photoUrl,
				address: {
					street: values.street,
					number: values.number,
					complement: values.complement,
					neighborhood: values.neighborhood,
					city: values.city,
					state: values.state,
					zipCode: values.zipCode,
					country: values.country,
				},
			};

			await updateClient(clientData.client_id, dataToUpdate as any);
			toast.success("Informações atualizadas com sucesso!");
			router.refresh();
			setOpen(false);

			// Chamar callback após salvar com sucesso
			if (onDataSaved) {
				onDataSaved();
			}
		} catch (error) {
			console.error("Erro ao atualizar cliente:", JSON.stringify(error, null, 2));
			toast.error("Erro ao atualizar informações");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
					<Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
					<span className="text-sm font-medium">Editar Perfil</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto">
				<DialogHeader className="pb-6">
					<DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
						<User className="w-6 h-6 text-blue-600" />
						Editar Perfil do Cliente
					</DialogTitle>
					<DialogDescription className="text-gray-600">
						Atualize as informações pessoais, documentos e dados de contato
					</DialogDescription>
				</DialogHeader>

				{/* Header com Foto de Perfil */}
				<Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
					<CardContent className="pt-6">
						<div className="flex flex-col sm:flex-row items-center gap-6">
							{/* Avatar */}
							<div className="relative">
								<Avatar className="w-24 h-24 border-4 border-white shadow-lg">
									<AvatarImage src={photoPreview || ""} alt={`${clientData.first_name} ${clientData.last_name}`} />
									<AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
										{getInitials(clientData.first_name, clientData.last_name)}
									</AvatarFallback>
								</Avatar>

								{/* Status de upload */}
								{isUploadingPhoto && (
									<div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
										<Loader2 className="w-8 h-8 text-white animate-spin" />
									</div>
								)}
							</div>

							{/* Informações e Botões de Foto */}
							<div className="flex-1 text-center sm:text-left">
								<h3 className="text-xl font-semibold text-gray-800">
									{clientData.first_name} {clientData.last_name}
								</h3>
								<p className="text-gray-600 mb-4">{clientData.email}</p>

								<div className="flex flex-wrap gap-2 justify-center sm:justify-start">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={handlePhotoSelect}
										className="gap-2 hover:bg-blue-50 hover:border-blue-300"
									>
										<Camera className="w-4 h-4" />
										{photoPreview ? "Alterar Foto" : "Adicionar Foto"}
									</Button>

									{selectedPhoto && (
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleRemovePhoto}
											className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
										>
											<X className="w-4 h-4" />
											Cancelar
										</Button>
									)}
								</div>

								{selectedPhoto && (
									<Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
										<CheckCircle className="w-3 h-3 mr-1" />
										Nova foto selecionada
									</Badge>
								)}
							</div>
						</div>

						{/* Input oculto para foto */}
						<input
							ref={photoInputRef}
							type="file"
							accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
							className="hidden"
							onChange={handlePhotoChange}
						/>
					</CardContent>
				</Card>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<Tabs defaultValue="personal" className="w-full">
							<TabsList className="grid grid-cols-4 mb-6 bg-gray-100 w-full md:space-x-4 p-1 rounded-lg">
								<TabsTrigger
									value="personal"
									className={cn(
										"flex items-center gap-2 data-[state=active]:bg-white relative",
										hasTabErrors("personal") && "ring-2 ring-red-500 ring-offset-2",
									)}
								>
									<User className="w-4 h-4" />
									<span className="hidden sm:inline">Pessoal</span>
									{hasTabErrors("personal") && (
										<div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
											{getTabErrorCount("personal")}
										</div>
									)}
								</TabsTrigger>
								<TabsTrigger
									value="passport"
									className={cn(
										"flex items-center gap-2 data-[state=active]:bg-white relative",
										hasTabErrors("passport") && "ring-2 ring-red-500 ring-offset-2",
									)}
								>
									<BookCheckIcon className="w-4 h-4" />
									<span className="hidden sm:inline">Passaporte</span>
									{hasTabErrors("passport") && (
										<div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
											{getTabErrorCount("passport")}
										</div>
									)}
								</TabsTrigger>
								<TabsTrigger
									value="contact"
									className={cn(
										"flex items-center gap-2 data-[state=active]:bg-white relative",
										hasTabErrors("contact") && "ring-2 ring-red-500 ring-offset-2",
									)}
								>
									<Phone className="w-4 h-4" />
									<span className="hidden sm:inline">Contato</span>
									{hasTabErrors("contact") && (
										<div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
											{getTabErrorCount("contact")}
										</div>
									)}
								</TabsTrigger>
								<TabsTrigger
									value="family"
									className={cn(
										"flex items-center gap-2 data-[state=active]:bg-white relative",
										hasTabErrors("family") && "ring-2 ring-red-500 ring-offset-2",
									)}
								>
									<Users className="w-4 h-4" />
									<span className="hidden sm:inline">Filiação</span>
									{hasTabErrors("family") && (
										<div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
											{getTabErrorCount("family")}
										</div>
									)}
								</TabsTrigger>
							</TabsList>

							{/* Informações Pessoais */}
							<TabsContent value="personal" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											<User className="w-5 h-5 text-blue-600" />
											Dados Pessoais
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="firstName"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Nome
															{isFieldMissing("firstName") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Nome"
																{...field}
																className={cn(
																	"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																	isFieldMissing("firstName") &&
																		"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																)}
															/>
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
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Sobrenome
															{isFieldMissing("lastName") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Sobrenome"
																{...field}
																className={cn(
																	"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																	isFieldMissing("lastName") &&
																		"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																)}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<FormField
												control={form.control}
												name="dateOfBirth"
												render={({ field }) => (
													<FormItem className="flex flex-col">
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Data de Nascimento
															{isFieldMissing("dateOfBirth") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<Popover>
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		variant={"outline"}
																		className={cn(
																			"w-full pl-3 text-left font-normal border-gray-300 hover:border-blue-500",
																			isFieldMissing("dateOfBirth") &&
																				"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																		)}
																	>
																		{field.value && !Number.isNaN(new Date(field.value).getTime()) ? (
																			format(field.value, "dd/MM/yyyy", { locale: ptBR })
																		) : (
																			<span className="text-gray-500">Selecione uma data</span>
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
																	initialFocus
																	captionLayout="dropdown"
																	fromYear={1900}
																	toYear={new Date().getFullYear()}
																/>
															</PopoverContent>
														</Popover>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="gender"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Gênero
															{isFieldMissing("gender") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<Select onValueChange={field.onChange} defaultValue={field.value}>
															<FormControl>
																<SelectTrigger
																	className={cn(
																		"border-gray-300 focus:border-blue-500",
																		isFieldMissing("gender") &&
																			"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																	)}
																>
																	<SelectValue placeholder="Selecione o gênero" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="M">Masculino</SelectItem>
																<SelectItem value="F">Feminino</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="maritalStatus"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Estado Civil
															{isFieldMissing("maritalStatus") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<Select onValueChange={field.onChange} defaultValue={field.value}>
															<FormControl>
																<SelectTrigger
																	className={cn(
																		"border-gray-300 focus:border-blue-500",
																		isFieldMissing("maritalStatus") &&
																			"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																	)}
																>
																	<SelectValue placeholder="Selecione o estado civil" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="SINGLE">Solteiro(a)</SelectItem>
																<SelectItem value="MARRIED">Casado(a)</SelectItem>
																<SelectItem value="DIVORCED">Divorciado(a)</SelectItem>
																<SelectItem value="WIDOWED">Viúvo(a)</SelectItem>
																<SelectItem value="SEPARATED">Separado(a)</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="nationality"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Nacionalidade
															{isFieldMissing("nationality") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Nacionalidade"
																{...field}
																className={cn(
																	"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																	isFieldMissing("nationality") &&
																		"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																)}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="countryOfBirth"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															País de Nascimento
															{isFieldMissing("countryOfBirth") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<FormControl>
															<Input
																placeholder="País de Nascimento"
																{...field}
																className={cn(
																	"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																	isFieldMissing("countryOfBirth") &&
																		"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																)}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={form.control}
											name="placeOfBirth"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
														Local de Nascimento
														{isFieldMissing("placeOfBirth") && <AlertCircle className="w-4 h-4 text-red-500" />}
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Local de Nascimento"
															{...field}
															className={cn(
																"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																isFieldMissing("placeOfBirth") &&
																	"border-red-500 focus:border-red-500 focus:ring-red-500/20",
															)}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Informações do Passaporte */}
							<TabsContent value="passport" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											<BookCheckIcon className="w-5 h-5 text-blue-600" />
											Documentação
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="passportNumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
														Número do Passaporte
														{isFieldMissing("passportNumber") && <AlertCircle className="w-4 h-4 text-red-500" />}
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Número do Passaporte"
															{...field}
															className={cn(
																"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 font-mono",
																isFieldMissing("passportNumber") &&
																	"border-red-500 focus:border-red-500 focus:ring-red-500/20",
															)}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="passportIssueDate"
												render={({ field }) => (
													<FormItem className="flex flex-col">
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Data de Emissão
															{isFieldMissing("passportIssueDate") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<Popover>
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		variant={"outline"}
																		className={cn(
																			"w-full pl-3 text-left font-normal border-gray-300 hover:border-blue-500",
																			isFieldMissing("passportIssueDate") &&
																				"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																		)}
																	>
																		{field.value && !Number.isNaN(new Date(field.value).getTime()) ? (
																			format(field.value, "dd/MM/yyyy", { locale: ptBR })
																		) : (
																			<span className="text-gray-500">Selecione uma data</span>
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
																	initialFocus
																	captionLayout="dropdown"
																	fromYear={1900}
																	toYear={new Date().getFullYear()}
																/>
															</PopoverContent>
														</Popover>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="passportExpiry"
												render={({ field }) => (
													<FormItem className="flex flex-col">
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Data de Expiração
															{isFieldMissing("passportExpiry") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<Popover>
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		variant={"outline"}
																		className={cn(
																			"w-full pl-3 text-left font-normal border-gray-300 hover:border-blue-500",
																			isFieldMissing("passportExpiry") &&
																				"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																		)}
																	>
																		{field.value && !Number.isNaN(new Date(field.value).getTime()) ? (
																			format(field.value, "dd/MM/yyyy", { locale: ptBR })
																		) : (
																			<span className="text-gray-500">Selecione uma data</span>
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
																	initialFocus
																	captionLayout="dropdown"
																	fromYear={new Date().getFullYear()}
																	toYear={new Date().getFullYear() + 20}
																/>
															</PopoverContent>
														</Popover>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Informações de Contato */}
							<TabsContent value="contact" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											<Mail className="w-5 h-5 text-blue-600" />
											Contato
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Email
															{isFieldMissing("email") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<FormControl>
															<Input
																type="email"
																placeholder="Email"
																{...field}
																className={cn(
																	"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																	isFieldMissing("email") &&
																		"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																)}
															/>
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
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Telefone
															{isFieldMissing("phone") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Telefone"
																{...field}
																className={cn(
																	"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																	isFieldMissing("phone") &&
																		"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																)}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											<MapPin className="w-5 h-5 text-blue-600" />
											Endereço
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div className="md:col-span-2">
												<FormField
													control={form.control}
													name="street"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
																Rua
																{isFieldMissing("street") && <AlertCircle className="w-4 h-4 text-red-500" />}
															</FormLabel>
															<FormControl>
																<Input
																	placeholder="Rua"
																	{...field}
																	className={cn(
																		"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																		isFieldMissing("street") &&
																			"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																	)}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											<FormField
												control={form.control}
												name="number"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Número
															{isFieldMissing("number") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Número"
																{...field}
																className={cn(
																	"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																	isFieldMissing("number") &&
																		"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																)}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="complement"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-medium">Complemento</FormLabel>
														<FormControl>
															<Input
																placeholder="Complemento (opcional)"
																{...field}
																value={field.value ?? ""}
																className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="neighborhood"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Localidade
															{isFieldMissing("neighborhood") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Localidade"
																{...field}
																className={cn(
																	"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																	isFieldMissing("neighborhood") &&
																		"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																)}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<FormField
												control={form.control}
												name="city"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Concelho
															{isFieldMissing("city") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Concelho"
																{...field}
																className={cn(
																	"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																	isFieldMissing("city") && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
																)}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="state"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Distrito
															{isFieldMissing("state") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Estado"
																{...field}
																className={cn(
																	"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																	isFieldMissing("state") &&
																		"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																)}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="zipCode"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
															Código Postal
															{isFieldMissing("zipCode") && <AlertCircle className="w-4 h-4 text-red-500" />}
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Código Postal"
																{...field}
																className={cn(
																	"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																	isFieldMissing("zipCode") &&
																		"border-red-500 focus:border-red-500 focus:ring-red-500/20",
																)}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={form.control}
											name="country"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
														País
														{isFieldMissing("country") && <AlertCircle className="w-4 h-4 text-red-500" />}
													</FormLabel>
													<FormControl>
														<Input
															placeholder="País"
															{...field}
															className={cn(
																"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																isFieldMissing("country") &&
																	"border-red-500 focus:border-red-500 focus:ring-red-500/20",
															)}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Informações de Filiação */}
							<TabsContent value="family" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											<Users className="w-5 h-5 text-blue-600" />
											Filiação
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="fatherName"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
														Nome do Pai
														{isFieldMissing("fatherName") && <AlertCircle className="w-4 h-4 text-red-500" />}
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Nome completo do pai"
															{...field}
															className={cn(
																"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																isFieldMissing("fatherName") &&
																	"border-red-500 focus:border-red-500 focus:ring-red-500/20",
															)}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="motherName"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-gray-700 font-medium flex items-center gap-2">
														Nome da Mãe
														{isFieldMissing("motherName") && <AlertCircle className="w-4 h-4 text-red-500" />}
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Nome completo da mãe"
															{...field}
															className={cn(
																"border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
																isFieldMissing("motherName") &&
																	"border-red-500 focus:border-red-500 focus:ring-red-500/20",
															)}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>

						<DialogFooter className="gap-2 pt-6 border-t">
							<Button type="button" variant="outline" onClick={() => setOpen(false)} className="px-6">
								Cancelar
							</Button>
							<Button
								type="submit"
								disabled={isLoading}
								className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
							>
								{isLoading ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										{isUploadingPhoto ? "Enviando foto..." : "Salvando..."}
									</>
								) : (
									<>
										<CheckCircle className="w-4 h-4 mr-2" />
										Salvar alterações
									</>
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
