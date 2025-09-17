"use client";

import { AnimatedList } from "@/components/ui/animated-list";
import { AuroraText } from "@/components/ui/aurora-text";
import { Building2, Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { deleteService } from "@/actions/service";

import { getServices } from "@/actions/service";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { service } from "@/generated/prisma";
import { toast } from "sonner";
import { ServiceFormDialog } from "./service-form-dialog";

// Types based on the schemas
interface Service extends service {
	category?: {
		id: string;
		name: string;
		description: string | null;
	};
}

export function ServiceListClient() {
	const [services, setServices] = useState<any[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [serviceToEdit, setServiceToEdit] = useState<service | null>(null);
	const [openDialog, setOpenDialog] = useState(false);

	const fetchServices = useCallback(async () => {
		const data = await getServices();
		setServices(data);
	}, []);

	useEffect(() => {
		fetchServices();
	}, [fetchServices]);

	// Filter services based on search term
	const filteredServices = services.filter(
		(service) =>
			service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			service.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			service.description.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleNewService = () => {
		setServiceToEdit(null);
		setOpenDialog(true);
	};

	const handleEdit = (service: Service) => {
		setServiceToEdit(service);
		setOpenDialog(true);
	};

	const handleDelete = async (serviceId: string) => {
		setIsLoading(true);
		try {
			await deleteService(serviceId);
			setServices(services.filter((service) => service.id !== serviceId));
			toast.success("Serviço deletado com sucesso");
		} catch (error) {
			console.error("Erro ao deletar serviço:", error);
			toast.error("Erro ao deletar serviço");
		} finally {
			setIsLoading(false);
		}
	};

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("pt-PT", {
			style: "currency",
			currency: "EUR",
		}).format(value);
	};

	const formatDuration = (minutes: number | null) => {
		if (!minutes) return "Não definido";
		if (minutes < 60) return `${minutes}min`;
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
	};

	return (
		<div className="space-y-6">
			<Card className="border-slate-200">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Building2 className="h-5 w-5 text-slate-600" />
							<div>
								<CardTitle className="text-xl font-semibold text-slate-900"><AuroraText>Serviços Jurídicos</AuroraText></CardTitle>
								<CardDescription className="text-slate-600">
									Gerencie os serviços oferecidos pelo escritório
								</CardDescription>
							</div>
						</div>
						{/* <Button onClick={handleNewService} className="bg-slate-900 hover:bg-slate-800 text-white">
							<Plus className="mr-2 h-4 w-4" />
							Novo Serviço
						</Button> */}
						<ServiceFormDialog
							open={openDialog}
							setOpen={setOpenDialog}
							onServiceCreated={fetchServices}
							onServiceUpdated={fetchServices}
							serviceToEdit={serviceToEdit}
						/>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Search Bar */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
						<Input
							placeholder="Buscar serviços por nome, categoria ou descrição..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 border-slate-300 focus:border-slate-500"
						/>
					</div>

					{/* Services Table */}
					{filteredServices.length === 0 ? (
						<div className="text-center py-12">
							<Building2 className="mx-auto h-12 w-12 text-slate-400 mb-4" />
							<h3 className="text-lg font-medium text-slate-900 mb-2">
								{searchTerm ? "Nenhum serviço encontrado" : "Nenhum serviço cadastrado"}
							</h3>
							<p className="text-slate-600 mb-4">
								{searchTerm
									? "Tente ajustar os termos da sua busca"
									: "Comece cadastrando o primeiro serviço do escritório"}
							</p>
							{!searchTerm && (
								<ServiceFormDialog
									open={openDialog}
									setOpen={setOpenDialog}
									onServiceCreated={fetchServices}
									onServiceUpdated={fetchServices}
									serviceToEdit={serviceToEdit}
								/>
							)}
						</div>
					) : (
						<div className="border border-slate-200 rounded-lg overflow-hidden">
							<Table>
								<TableHeader>
									<TableRow className="bg-slate-50">
										<TableHead className="font-semibold text-slate-700">Serviço</TableHead>
										<TableHead className="font-semibold text-slate-700">Categoria</TableHead>
										<TableHead className="font-semibold text-slate-700">Preço</TableHead>
										<TableHead className="font-semibold text-slate-700">Duração</TableHead>
										<TableHead className="font-semibold text-slate-700">Status</TableHead>
										<TableHead className="font-semibold text-slate-700 text-right">Ações</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
										{filteredServices.map((service) => (
										<TableRow key={service.id} className="hover:bg-slate-50">
											<TableCell>
												<div>
													<div className="font-medium text-slate-900">{service.name}</div>
													<div className="text-sm text-slate-600 max-w-xs truncate">{service.description}</div>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
													{service.category?.name}
												</Badge>
											</TableCell>
											<TableCell className="font-medium text-slate-900">{formatCurrency(service.price)}</TableCell>
											<TableCell className="text-slate-600">{formatDuration(service.duration)}</TableCell>
											<TableCell>
												<Badge
													variant={service.is_active ? "default" : "secondary"}
													className={
														service.is_active
															? "bg-green-100 text-green-800 hover:bg-green-200"
															: "bg-red-100 text-red-800 hover:bg-red-200"
													}
												>
													{service.is_active ? "Ativo" : "Inativo"}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end space-x-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleEdit(service)}
														className="border-slate-300 text-slate-600 hover:bg-slate-50"
													>
														<Edit className="h-4 w-4" />
													</Button>

													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button
																variant="outline"
																size="sm"
																className="border-red-300 text-red-600 hover:bg-red-50"
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle className="text-slate-900">Confirmar exclusão</AlertDialogTitle>
																<AlertDialogDescription className="text-slate-600">
																	Tem certeza que deseja excluir o serviço "{service.name}"? Esta ação não pode ser
																	desfeita.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel className="border-slate-300 text-slate-600 hover:bg-slate-50">
																	Cancelar
																</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() => handleDelete(service.id)}
																	disabled={isLoading}
																	className="bg-red-600 hover:bg-red-700 text-white"
																>
																	{isLoading ? "Excluindo..." : "Excluir"}
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}

					{/* Summary */}
					{filteredServices.length > 0 && (
						<div className="flex items-center justify-between text-sm text-slate-600 pt-4 border-t border-slate-200">
							<div>
								Mostrando {filteredServices.length} de {services.length} serviços
							</div>
							<div>
								{services.filter((s) => s.is_active).length} ativos • {services.filter((s) => !s.is_active).length}{" "}
								inativos
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
