"use client";

import { sendInvitationAction } from "@/actions/send-invitation-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { address, client } from "@/generated/prisma/client";
import {
	BookOpen,
	Building2,
	Calendar,
	Clock,
	FileText,
	Gavel,
	Globe,
	Home,
	Mail,
	MapPin,
	Phone,
	Scale,
	Shield,
	User,
	UserCheck,
	Users,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EditClientDialog } from "./edit-client-dialog";

interface ClientDataProps {
	clientData: client & { address?: address[] };
}

export function ClientCard({ clientData }: ClientDataProps) {
	const [isSending, setIsSending] = useState(false);

	const handleSendInvitation = async () => {
		setIsSending(true);
		try {
			const result = await sendInvitationAction({
				passportNumber: clientData.passport_number,
				email: clientData.email,
				phone: clientData.phone,
			});

			if (result === "ok") {
				toast.success("Convite enviado com sucesso!");
			} else {
				toast.error("Falha ao enviar convite. Verifique o console para mais detalhes.");
			}
		} catch (error) {
			console.error("Erro ao enviar convite:", error);
			toast.error("Ocorreu um erro inesperado.");
		} finally {
			setIsSending(false);
		}
	};

	const formatDate = (date: Date | string | undefined) => {
		if (!date) return "N/A";
		return new Date(date).toLocaleDateString("pt-PT", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	const formatDateTime = (date: Date | string) => {
		return new Date(date).toLocaleString("pt-PT", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getGenderLabel = (gender: string | null) => {
		if (!gender) return "N/A";
		return gender === "M" ? "Masculino" : "Feminino";
	};

	const getMaritalStatusLabel = (status: string | null) => {
		if (!status) return "N/A";
		const statusMap = {
			SINGLE: "Solteiro(a)",
			MARRIED: "Casado(a)",
			DIVORCED: "Divorciado(a)",
			WIDOWED: "Viúvo(a)",
			SEPARATED: "Separado(a)",
		};
		return statusMap[status as keyof typeof statusMap] || status;
	};

	const getInitials = (first_name: string, last_name: string) => {
		return `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase();
	};

	const isPassportExpiringSoon = (passport_expiry: Date | null) => {
		if (!passport_expiry) return false;
		const now = new Date();
		const expiry = new Date(passport_expiry);
		const diffTime = expiry.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays <= 90 && diffDays > 0;
	};

	const isPassportExpired = (passport_expiry: Date | null) => {
		if (!passport_expiry) return false;
		return new Date(passport_expiry) < new Date();
	};

	const filiation = clientData.filiation as { father?: string; mother?: string } | null;

	return (
		<div className="w-full h-[calc(100vh-var(--header-height))] bg-slate-50">
			{/* Header Professional - Estilo escritório de advocacia */}
			<div className="bg-blue-800 rounded-2xl ">
				<div className="px-6 py-6 border-b border-blue-700/50">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						<div className="flex items-center gap-6">
							{/* Avatar com estilo profissional */}
							<div className="relative">
								<Avatar className="w-20 h-20 border-4 border-amber-400/20 shadow-2xl ring-4 ring-blue-600/30 rounded-full">
									<AvatarImage
										src={clientData.photo_url ?? ""}
										alt={`${clientData.first_name} ${clientData.last_name}`}
									/>
									<AvatarFallback className="text-xl font-bold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900">
										{getInitials(clientData.first_name, clientData.last_name)}
									</AvatarFallback>
								</Avatar>
								<div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full border-4 border-blue-900 flex items-center justify-center shadow-lg">
									<UserCheck className="w-4 h-4 text-white" />
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<Scale className="w-5 h-5 text-amber-400" />
									<CardTitle className="text-xl lg:text-2xl font-bold text-white tracking-tight">
										{clientData.first_name} {clientData.last_name}
									</CardTitle>
								</div>
								<div className="flex items-center flex-wrap gap-3">
									<Badge variant="outline" className="bg-blue-800/50 border-blue-600 text-white font-mono text-xs">
										<Building2 className="w-3 h-3 mr-2" />
										Cliente ID: {clientData.client_id}
									</Badge>
									<Badge
										variant={
											isPassportExpired(clientData.passport_expiry)
												? "destructive"
												: isPassportExpiringSoon(clientData.passport_expiry)
													? "secondary"
													: "default"
										}
										className={`text-xs shadow-lg ${
											isPassportExpired(clientData.passport_expiry)
												? "bg-red-600/90 border-red-500"
												: isPassportExpiringSoon(clientData.passport_expiry)
													? "bg-amber-600/90 border-amber-500"
													: "bg-emerald-600/90 border-emerald-500"
										}`}
									>
										<Shield className="w-3 h-3 mr-2" />
										{isPassportExpired(clientData.passport_expiry)
											? "Documentação Expirada"
											: isPassportExpiringSoon(clientData.passport_expiry)
												? "Expiração Próxima"
												: "Documentação Válida"}
									</Badge>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<EditClientDialog clientData={clientData} />
							{clientData.userId ? (
								<Badge className="bg-emerald-600 text-white px-4 py-2 text-sm">
									<Gavel className="w-4 h-4 mr-2" />
									Cliente Ativo
								</Badge>
							) : (
								<Button 
									onClick={handleSendInvitation} 
									disabled={isSending}
									className="bg-amber-600 hover:bg-amber-700 text-slate-900 font-semibold px-6 py-2 shadow-lg"
								>
									<Mail className="w-4 h-4 mr-2" />
									{isSending ? "Enviando..." : "Enviar Convite"}
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Área de Tabs - Estilo profissional */}
			<div className="flex-1 bg-white">
				<Tabs defaultValue="personal" className="h-full flex flex-col">
					{/* Tab Navigation - Design advocacia */}
					<div className="bg-white border-b border-slate-200 px-6 pt-4">
						<TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-12 bg-slate-100 p-1 rounded-lg">
							<TabsTrigger 
								value="personal" 
								className="gap-2 py-2 px-3 data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all text-sm"
							>
								<User className="w-5 h-5" /> 
								<span className="hidden sm:inline">Dados Pessoais</span>
								<span className="sm:hidden">Pessoal</span>
							</TabsTrigger>
							<TabsTrigger 
								value="contact" 
								className="gap-2 py-2 px-3 data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all text-sm"
							>
								<Mail className="w-4 h-4" /> 
								<span className="hidden sm:inline">Contato</span>
								<span className="sm:hidden">Contato</span>
							</TabsTrigger>
							<TabsTrigger 
								value="passport" 
								className="gap-2 py-2 px-3 data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all text-sm"
							>
								<FileText className="w-4 h-4" /> 
								<span className="hidden sm:inline">Documentação</span>
								<span className="sm:hidden">Docs</span>
							</TabsTrigger>
							<TabsTrigger 
								value="system" 
								className="gap-2 py-2 px-3 data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all text-sm"
							>
								<Clock className="w-4 h-4" /> 
								<span className="hidden sm:inline">Sistema</span>
								<span className="sm:hidden">Sistema</span>
							</TabsTrigger>
						</TabsList>
					</div>

					{/* Tab Content - Dados Pessoais */}
					<TabsContent value="personal" className="flex-1 overflow-y-auto bg-slate-50 p-6">
						<div className="max-w-6xl mx-auto space-y-6">
							<LawSection 
								title="Informações Pessoais" 
								icon={<User className="w-6 h-6 text-white" />} 
								color="slate"
							>
								<LawGrid>
									<LawInfoItem label="Data de Nascimento" icon={<Calendar />}>
										<span className="font-mono text-slate-800">{formatDate(clientData.date_of_birth ?? "")}</span>
									</LawInfoItem>
									<LawInfoItem label="Gênero">
										<Badge variant="outline" className="border-slate-300 text-slate-700">
											{getGenderLabel(clientData.gender ?? "")}
										</Badge>
									</LawInfoItem>
									<LawInfoItem label="Estado Civil">
										<Badge variant="outline" className="border-slate-300 text-slate-700">
											{getMaritalStatusLabel(clientData.marital_status ?? "")}
										</Badge>
									</LawInfoItem>
									<LawInfoItem label="Nacionalidade" icon={<Globe />}>
										<Badge className="bg-slate-800 text-amber-400 border-amber-400/30">
											{clientData.nationality}
										</Badge>
									</LawInfoItem>
									<LawInfoItem label="País de Nascimento" icon={<MapPin />}>
										<span className="font-semibold text-slate-800">{clientData.country_of_birth}</span>
									</LawInfoItem>
									<LawInfoItem label="Local de Nascimento">
										<span className="font-semibold text-slate-800">{clientData.place_of_birth}</span>
									</LawInfoItem>
								</LawGrid>
							</LawSection>

							<LawSection 
								title="Filiação" 
								icon={<Users className="w-6 h-6 text-white" />} 
								color="amber"
							>
								<LawGrid>
									<LawInfoItem label="Nome do Pai">
										<span className="font-semibold text-slate-800">{filiation?.father ?? "Não informado"}</span>
									</LawInfoItem>
									<LawInfoItem label="Nome da Mãe">
										<span className="font-semibold text-slate-800">{filiation?.mother ?? "Não informado"}</span>
									</LawInfoItem>
								</LawGrid>
							</LawSection>
						</div>
					</TabsContent>

					{/* Tab Content - Contato */}
					<TabsContent value="contact" className="flex-1 overflow-y-auto bg-slate-50 p-6">
						<div className="max-w-6xl mx-auto space-y-6">
							<LawSection 
								title="Informações de Contato" 
								icon={<Mail className="w-6 h-6 text-white" />} 
								color="emerald"
							>
								<LawGrid>
									<LawInfoItem label="Endereço de Email" icon={<Mail />}>
										<span className="font-mono text-slate-800 bg-slate-100 px-3 py-2 rounded border">
											{clientData.email}
										</span>
									</LawInfoItem>
									<LawInfoItem label="Número de Telefone" icon={<Phone />}>
										<span className="font-mono text-slate-800 bg-slate-100 px-3 py-2 rounded border">
											{clientData.phone}
										</span>
									</LawInfoItem>
								</LawGrid>
							</LawSection>

							<LawSection 
								title="Endereços Registrados" 
								icon={<Home className="w-6 h-6 text-white" />} 
								color="indigo"
							>
								{clientData.address && clientData.address.length > 0 ? (
									<div className="space-y-6">
										{clientData.address.map((address, index) => (
											<div
												key={address.id}
												className="bg-gradient-to-r from-white to-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
											>
												<div className="flex items-start gap-4">
													<div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center shadow-md">
														<MapPin className="w-5 h-5 text-amber-400" />
													</div>
													<div className="flex-1 space-y-3">
														<div className="flex items-center gap-2">
															<Badge variant="outline" className="text-xs font-mono">
																Endereço {index + 1}
															</Badge>
														</div>
														<div className="space-y-2">
															<p className="font-bold text-slate-900 text-lg">
																{address.street}, {address.number}
																{address.complement && `, ${address.complement}`}
															</p>
															<p className="text-slate-700 font-medium">
																{address.neighborhood} - {address.city}/{address.state}
															</p>
															<p className="text-slate-600 font-mono text-sm">
																CEP: {address.zip_code}
															</p>
															<Badge className="bg-blue-800 text-amber-400">
																{address.country}
															</Badge>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
										<div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
											<Home className="w-8 h-8 text-slate-400" />
										</div>
										<p className="text-slate-600 font-semibold text-lg">Nenhum endereço cadastrado</p>
										<p className="text-slate-500 text-sm mt-2">Os endereços do cliente aparecerão aqui quando cadastrados</p>
									</div>
								)}
							</LawSection>
						</div>
					</TabsContent>

					{/* Tab Content - Documentação */}
					<TabsContent value="passport" className="flex-1 overflow-y-auto bg-slate-50 p-6">
						<div className="max-w-6xl mx-auto">
							<LawSection 
								title="Documentação Legal" 
								icon={<FileText className="w-6 h-6 text-white" />} 
								color="purple"
							>
								<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
									<div className="lg:col-span-2">
										<LawGrid>
											<LawInfoItem label="Número do Passaporte">
												<div className="bg-gradient-to-r from-blue-800 to-blue-900 text-amber-400 font-bold font-mono text-base px-3 py-2 rounded-lg shadow-lg border border-amber-400/20">
													{clientData.passport_number}
												</div>
											</LawInfoItem>
											<LawInfoItem label="Data de Emissão" icon={<Calendar />}>
												<span className="font-mono text-slate-800 bg-slate-100 px-3 py-2 rounded border">
													{formatDate(clientData.passport_issue_date ?? "")}
												</span>
											</LawInfoItem>
											<LawInfoItem label="Data de Expiração" icon={<Calendar />}>
												<div className={`font-mono font-bold px-4 py-3 rounded-lg shadow-md ${
													isPassportExpired(clientData.passport_expiry)
														? "bg-red-100 text-red-800 border border-red-300"
														: isPassportExpiringSoon(clientData.passport_expiry)
															? "bg-amber-100 text-amber-800 border border-amber-300"
															: "bg-emerald-100 text-emerald-800 border border-emerald-300"
												}`}>
													{formatDate(clientData.passport_expiry ?? "")}
												</div>
											</LawInfoItem>
										</LawGrid>
									</div>
									<div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-6 border border-slate-300">
										<div className="text-center space-y-4">
											<div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
												isPassportExpired(clientData.passport_expiry)
													? "bg-red-500"
													: isPassportExpiringSoon(clientData.passport_expiry)
														? "bg-amber-500"
														: "bg-emerald-500"
											}`}>
												<Shield className="w-8 h-8 text-white" />
											</div>
											<div>
												<h4 className="font-bold text-slate-800 text-lg">Status da Documentação</h4>
												<p className={`font-semibold text-sm mt-2 ${
													isPassportExpired(clientData.passport_expiry)
														? "text-red-600"
														: isPassportExpiringSoon(clientData.passport_expiry)
															? "text-amber-600"
															: "text-emerald-600"
												}`}>
													{isPassportExpired(clientData.passport_expiry)
														? "EXPIRADO - Ação Necessária"
														: isPassportExpiringSoon(clientData.passport_expiry)
															? "EXPIRA EM BREVE - Atenção"
															: "VÁLIDO - Em Conformidade"}
												</p>
											</div>
										</div>
									</div>
								</div>
							</LawSection>
						</div>
					</TabsContent>

					{/* Tab Content - Sistema */}
					<TabsContent value="system" className="flex-1 overflow-y-auto bg-slate-50 p-6">
						<div className="max-w-6xl mx-auto">
							<LawSection 
								title="Informações do Sistema" 
								icon={<Clock className="w-6 h-6 text-white" />} 
								color="slate"
							>
								<LawGrid>
									<LawInfoItem label="Data de Cadastro" icon={<Calendar />}>
										<div className="bg-slate-100 border border-slate-300 rounded-lg p-3">
											<span className="font-mono text-slate-800 text-sm">
												{formatDateTime(clientData.created_at)}
											</span>
										</div>
									</LawInfoItem>
									<LawInfoItem label="Última Atualização" icon={<Clock />}>
										<div className="bg-slate-100 border border-slate-300 rounded-lg p-3">
											<span className="font-mono text-slate-800 text-sm">
												{formatDateTime(clientData.updated_at)}
											</span>
										</div>
									</LawInfoItem>
								</LawGrid>
								
								<Separator className="my-6" />
								
								<div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white">
									<div className="flex items-center gap-3 mb-4">
										<BookOpen className="w-5 h-5 text-amber-400" />
										<h4 className="text-lg font-bold">Histórico Legal</h4>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
										<div className="space-y-2">
											<p className="text-slate-300">Cliente desde:</p>
											<p className="font-mono text-amber-400">{formatDate(clientData.created_at)}</p>
										</div>
										<div className="space-y-2">
											<p className="text-slate-300">Status no sistema:</p>
											<Badge className="bg-emerald-600 text-white">
												{clientData.userId ? "Conta Ativa" : "Aguardando Ativação"}
											</Badge>
										</div>
									</div>
								</div>
							</LawSection>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

// Tipos e variantes para o tema de advocacia
type LawSectionColor = "slate" | "amber" | "emerald" | "indigo" | "purple" | "crimson";

const lawColorVariants: Record<LawSectionColor, string> = {
	slate: "from-blue-700 to-blue-800",
	amber: "from-amber-600 to-amber-700", 
	emerald: "from-emerald-600 to-emerald-700",
	indigo: "from-blue-600 to-blue-700",
	purple: "from-purple-600 to-purple-700",
	crimson: "from-red-700 to-red-800",
};

// Componente Section redesenhado para advocacia
const LawSection: React.FC<{
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	color?: LawSectionColor;
}> = ({ title, icon, children, color = "slate" }) => (
	<section className="space-y-4">
		<div className="flex items-center gap-3 pb-3 border-b border-slate-300">
			<div className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-lg bg-gradient-to-br ${lawColorVariants[color]}`}>
				<div className="w-5 h-5 text-white">
					{icon}
				</div>
			</div>
			<div>
				<h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
				<div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mt-1"></div>
			</div>
		</div>
		<div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
			{children}
		</div>
	</section>
);

// Grid redesenhado para layout profissional
const LawGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{children}</div>
);

// InfoItem redesenhado para advocacia
const LawInfoItem: React.FC<{ 
	label: string; 
	icon?: React.ReactNode; 
	children: React.ReactNode 
}> = ({ label, icon, children }) => (
	<div className="space-y-2">
		<div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wide">
			{icon && <div className="w-4 h-4 text-slate-500">{icon}</div>}
			{label}
		</div>
		<div className="text-base font-semibold text-slate-900 leading-relaxed">
			{children}
		</div>
	</div>
);
