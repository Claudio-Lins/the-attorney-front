"use client";

import { sendInvitationAction } from "@/actions/send-invitation-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { address, client } from "@/generated/prisma/client";
import {
	Calendar,
	Clock,
	FileText,
	Globe,
	Home,
	Mail,
	MapPin,
	Phone,
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
		<div className="w-full h-[calc(100vh-var(--header-height))] p-2 sm:p-4">
			<Card className="h-full flex flex-col overflow-hidden border-0 shadow-lg sm:shadow-xl bg-white">
				<CardHeader className="relative pb-4 sm:pb-6 border-b bg-slate-50/80">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="flex items-center gap-4 sm:gap-6">
							<div className="relative">
								<Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white shadow-lg">
									<AvatarImage
										src={clientData.photo_url ?? ""}
										alt={`Foto de ${clientData.first_name} ${clientData.last_name}`}
									/>
									<AvatarFallback className="text-lg font-semibold">
										{getInitials(clientData.first_name, clientData.last_name)}
									</AvatarFallback>
								</Avatar>
								<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
									<UserCheck className="w-3 h-3 text-white" />
								</div>
							</div>

							<div className="space-y-2">
								<CardTitle className="text-2xl lg:text-3xl font-bold text-slate-800">
									{clientData.first_name} {clientData.last_name}
								</CardTitle>
								<div className="flex items-center flex-wrap gap-2">
									<Badge variant="outline" className="font-mono text-xs border-slate-300 text-slate-600">
										ID: {clientData.client_id}
									</Badge>
									<Badge
										variant={
											isPassportExpired(clientData.passport_expiry)
												? "destructive"
												: isPassportExpiringSoon(clientData.passport_expiry)
													? "secondary"
													: "default"
										}
										className="text-xs shadow-sm"
									>
										<Shield className="w-3 h-3 mr-1.5" />
										{isPassportExpired(clientData.passport_expiry)
											? "Passaporte Expirado"
											: isPassportExpiringSoon(clientData.passport_expiry)
												? "Expira em Breve"
												: "Documentação OK"}
									</Badge>
								</div>
							</div>
						</div>

						<div className="sm:w-auto self-start sm:self-center flex items-center gap-2">
							<EditClientDialog clientData={clientData} />
							{clientData.userId ? (
								<Badge variant="default">Ativo</Badge>
							) : (
								<Button onClick={handleSendInvitation} disabled={isSending}>
									{isSending ? "Enviando..." : "Enviar Convite"}
								</Button>
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent className="flex-grow p-0 overflow-hidden">
					<Tabs defaultValue="personal" className="h-full flex flex-col">
						<div className="px-2 pt-2 bg-slate-50/80 border-b">
							<TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
								<TabsTrigger value="personal" className="gap-2 py-2.5">
									<User className="w-4 h-4" /> Dados Pessoais
								</TabsTrigger>
								<TabsTrigger value="contact" className="gap-2 py-2.5">
									<Mail className="w-4 h-4" /> Contato
								</TabsTrigger>
								<TabsTrigger value="passport" className="gap-2 py-2.5">
									<FileText className="w-4 h-4" /> Passaporte
								</TabsTrigger>
								<TabsTrigger value="system" className="gap-2 py-2.5">
									<Clock className="w-4 h-4" /> Sistema
								</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent value="personal" className="flex-grow overflow-y-auto p-4 sm:p-6 bg-slate-50/30">
							<div className="space-y-8 max-w-4xl mx-auto">
								<Section title="Informações Pessoais" icon={<User />} color="blue">
									<InfoGrid>
										<InfoItem label="Data de Nascimento" icon={<Calendar />}>
											{formatDate(clientData.date_of_birth ?? "")}
										</InfoItem>
										<InfoItem label="Gênero">{getGenderLabel(clientData.gender ?? "")}</InfoItem>
										<InfoItem label="Estado Civil">{getMaritalStatusLabel(clientData.marital_status ?? "")}</InfoItem>
										<InfoItem label="Nacionalidade" icon={<Globe />}>
											<Badge variant="secondary">{clientData.nationality}</Badge>
										</InfoItem>
										<InfoItem label="País de Nascimento" icon={<MapPin />}>
											{clientData.country_of_birth}
										</InfoItem>
										<InfoItem label="Local de Nascimento">{clientData.place_of_birth}</InfoItem>
									</InfoGrid>
								</Section>
								<Section title="Filiação" icon={<Users />} color="amber">
									<InfoGrid>
										<InfoItem label="Pai">{filiation?.father ?? "N/A"}</InfoItem>
										<InfoItem label="Mãe">{filiation?.mother ?? "N/A"}</InfoItem>
									</InfoGrid>
								</Section>
							</div>
						</TabsContent>

						<TabsContent value="contact" className="flex-grow overflow-y-auto p-4 sm:p-6 bg-slate-50/30">
							<div className="space-y-8 max-w-4xl mx-auto">
								<Section title="Informações de Contato" icon={<Mail />} color="emerald">
									<InfoGrid>
										<InfoItem label="Email" icon={<Mail />}>
											<span className="break-all">{clientData.email}</span>
										</InfoItem>
										<InfoItem label="Telefone" icon={<Phone />}>
											{clientData.phone}
										</InfoItem>
									</InfoGrid>
								</Section>
								<Section title="Endereços" icon={<Home />} color="indigo">
									{clientData.address && clientData.address.length > 0 ? (
										<div className="space-y-4">
											{clientData.address.map((address) => (
												<div
													key={address.id}
													className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm"
												>
													<div className="flex items-start gap-4">
														<MapPin className="w-5 h-5 text-indigo-500 mt-1" />
														<div className="flex-1 space-y-1.5 min-w-0">
															<p className="font-semibold text-slate-800 break-words">
																{address.street}, {address.number}
																{address.complement && `, ${address.complement}`}
															</p>
															<p className="text-sm text-slate-600">
																{address.neighborhood} - {address.city}/{address.state}
															</p>
															<p className="text-sm text-slate-500">CEP: {address.zip_code}</p>
															<Badge variant="outline">{address.country}</Badge>
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="text-center py-8 bg-white rounded-xl border border-slate-200/80">
											<Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
											<p className="text-slate-500 font-medium">Nenhum endereço cadastrado</p>
										</div>
									)}
								</Section>
							</div>
						</TabsContent>

						<TabsContent value="passport" className="flex-grow overflow-y-auto p-4 sm:p-6 bg-slate-50/30">
							<div className="max-w-4xl mx-auto">
								<Section title="Informações do Passaporte" icon={<FileText />} color="purple">
									<InfoGrid>
										<InfoItem label="Número">
											<span className="font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg shadow-sm">
												{clientData.passport_number}
											</span>
										</InfoItem>
										<InfoItem label="Data de Emissão" icon={<Calendar />}>
											{formatDate(clientData.passport_issue_date ?? "")}
										</InfoItem>
										<InfoItem label="Data de Expiração" icon={<Calendar />}>
											<span
												className={`font-semibold ${
													isPassportExpired(clientData.passport_expiry)
														? "text-red-600"
														: isPassportExpiringSoon(clientData.passport_expiry)
															? "text-amber-600"
															: "text-slate-800"
												}`}
											>
												{formatDate(clientData.passport_expiry ?? "")}
											</span>
										</InfoItem>
									</InfoGrid>
								</Section>
							</div>
						</TabsContent>

						<TabsContent value="system" className="flex-grow overflow-y-auto p-4 sm:p-6 bg-slate-50/30">
							<div className="max-w-4xl mx-auto">
								<Section title="Informações do Sistema" icon={<Clock />} color="slate">
									<InfoGrid>
										<InfoItem label="Criado em" icon={<Clock />}>
											<span className="font-mono text-sm text-slate-700 bg-slate-200/60 px-3 py-1.5 rounded-lg break-all">
												{formatDateTime(clientData.created_at)}
											</span>
										</InfoItem>
										<InfoItem label="Última atualização" icon={<Clock />}>
											<span className="font-mono text-sm text-slate-700 bg-slate-200/60 px-3 py-1.5 rounded-lg break-all">
												{formatDateTime(clientData.updated_at)}
											</span>
										</InfoItem>
									</InfoGrid>
								</Section>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}

type SectionColor = "blue" | "amber" | "emerald" | "indigo" | "purple" | "slate";

const colorVariants: Record<SectionColor, string> = {
	blue: "from-blue-500 to-blue-600",
	amber: "from-amber-500 to-amber-600",
	emerald: "from-emerald-500 to-emerald-600",
	indigo: "from-indigo-500 to-indigo-600",
	purple: "from-purple-500 to-purple-600",
	slate: "from-slate-500 to-slate-600",
};

const Section: React.FC<{
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	color?: SectionColor;
}> = ({ title, icon, children, color = "blue" }) => (
	<section>
		<div className="flex items-center gap-3 mb-4">
			<div
				className={`w-9 h-9 flex items-center justify-center rounded-lg shadow-md bg-gradient-to-br ${colorVariants[color]}`}
			>
				{React.cloneElement(icon as React.ReactElement)}
			</div>
			<h3 className="text-xl font-semibold text-slate-800">{title}</h3>
		</div>
		<div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200/80 shadow-sm">
			{children}
		</div>
	</section>
);

const InfoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">{children}</div>
);

const InfoItem: React.FC<{ label: string; icon?: React.ReactNode; children: React.ReactNode }> = ({
	label,
	icon,
	children,
}) => (
	<div className="space-y-1.5">
		<p className="text-sm font-medium text-slate-500 flex items-center gap-2">
			{icon && React.cloneElement(icon as React.ReactElement)}
			{label}
		</p>
		<div className="text-base font-semibold text-slate-800">{children}</div>
	</div>
);
