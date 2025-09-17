"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createService, updateService } from "@/actions/service";
import { createServiceCategory, getServiceCategories } from "@/actions/service-category";
import { handleCreateService } from "@/actions/service-form-server-action";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { service } from "@/generated/prisma";
import { useRouter } from "next/navigation";

// Schemas
const serviceCategorySchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

const serviceSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	price: z.number(),
	duration: z.number().nullable().optional(),
	isActive: z.boolean().default(true),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	categoryId: z.string(),
});

// Form schemas (without auto-generated fields)
const createServiceSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	description: z.string().min(1, "Descrição é obrigatória"),
	price: z.number().min(0, "Preço deve ser maior ou igual a zero"),
	duration: z.number().nullable().optional(),
	isActive: z.boolean(),
	categoryId: z.string().min(1, "Categoria é obrigatória"),
});

const createCategorySchema = z.object({
	name: z.string().min(1, "Nome da categoria é obrigatório"),
	description: z.string().optional(),
});

type CreateServiceForm = z.infer<typeof createServiceSchema>;
type CreateCategoryForm = z.infer<typeof createCategorySchema>;

export function ServiceFormDialog({
	open,
	setOpen,
	onServiceCreated,
	onServiceUpdated,
	serviceToEdit,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	onServiceCreated?: () => void;
	onServiceUpdated?: () => void;
	serviceToEdit?: service | null;
}) {
	const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
	const [categories, setCategories] = useState<{ id: string; name: string; description: string | null }[]>([]);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [newCategoryDescription, setNewCategoryDescription] = useState("");
	const router = useRouter();
	useEffect(() => {
		async function fetchCategories() {
			const data = await getServiceCategories();
			setCategories(data);
		}
		fetchCategories();
	}, []);

	const serviceForm = useForm<CreateServiceForm>({
		resolver: zodResolver(createServiceSchema),
		defaultValues: {
			name: "",
			description: "",
			price: 0,
			duration: null,
			isActive: true,
			categoryId: "",
		},
	});

	useEffect(() => {
		if (serviceToEdit) {
			serviceForm.reset({
				name: serviceToEdit.name,
				description: serviceToEdit.description,
				price: serviceToEdit.price,
				duration: serviceToEdit.duration,
				isActive: serviceToEdit.is_active,
				categoryId: serviceToEdit.category_id,
			});
		} else {
			serviceForm.reset({
				name: "",
				description: "",
				price: 0,
				duration: null,
				isActive: true,
				categoryId: "",
			});
		}
	}, [serviceForm, serviceToEdit]);

	async function onSubmitService(data: CreateServiceForm) {
		try {
			// Mapear os dados do formulário para o formato esperado pelo schema
			const serviceData = {
				name: data.name,
				description: data.description,
				price: data.price,
				duration: data.duration,
				is_active: data.isActive,
				category_id: data.categoryId,
			};

			if (serviceToEdit) {
				await updateService(serviceToEdit.id, serviceData);
				if (onServiceUpdated) onServiceUpdated();
			} else {
				await createService(serviceData);
				if (onServiceCreated) onServiceCreated();
			}
			setOpen(false);
			serviceForm.reset();
		} catch (error) {
			console.log("Erro detalhado:", JSON.stringify(error, null, 2));
			alert(`Erro ao salvar serviço: ${error}`);
		}
	}

	async function handleCreateCategory() {
		if (!newCategoryName.trim()) return;

		const newCategory = await createServiceCategory({
			name: newCategoryName,
			description: newCategoryDescription || null,
		});

		setCategories([...categories, newCategory]);
		serviceForm.setValue("categoryId", newCategory.id);
		setShowNewCategoryForm(false);
		setNewCategoryName("");
		setNewCategoryDescription("");
	}

	return (
		<Form {...serviceForm}>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button className="bg-slate-900 hover:bg-slate-800 text-white">
						<Plus className="mr-2 h-4 w-4" />
						Novo Serviço
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
					<DialogHeader className="space-y-3">
						<div className="flex items-center space-x-2">
							<Building2 className="h-5 w-5 text-slate-600" />
							<DialogTitle className="text-xl font-semibold text-slate-900">Cadastrar Novo Serviço</DialogTitle>
						</div>
						<DialogDescription className="text-slate-600">
							Preencha as informações do serviço jurídico que será oferecido pelo escritório.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={serviceForm.handleSubmit(onSubmitService)} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={serviceForm.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-slate-700 font-medium">Nome do Serviço</FormLabel>
										<FormControl>
											<Input
												placeholder="Ex: Consultoria Jurídica"
												className="border-slate-300 focus:border-slate-500"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={serviceForm.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-slate-700 font-medium">Preço (€)</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="0,00"
												className="border-slate-300 focus:border-slate-500"
												{...field}
												onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={serviceForm.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-slate-700 font-medium">Descrição</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Descreva detalhadamente o serviço oferecido..."
											className="border-slate-300 focus:border-slate-500 min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={serviceForm.control}
								name="duration"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-slate-700 font-medium">Duração (minutos)</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Ex: 60"
												className="border-slate-300 focus:border-slate-500"
												{...field}
												value={field.value || ""}
												onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : null)}
											/>
										</FormControl>
										<FormDescription className="text-slate-500">Opcional - tempo estimado em minutos</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={serviceForm.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-200 p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-slate-700 font-medium">Serviço Ativo</FormLabel>
											<FormDescription className="text-slate-500">Disponível para contratação</FormDescription>
										</div>
										<FormControl>
											<Switch checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<Separator className="bg-slate-200" />

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label className="text-slate-700 font-medium">Categoria</Label>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
									className="text-slate-600 border-slate-300 hover:bg-slate-50"
								>
									<Plus className="mr-1 h-3 w-3" />
									Nova Categoria
								</Button>
							</div>

							{!showNewCategoryForm ? (
								<FormField
									control={serviceForm.control}
									name="categoryId"
									render={({ field }) => (
										<>
											<Select onValueChange={field.onChange} value={field.value}>
												<SelectTrigger>
													<SelectValue placeholder="Selecione uma categoria" />
												</SelectTrigger>
												<SelectContent>
													{categories.map((category) => (
														<SelectItem key={category.id} value={category.id}>
															{category.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<input type="hidden" name="categoryId" value={field.value} />
										</>
									)}
								/>
							) : (
								<div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
									<h4 className="font-medium text-slate-900 mb-3">Nova Categoria</h4>
									<div className="space-y-3">
										<div>
											<Label className="text-sm font-medium text-slate-700">Nome da Categoria</Label>
											<Input
												placeholder="Ex: Direito Penal"
												className="border-slate-300 focus:border-slate-500 bg-white mt-1"
												value={newCategoryName}
												onChange={(e) => setNewCategoryName(e.target.value)}
											/>
											{!newCategoryName.trim() && newCategoryName !== "" && (
												<p className="text-sm text-red-600 mt-1">Nome da categoria é obrigatório</p>
											)}
										</div>

										<div>
											<Label className="text-sm font-medium text-slate-700">Descrição (Opcional)</Label>
											<Input
												placeholder="Breve descrição da categoria"
												className="border-slate-300 focus:border-slate-500 bg-white mt-1"
												value={newCategoryDescription}
												onChange={(e) => setNewCategoryDescription(e.target.value)}
											/>
										</div>

										<div className="flex space-x-2">
											<Button
												type="button"
												size="sm"
												onClick={handleCreateCategory}
												disabled={!newCategoryName.trim()}
												className="bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
											>
												Criar Categoria
											</Button>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => {
													setShowNewCategoryForm(false);
													setNewCategoryName("");
													setNewCategoryDescription("");
												}}
												className="border-slate-300 text-slate-600 hover:bg-slate-50"
											>
												Cancelar
											</Button>
										</div>
									</div>
								</div>
							)}
						</div>

						<Separator className="bg-slate-200" />

						<div className="flex justify-end space-x-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								className="border-slate-300 text-slate-600 hover:bg-slate-50"
							>
								Cancelar
							</Button>
							<Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-6">
								Cadastrar Serviço
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</Form>
	);
}
