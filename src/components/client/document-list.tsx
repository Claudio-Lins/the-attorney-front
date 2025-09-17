"use client";

import { uploadDocument } from "@/actions/documents";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocumentResponse } from "@/types/document-types";
import {
	AlertCircle,
	CheckCircle,
	FileText,
	FileX,
	Image as ImageIcon,
	Loader2,
	Upload,
	X,
	XCircle,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { DocumentCard } from "./document-card";

interface DocumentListProps {
	documents: DocumentResponse;
	onDocumentsChange?: () => void;
}

export function DocumentList({ documents, onDocumentsChange }: DocumentListProps) {
	const [isPending, startTransition] = useTransition();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileName, setFileName] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Validação em tempo real do nome do arquivo
	const fileNameValidation = useMemo(() => {
		if (!fileName.trim()) {
			return { isValid: false, message: "Nome é obrigatório", color: "text-gray-500" };
		}

		const trimmedName = fileName.trim();

		// Verificar caracteres perigosos
		const dangerousChars = ["<", ">", ":", '"', "/", "\\", "|", "?", "*"];
		const hasDangerousChars = dangerousChars.some((char) => trimmedName.includes(char));

		if (hasDangerousChars) {
			return {
				isValid: false,
				message: 'Contém caracteres inválidos (< > : " / \\ | ? *)',
				color: "text-red-500",
			};
		}

		// Verificar comprimento
		if (trimmedName.length < 2) {
			return {
				isValid: false,
				message: "Mínimo 2 caracteres",
				color: "text-red-500",
			};
		}

		if (trimmedName.length > 50) {
			return {
				isValid: false,
				message: "Máximo 50 caracteres",
				color: "text-red-500",
			};
		}

		return { isValid: true, message: "Nome válido", color: "text-green-500" };
	}, [fileName]);

	function handleUploadClick() {
		fileInputRef.current?.click();
	}

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;

		setSelectedFile(file);

		// Sugerir nome baseado no tipo de arquivo
		const extension = file.name.split(".").pop()?.toLowerCase();
		let suggestedName = "";

		switch (extension) {
			case "pdf":
				suggestedName = "documento";
				break;
			case "jpg":
			case "jpeg":
			case "png":
				suggestedName = "foto";
				break;
			case "doc":
			case "docx":
				suggestedName = "documento";
				break;
			case "xlsx":
				suggestedName = "planilha";
				break;
			default:
				suggestedName = "arquivo";
		}

		setFileName(suggestedName);

		// Criar preview se for imagem
		if (file.type.startsWith("image/")) {
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		} else {
			setPreviewUrl(null);
		}

		setIsModalOpen(true);
	}

	function handleCloseModal() {
		setIsModalOpen(false);
		setSelectedFile(null);
		setFileName("");
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}
		// Resetar o input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function handleConfirmUpload() {
		if (!selectedFile) return;

		if (!fileNameValidation.isValid) {
			toast.error("Corrija o nome do arquivo antes de continuar");
			return;
		}

		startTransition(async () => {
			try {
				const result = await uploadDocument(selectedFile, fileName);

				if (result.success) {
					toast.success(result.message);
					handleCloseModal();
					onDocumentsChange?.();
				} else {
					toast.error(result.message);
				}
			} catch (error) {
				console.error("Erro no upload:", JSON.stringify(error, null, 2));
				toast.error("Erro ao fazer upload do arquivo");
			}
		});
	}

	function getFileIcon(file: File) {
		if (file.type.startsWith("image/")) {
			return <ImageIcon className="w-6 h-6 text-blue-500" />;
		}
		return <FileText className="w-6 h-6 text-gray-500" />;
	}

	function getFileType(file: File) {
		const extension = file.name.split(".").pop()?.toLowerCase();
		switch (extension) {
			case "pdf":
				return "PDF";
			case "doc":
			case "docx":
				return "Word";
			case "jpg":
			case "jpeg":
			case "png":
				return "Imagem";
			case "xlsx":
				return "Excel";
			default:
				return extension?.toUpperCase() || "Arquivo";
		}
	}

	if (documents.error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>Erro ao carregar documentos: {documents.error.message}</AlertDescription>
			</Alert>
		);
	}

	if (!documents.data || documents.data.length === 0) {
		return (
			<>
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<FileX className="h-12 w-12 text-muted-foreground mb-4" />
					<h3 className="text-lg font-medium text-muted-foreground mb-2">Nenhum documento encontrado</h3>
					<p className="text-sm text-muted-foreground max-w-md mb-6">
						Ainda não há documentos disponíveis. Envie seu primeiro documento para começar.
					</p>

					{/* Input de arquivo oculto */}
					<input
						ref={fileInputRef}
						type="file"
						className="hidden"
						accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xlsx"
						onChange={handleFileChange}
					/>

					<Button onClick={handleUploadClick} disabled={isPending} className="w-auto">
						{isPending ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Enviando...
							</>
						) : (
							<>
								<Upload className="h-4 w-4 mr-2" />
								Fazer upload do primeiro documento
							</>
						)}
					</Button>
				</div>

				{/* Modal de Nomeação do Arquivo */}
				<Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								{selectedFile && getFileIcon(selectedFile)}
								Nomear arquivo
							</DialogTitle>
						</DialogHeader>

						<div className="space-y-4">
							{/* Preview do arquivo */}
							{selectedFile && (
								<div className="bg-gray-50 p-4 rounded-lg border">
									<div className="flex items-center gap-3">
										{previewUrl ? (
											<div className="relative w-16 h-16 bg-gray-200 rounded overflow-hidden">
												<Image src={previewUrl} alt="Preview" fill className="object-cover" />
											</div>
										) : (
											<div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
												{getFileIcon(selectedFile)}
											</div>
										)}
										<div className="flex-1">
											<p className="text-sm font-medium truncate">{selectedFile.name}</p>
											<p className="text-xs text-gray-500">
												{getFileType(selectedFile)} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Campo de nome com validação */}
							<div className="space-y-2">
								<Label htmlFor="filename">Nome do documento</Label>
								<div className="relative">
									<Input
										id="filename"
										value={fileName}
										onChange={(e) => setFileName(e.target.value)}
										placeholder="Ex: passaporte, contrato, certidão..."
										autoFocus
										className={`pr-8 ${
											fileName.trim()
												? fileNameValidation.isValid
													? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
													: "border-red-500 focus:border-red-500 focus:ring-red-500/20"
												: ""
										}`}
									/>
									{fileName.trim() && (
										<div className="absolute right-2 top-1/2 -translate-y-1/2">
											{fileNameValidation.isValid ? (
												<CheckCircle className="w-4 h-4 text-green-500" />
											) : (
												<XCircle className="w-4 h-4 text-red-500" />
											)}
										</div>
									)}
								</div>

								{/* Feedback de validação */}
								<div className="flex justify-between items-center">
									<p className={`text-xs ${fileNameValidation.color}`}>{fileNameValidation.message}</p>
									<p className="text-xs text-gray-400">{fileName.length}/50</p>
								</div>

								<p className="text-xs text-gray-500">
									Será salvo como:{" "}
									<span className="font-mono bg-gray-100 px-1 rounded">
										{fileName.trim()
											? `${fileName.trim().toLowerCase().replace(/\s+/g, "_")}.${selectedFile?.name.split(".").pop()}`
											: `nome.${selectedFile?.name.split(".").pop()}`}
									</span>
								</p>
							</div>

							{/* Exemplos de nomes */}
							<div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
								<p className="text-xs font-medium text-blue-800 mb-2">Sugestões de nomes:</p>
								<div className="flex flex-wrap gap-1">
									{[
										"passaporte",
										"visto",
										"certidao_nascimento",
										"contrato_trabalho",
										"diploma",
										"comprovante_residencia",
										"carta_conducao",
										"bilhete_identidade",
									].map((example) => (
										<button
											key={example}
											type="button"
											onClick={() => setFileName(example)}
											className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
										>
											{example.replace(/_/g, " ")}
										</button>
									))}
								</div>
							</div>

							{/* Regras de nomenclatura */}
							<div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
								<p className="text-xs font-medium text-amber-800 mb-1">Regras de nomenclatura:</p>
								<ul className="text-xs text-amber-700 space-y-0.5">
									<li>• 2 a 50 caracteres</li>
									<li>• Sem símbolos especiais: &lt; &gt; : " / \ | ? *</li>
									<li>• Espaços serão convertidos para underscore (_)</li>
									<li>• Acentos serão removidos automaticamente</li>
								</ul>
							</div>

							{/* Botões */}
							<div className="flex gap-2 pt-2">
								<Button variant="outline" onClick={handleCloseModal} className="flex-1" disabled={isPending}>
									Cancelar
								</Button>
								<Button
									onClick={handleConfirmUpload}
									className="flex-1"
									disabled={isPending || !fileNameValidation.isValid}
								>
									{isPending ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Enviando...
										</>
									) : (
										<>
											<Upload className="w-4 h-4 mr-2" />
											Enviar
										</>
									)}
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</>
		);
	}

	return (
		<>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-medium">Documentos ({documents.data.length})</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<input
						ref={fileInputRef}
						type="file"
						className="hidden"
						accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xlsx"
						onChange={handleFileChange}
					/>

					<Button
						variant="outline"
						className="w-full h-auto min-h-[120px] flex flex-col items-center justify-center gap-2 border-dashed hover:border-primary hover:bg-primary/5"
						onClick={handleUploadClick}
						disabled={isPending}
					>
						{isPending ? (
							<>
								<Loader2 className="h-6 w-6 animate-spin text-primary" />
								<span className="text-sm font-medium">Enviando...</span>
							</>
						) : (
							<>
								<Upload className="h-6 w-6 text-primary" />
								<span className="text-sm font-medium">Adicionar documento</span>
								<span className="text-xs text-muted-foreground">PDF, DOC, IMG, XLSX</span>
							</>
						)}
					</Button>

					{documents.data.map((file) => (
						<DocumentCard key={file.id} file={file} />
					))}
				</div>
			</div>

			{/* Modal de Nomeação do Arquivo */}
			<Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							{selectedFile && getFileIcon(selectedFile)}
							Nomear arquivo
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						{/* Preview do arquivo */}
						{selectedFile && (
							<div className="bg-gray-50 p-4 rounded-lg border">
								<div className="flex items-center gap-3">
									{previewUrl ? (
										<div className="relative w-16 h-16 bg-gray-200 rounded overflow-hidden">
											<Image src={previewUrl} alt="Preview" fill className="object-cover" />
										</div>
									) : (
										<div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
											{getFileIcon(selectedFile)}
										</div>
									)}
									<div className="flex-1">
										<p className="text-sm font-medium truncate">{selectedFile.name}</p>
										<p className="text-xs text-gray-500">
											{getFileType(selectedFile)} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Campo de nome com validação */}
						<div className="space-y-2">
							<Label htmlFor="filename">Nome do documento</Label>
							<div className="relative">
								<Input
									id="filename"
									value={fileName}
									onChange={(e) => setFileName(e.target.value)}
									placeholder="Ex: passaporte, contrato, certidão..."
									autoFocus
									className={`pr-8 ${
										fileName.trim()
											? fileNameValidation.isValid
												? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
												: "border-red-500 focus:border-red-500 focus:ring-red-500/20"
											: ""
									}`}
								/>
								{fileName.trim() && (
									<div className="absolute right-2 top-1/2 -translate-y-1/2">
										{fileNameValidation.isValid ? (
											<CheckCircle className="w-4 h-4 text-green-500" />
										) : (
											<XCircle className="w-4 h-4 text-red-500" />
										)}
									</div>
								)}
							</div>

							{/* Feedback de validação */}
							<div className="flex justify-between items-center">
								<p className={`text-xs ${fileNameValidation.color}`}>{fileNameValidation.message}</p>
								<p className="text-xs text-gray-400">{fileName.length}/50</p>
							</div>

							<p className="text-xs text-gray-500">
								Será salvo como:{" "}
								<span className="font-mono bg-gray-100 px-1 rounded">
									{fileName.trim()
										? `${fileName.trim().toLowerCase().replace(/\s+/g, "_")}.${selectedFile?.name.split(".").pop()}`
										: `nome.${selectedFile?.name.split(".").pop()}`}
								</span>
							</p>
						</div>

						{/* Exemplos de nomes */}
						<div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
							<p className="text-xs font-medium text-blue-800 mb-2">Sugestões de nomes:</p>
							<div className="flex flex-wrap gap-1">
								{[
									"passaporte",
									"visto",
									"certidao_nascimento",
									"contrato_trabalho",
									"diploma",
									"comprovante_residencia",
									"carta_conducao",
									"bilhete_identidade",
								].map((example) => (
									<button
										key={example}
										type="button"
										onClick={() => setFileName(example)}
										className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
									>
										{example.replace(/_/g, " ")}
									</button>
								))}
							</div>
						</div>

						{/* Regras de nomenclatura */}
						<div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
							<p className="text-xs font-medium text-amber-800 mb-1">Regras de nomenclatura:</p>
							<ul className="text-xs text-amber-700 space-y-0.5">
								<li>• 2 a 50 caracteres</li>
								<li>• Sem símbolos especiais: &lt; &gt; : " / \ | ? *</li>
								<li>• Espaços serão convertidos para underscore (_)</li>
								<li>• Acentos serão removidos automaticamente</li>
							</ul>
						</div>

						{/* Botões */}
						<div className="flex gap-2 pt-2">
							<Button variant="outline" onClick={handleCloseModal} className="flex-1" disabled={isPending}>
								Cancelar
							</Button>
							<Button
								onClick={handleConfirmUpload}
								className="flex-1"
								disabled={isPending || !fileNameValidation.isValid}
							>
								{isPending ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Enviando...
									</>
								) : (
									<>
										<Upload className="w-4 h-4 mr-2" />
										Enviar
									</>
								)}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
