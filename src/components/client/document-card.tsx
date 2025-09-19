"use client";

import { formatFileSize, getFileUrl, isDocFile, isImageFile, isPdfFile, isXlsxFile } from "@/actions/documents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { SupabaseFile } from "@/types/document-types";
import { Download, Eye, FileSpreadsheet, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DocumentCardProps {
	file: SupabaseFile;
}

interface FileData {
	fileUrl: string;
	fileSize: string;
	isImage: boolean;
	isPdf: boolean;
	isDoc: boolean;
	isXlsx: boolean;
}
// Função para fazer download do arquivo
const downloadFile = (url: string, filename: string) => {
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
// Função para abrir arquivo em nova aba
const openFileInNewTab = (url: string) => {
	window.open(url, "_blank");
};

export function DocumentCard({ file }: DocumentCardProps) {
	const [fileData, setFileData] = useState<FileData | null>(null);
	const [loading, setLoading] = useState(true);

	const [dialogOpen, setDialogOpen] = useState(false);
	// const fileName = file.name.split("/")[1] || file.name;
	const fileName = file.name.slice(24).replaceAll("-", " ").split("_")[0].toUpperCase();

	useEffect(() => {
		async function loadFileData() {
			try {
				const [fileUrl, fileSize, isImage, isPdf, isDoc, isXlsx] = await Promise.all([
					getFileUrl(file.name),
					formatFileSize(file?.metadata?.size),
					isImageFile(file.name),
					isPdfFile(file.name),
					isDocFile(file.name),
					isXlsxFile(file.name),
				]);

				setFileData({
					fileUrl,
					fileSize,
					isImage,
					isPdf,
					isDoc,
					isXlsx,
				});
			} catch (error) {
				console.error("Erro ao carregar dados do arquivo:", error);
			} finally {
				setLoading(false);
			}
		}

		loadFileData();
	}, [file.name, file?.metadata?.size]);

	// function handleDownload() {
	// 	if (fileData?.fileUrl) {
	// 		window.open(fileData.fileUrl, "_blank");
	// 	}
	// }

	function handlePreview() {
		if (fileData?.fileUrl) {
			window.open(fileData.fileUrl, "_blank");
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		// Se for hoje
		if (diffDays === 1) {
			return `Hoje às ${date.toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			})}`;
		}

		// Se for ontem
		if (diffDays === 2) {
			return `Ontem às ${date.toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			})}`;
		}

		// Se for esta semana (últimos 7 dias)
		if (diffDays <= 7) {
			return `${diffDays - 1} dias atrás`;
		}

		// Caso contrário, mostrar data completa
		return date.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	}

	function getFileIcon() {
		if (loading) return <FileText className="w-4 h-4" />;

		if (fileData?.isImage) {
			return <ImageIcon className="w-4 h-4" />;
		}
		if (fileData?.isPdf) {
			return <FileText className="w-4 h-4" />;
		}
		return <FileText className="w-4 h-4" />;
	}

	function getFileType() {
		if (loading) return "Carregando...";

		if (fileData?.isImage) return "Imagem";
		if (fileData?.isPdf) return "PDF";
		return file?.metadata?.mimetype?.split("/")[1]?.toUpperCase() || "Arquivo";
	}

	const handleCardClick = () => {
		if (fileData?.isImage) {
			setDialogOpen(true);
		} else if (fileData?.fileUrl) {
			openFileInNewTab(fileData.fileUrl);
		}
	};

	const handleDownload = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (fileData?.fileUrl) {
			downloadFile(fileData.fileUrl, fileName);
		}
	};

	const renderFileIcon = () => {
		if (fileData?.isPdf) {
			return (
				<div className="w-full h-full bg-zinc-100 flex items-center justify-center">
					<FileText className="w-16 h-16 text-zinc-500" />
				</div>
			);
		}

		if (fileData?.isDoc) {
			return (
				<div className="w-full h-full bg-blue-50 flex items-center justify-center">
					<FileText className="w-16 h-16 text-blue-500" />
				</div>
			);
		}

		if (fileData?.isXlsx) {
			return (
				<div className="w-full h-full bg-green-50 flex items-center justify-center">
					<FileSpreadsheet className="w-16 h-16 text-green-500" />
				</div>
			);
		}

		return (
			<div className="w-full h-full bg-gray-100 flex items-center justify-center">
				<FileText className="w-16 h-16 text-gray-400" />
			</div>
		);
	};

	return (
		<>
			<Card
				className="relative w-full aspect-auto h-80 overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30"
				onClick={handleCardClick}
				aria-label={`Documento ${fileName}, ${getFileType()}, tamanho: ${fileData?.fileSize || "carregando"}`}
			>
				{/* Background - Imagem ou Ícone */}
				<div className="absolute inset-0">
					{loading ? (
						<div className="w-full h-full bg-gray-100 flex items-center justify-center">
							<div className="animate-pulse">
								<FileText className="w-10 h-10 text-gray-300" />
							</div>
						</div>
					) : fileData?.isImage ? (
						<Image
							src={fileData?.fileUrl || ""}
							alt={fileName}
							width={1000}
							height={1000}
							className="w-full h-full object-cover"
						/>
					) : (
						renderFileIcon()
					)}
				</div>

				{/* Badge de tipo de arquivo - sempre visível no canto superior direito */}
				{!loading && (
					<div className="absolute top-2 right-2 z-10">
						<Badge variant="secondary" className="bg-black/60 text-white text-xs border-0 backdrop-blur-sm">
							{getFileType()}
						</Badge>
					</div>
				)}

				{/* Footer sempre visível com nome do arquivo */}
				{!loading && (
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 group-hover:opacity-0 transition-opacity duration-300">
						<p className="text-white text-xs font-medium truncate">
							{fileName.length > 25 ? `${fileName.slice(0, 22)}...` : fileName}
						</p>
						{fileData?.fileSize && <p className="text-gray-300 text-xs">{fileData.fileSize}</p>}
					</div>
				)}

				{/* Overlay escuro no hover */}
				<div className="absolute inset-0 bg-black/0 group-hover:bg-black/75 transition-all duration-300" />

				{/* Informações do arquivo - aparecem no hover */}
				{!loading && (
					<div className="absolute inset-0 flex flex-col justify-between p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
						{/* Header com tipo de arquivo e tamanho */}
						<div className="flex justify-between items-start">
							{fileData?.fileSize && (
								<Badge variant="outline" className="bg-black/30 text-white border-white/30 backdrop-blur-sm">
									{fileData.fileSize}
								</Badge>
							)}
						</div>

						{/* Conteúdo central com nome do arquivo */}
						<div className="text-center space-y-3">
							<div className="space-y-2">
								<h3 className="text-sm font-semibold leading-tight break-words max-w-full px-2">
									{fileName.length > 35 ? `${fileName.slice(0, 32)}...` : fileName}
								</h3>
								<div className="text-xs text-gray-200 space-y-1">
									<div className="flex items-center justify-center gap-1">
										<span className="text-gray-300">📅</span>
										<span>Criado: {formatDate(file.created_at)}</span>
									</div>
									<div className="flex items-center justify-center gap-1">
										<span className="text-gray-300">🔄</span>
										<span>Modificado: {formatDate(file.updated_at)}</span>
									</div>
								</div>
							</div>
						</div>

						{/* Footer com ações */}
						<div className="flex justify-center gap-2">
							{fileData?.isImage ? (
								<Button
									size="sm"
									variant="secondary"
									className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-sm transition-all"
									onClick={(e) => {
										e.stopPropagation();
										setDialogOpen(true);
									}}
									aria-label={`Visualizar imagem ${fileName}`}
								>
									<Eye className="w-4 h-4 mr-1" />
									Visualizar
								</Button>
							) : (
								<Button
									size="sm"
									variant="secondary"
									className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-sm transition-all"
									onClick={(e) => {
										e.stopPropagation();
										handlePreview();
									}}
									aria-label={`Abrir arquivo ${fileName}`}
								>
									<Eye className="w-4 h-4 mr-1" />
									Abrir
								</Button>
							)}
							<Button
								size="sm"
								variant="secondary"
								className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-sm transition-all"
								onClick={handleDownload}
								aria-label={`Baixar arquivo ${fileName}`}
							>
								<Download className="w-4 h-4 mr-1" />
								Baixar
							</Button>
						</div>
					</div>
				)}
			</Card>

			{/* Dialog para imagens */}
			{fileData?.isImage && (
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
						<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
							<DialogTitle className="text-lg font-semibold truncate pr-4">{fileName}</DialogTitle>
							<Button onClick={handleDownload} size="sm" className="flex items-center gap-2 shrink-0">
								<Download className="w-4 h-4" />
								Download
							</Button>
						</DialogHeader>

						<div className="flex justify-center items-center max-h-[70vh] overflow-hidden">
							<Image
								src={fileData?.fileUrl || ""}
								alt={fileName}
								width={1000}
								height={1000}
								className="max-w-full max-h-full object-contain"
							/>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
