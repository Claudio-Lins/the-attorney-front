'use client';

import { getFileUrl } from "@/actions/documents";
import { triggerPowerAttorneyWebhook, WebhookType } from "@/actions/power-attorney-actions";
import { getPowerAttorneyFiles } from "@/actions/power-attorney-documents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { address, client } from "@/generated/prisma/client";
import { SupabaseFile } from "@/types/document-types";
import { Briefcase, Download, Eye, Flag, GraduationCap, Home, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Helper functions for file handling
const downloadFile = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const openFileInNewTab = (url: string) => {
    window.open(url, "_blank");
};


interface PowerAttorneyTabProps {
    clientData: client & { address?: address[] };
}

const powerAttorneyOptions = [
    { type: "NACIONALIDADE", label: "Nacionalidade", icon: Flag },
    { type: "RESIDENCIA", label: "Residência", icon: Home },
    { type: "REAGRUPAMENTO", label: "Reagrupamento", icon: Users },
    { type: "TRABALHO", label: "Visto de Trabalho", icon: Briefcase },
    { type: "ESTUDANTE", label: "Visto de Estudante", icon: GraduationCap },
];

export function PowerAttorneyTab({ clientData }: PowerAttorneyTabProps) {
    const [documents, setDocuments] = useState<SupabaseFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadDocuments() {
            setIsLoading(true);
            const files = await getPowerAttorneyFiles(clientData.client_id);
            setDocuments(files);
            setIsLoading(false);
        }
        loadDocuments();
    }, [clientData.client_id]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Geração de Procurações</CardTitle>
                <CardDescription>
                    Gere novos documentos ou visualize os que já foram criados para este cliente.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {powerAttorneyOptions.map((option) => (
                    <PowerAttorneyActionButton
                        key={option.type}
                        option={option as { type: WebhookType; label: string; icon: React.ElementType }}
                        clientData={clientData}
                        existingFile={documents.find(doc => doc.name.toUpperCase().includes(option.type))}
                        onGenerationComplete={() => getPowerAttorneyFiles(clientData.client_id).then(setDocuments)}
                    />
                ))}
            </CardContent>
        </Card>
    );
}

// --- Sub-componente para o botão ---

interface ActionButtonProps {
    option: { type: WebhookType; label: string; icon: React.ElementType };
    clientData: client;
    existingFile: SupabaseFile | undefined;
    onGenerationComplete: () => void;
}

function PowerAttorneyActionButton({ option, clientData, existingFile, onGenerationComplete }: ActionButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const result = await triggerPowerAttorneyWebhook(clientData, option.type);
            if (result === "ok") {
                toast.success(`Procuração de ${option.label} enviada para geração.`
                + " O documento aparecerá aqui em instantes.");
                setTimeout(onGenerationComplete, 5000); // Refresh after 5s
            } else {
                toast.error(`Falha ao gerar procuração de ${option.label}.`);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAction = async (action: 'open' | 'download') => {
        if (!existingFile) return;
        const fileUrl = await getFileUrl(existingFile.name);
        if (action === 'open') {
            openFileInNewTab(fileUrl);
        } else {
            downloadFile(fileUrl, existingFile.name);
        }
    };

    if (existingFile) {
        return (
            <div className="w-full h-28 flex flex-col items-center justify-center gap-2 p-2 border rounded-md bg-green-50">
                <option.icon className="w-8 h-8 text-green-700" />
                <span className="text-center text-xs font-semibold text-green-800">{option.label}</span>
                <div className="flex gap-2 mt-1">
                    <Button size="sm" variant="outline" onClick={() => handleAction('open')}><Eye className="w-4 h-4 mr-1"/>Visualizar</Button>
                </div>
            </div>
        );
    }

    return (
        <Button
            variant="outline"
            className="w-full h-28 flex flex-col items-center justify-center gap-2 p-4"
            onClick={handleGenerate}
            disabled={isGenerating}
        >
            {isGenerating ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            ) : (
                <option.icon className="w-8 h-8" />
            )}
            <span className="text-center text-xs font-semibold">{isGenerating ? "Gerando..." : `Gerar ${option.label}`}</span>
        </Button>
    );
}