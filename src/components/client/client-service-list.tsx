"use client";

import { getServicesByClient } from "@/actions/client-service";
import { getClientServiceHistory } from "@/actions/client-service-history";
import { ClientProcessStatus } from "@/components/client/client-process-status";
import { ClientServiceFormDialog } from "@/components/client/client-service-form-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	AlertCircle,
	ArrowUp,
	Building2,
	Calendar,
	CheckCircle2,
	ChevronRight,
	Clock,
	Edit3,
	FileText,
	History,
	Minus,
	Trash2,
	User,
	XCircle,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ClientServiceListProps {
	id: string;
	isAdmin?: boolean;
}

export function ClientServiceList({ id, isAdmin }: ClientServiceListProps) {
	const [services, setServices] = useState<any[] | null>(null);
	const [histories, setHistories] = useState<Record<string, any[]>>({});

	useEffect(
		function loadServicesAndHistories() {
			async function fetchServicesAndHistories() {
				const data = await getServicesByClient(id);
				console.log("Dados dos serviços:", JSON.stringify(data, null, 2));
				setServices(data);
				const historiesObj: Record<string, any[]> = {};
				for (const cs of data) {
					const history = await getClientServiceHistory(cs.id);
					historiesObj[cs.id] = history;
				}
				setHistories(historiesObj);
			}
			fetchServicesAndHistories();
		},
		[id],
	);

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "COMPLETED":
				return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
			case "CANCELLED":
				return <XCircle className="w-4 h-4 text-red-600" />;
			case "IN_PROGRESS":
				return <Zap className="w-4 h-4 text-blue-600" />;
			default:
				return <Clock className="w-4 h-4 text-amber-600" />;
		}
	};

	const getPriorityIcon = (priority: string) => {
		switch (priority) {
			case "URGENT":
				return <AlertCircle className="w-4 h-4 text-red-600" />;
			case "HIGH":
				return <ArrowUp className="w-4 h-4 text-orange-600" />;
			case "MEDIUM":
				return <Minus className="w-4 h-4 text-blue-600" />;
			default:
				return <Minus className="w-4 h-4 text-slate-600" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "COMPLETED":
				return "bg-emerald-50 text-emerald-700 border-emerald-200";
			case "CANCELLED":
				return "bg-red-50 text-red-700 border-red-200";
			case "IN_PROGRESS":
				return "bg-blue-50 text-blue-700 border-blue-200";
			default:
				return "bg-amber-50 text-amber-700 border-amber-200";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "URGENT":
				return "bg-red-50 text-red-700 border-red-200";
			case "HIGH":
				return "bg-orange-50 text-orange-700 border-orange-200";
			case "MEDIUM":
				return "bg-blue-50 text-blue-700 border-blue-200";
			default:
				return "bg-slate-50 text-slate-700 border-slate-200";
		}
	};

	const getStatusDisplayName = (status: string) => {
		switch (status) {
			case "PENDING":
				return "Pendente";
			case "IN_PROGRESS":
				return "Em Andamento";
			case "COMPLETED":
				return "Concluído";
			case "CANCELLED":
				return "Cancelado";
			default:
				return status;
		}
	};

	const getPriorityDisplayName = (priority: string) => {
		switch (priority) {
			case "LOW":
				return "Baixa";
			case "MEDIUM":
				return "Média";
			case "HIGH":
				return "Alta";
			case "URGENT":
				return "Urgente";
			default:
				return priority;
		}
	};

	// ... existing code ...

	if (services === null) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-10 w-32" />
				</div>
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
						<div className="space-y-4">
							<div className="flex items-start justify-between">
								<div className="space-y-2 flex-1">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-5 w-48" />
									<Skeleton className="h-4 w-64" />
									<div className="flex gap-2">
										<Skeleton className="h-6 w-16" />
										<Skeleton className="h-6 w-16" />
									</div>
								</div>
								<div className="flex gap-2">
									<Skeleton className="h-8 w-8 rounded-lg" />
									<Skeleton className="h-8 w-8 rounded-lg" />
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (services.length === 0) {
		return (
			<div className="w-full">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold text-slate-900">
						Serviços vinculados
						<Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-600">
							0
						</Badge>
					</h3>
					<ClientServiceFormDialog clientId={id} />
				</div>

				<div className="flex flex-col items-center justify-center gap-6 p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-gradient-to-br from-slate-50 to-white">
					<div className="relative">
						<div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-10 blur-xl" />
						<div className="relative bg-white rounded-full p-4 shadow-lg border border-slate-200">
							<Building2 className="w-8 h-8 text-slate-400" />
						</div>
					</div>
					<div className="text-center space-y-2">
						<h4 className="text-lg font-medium text-slate-900">Nenhum serviço vinculado</h4>
						<p className="text-slate-500 max-w-md">
							Para vincular um serviço, clique no botão "Adicionar Serviço" e comece a gerenciar os trabalhos deste
							cliente.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full mx-auto">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-xl font-semibold text-slate-900">
					Serviços vinculados
					<Badge variant="secondary" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
						{services.length}
					</Badge>
				</h3>
				<ClientServiceFormDialog clientId={id} />
			</div>

			<div className="space-y-4">
				{services.map(function renderService(cs) {
					return (
						<div
							key={cs.id}
							className="group relative border border-slate-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300"
						>
							{/* Status indicator line */}
							<div
								className={`absolute left-0 top-0 w-1 h-full rounded-l-xl ${
									cs.status === "COMPLETED"
										? "bg-emerald-500"
										: cs.status === "CANCELLED"
											? "bg-red-500"
											: cs.status === "IN_PROGRESS"
												? "bg-blue-500"
												: "bg-amber-500"
								}`}
							/>

							<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
								<div className="flex-1 space-y-4">
									{/* Header */}
									<div className="flex items-start justify-between">
										<div className="space-y-1">
											<div className="flex items-center gap-2 text-sm text-slate-600">
												<FileText className="w-4 h-4" />
												<span className="font-medium">OS: {cs.os_number || "N/A"}</span>
											</div>
											<h4 className="font-semibold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
												{cs.service?.name}
											</h4>
											{cs.service?.description && (
												<p className="text-slate-600 leading-relaxed">{cs.service.description}</p>
											)}
										</div>
									</div>

									{/* Dates */}
									<div className="flex items-center gap-4 text-sm text-slate-600">
										{cs.start_date && (
											<div className="flex items-center gap-1">
												<Calendar className="w-4 h-4" />
												<span>Início: {new Date(cs.start_date).toLocaleDateString("pt-BR")}</span>
											</div>
										)}
										{cs.end_date && (
											<div className="flex items-center gap-1">
												<Calendar className="w-4 h-4" />
												<span>Fim: {new Date(cs.end_date).toLocaleDateString("pt-BR")}</span>
											</div>
										)}
									</div>

									{/* Status and Priority Badges */}
									<div className="flex items-center gap-3 flex-wrap">
										<div
											className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(cs.status)}`}
										>
											{getStatusIcon(cs.status)}
											<span>{getStatusDisplayName(cs.status)}</span>
										</div>
										<div
											className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getPriorityColor(cs.priority)}`}
										>
											{getPriorityIcon(cs.priority)}
											<span>{getPriorityDisplayName(cs.priority)}</span>
										</div>
									</div>

									{/* Notes */}
									{cs.notes && (
										<div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
											<div className="flex items-start gap-2">
												<FileText className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
												<div>
													<span className="text-sm font-medium text-slate-700">Notas:</span>
													<p className="text-sm text-slate-600 mt-1">{cs.notes}</p>
												</div>
											</div>
										</div>
									)}

									{/* History Accordion */}
									<Accordion type="single" collapsible className="w-full">
										<AccordionItem value="history" className="border-none">
											<AccordionTrigger className="hover:no-underline py-3 px-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
												<div className="flex items-center gap-2">
													<History className="w-4 h-4 text-slate-600" />
													<span className="font-medium text-slate-700">Histórico de alterações</span>
													{histories[cs.id] && histories[cs.id].length > 0 && (
														<Badge variant="outline" className="ml-2 bg-white text-xs">
															{histories[cs.id].length}
														</Badge>
													)}
												</div>
											</AccordionTrigger>
											<AccordionContent className="pt-4">
												{histories[cs.id] && histories[cs.id].length > 0 ? (
													<div className="space-y-3">
														{histories[cs.id].map(function renderHistory(h, idx) {
															return (
																<div
																	key={h.id || idx}
																	className="border border-slate-200 rounded-lg p-4 bg-gradient-to-r from-slate-50 to-white"
																>
																	<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
																		<div className="flex items-center gap-2">
																			<div className="w-2 h-2 bg-blue-500 rounded-full" />
																			<span className="font-medium text-slate-700">{h.field}</span>
																		</div>
																		<div className="flex items-center gap-1 text-xs text-slate-500">
																			<Calendar className="w-3 h-3" />
																			{new Date(h.changed_at).toLocaleString("pt-BR")}
																		</div>
																	</div>

																	<div className="space-y-2">
																		<div className="flex items-center gap-2 text-sm">
																			<span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs">
																				{h.old_value || "-"}
																			</span>
																			<ChevronRight className="w-3 h-3 text-slate-400" />
																			<span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
																				{h.new_value || "-"}
																			</span>
																		</div>

																		{h.note && (
																			<div className="flex items-start gap-2 mt-2 p-2 bg-blue-50 rounded">
																				<FileText className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
																				<span className="text-xs text-blue-700">{h.note}</span>
																			</div>
																		)}

																		{h.changed_by && (
																			<div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
																				<User className="w-3 h-3" />
																				<span>Alterado por: {h.changed_by}</span>
																			</div>
																		)}
																	</div>
																</div>
															);
														})}
													</div>
												) : (
													<div className="text-center py-6">
														<History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
														<p className="text-slate-400 text-sm">Nenhuma alteração registrada ainda.</p>
													</div>
												)}
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>

								{/* Action Buttons */}
								<div className="flex items-center gap-2 lg:flex-col lg:gap-2">
									{isAdmin && (
										<div className="lg:mb-2">
											<ClientProcessStatus client={cs.client} clientService={cs} />
										</div>
									)}

									{isAdmin && (
										<>
									<button
										type="button"
										title="Editar serviço"
										className="group/btn inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:shadow-sm"
									>
										<Edit3 className="w-4 h-4 text-slate-600 group-hover/btn:text-blue-600 transition-colors" />
									</button>

									<button
										type="button"
										title="Remover serviço"
										className="group/btn inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:border-red-300 transition-all duration-200 hover:shadow-sm"
									>
											<Trash2 className="w-4 h-4 text-slate-600 group-hover/btn:text-red-600 transition-colors" />
											</button>
											</>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
