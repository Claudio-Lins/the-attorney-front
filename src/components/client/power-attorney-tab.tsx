'use client';

import { triggerPowerAttorneyWebhook, WebhookType } from "@/actions/power-attorney-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { address, client } from "@/generated/prisma/client";
import { Briefcase, Flag, GraduationCap, Home, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
    const [loadingType, setLoadingType] = useState<WebhookType | null>(null);

    const handleButtonClick = async (type: WebhookType) => {
        setLoadingType(type);
        try {
            const result = await triggerPowerAttorneyWebhook(clientData, type);
            if (result === "ok") {
                toast.success(`Documento de "${type.toLowerCase()}" gerado e enviado com sucesso!`);
            } else {
                toast.error(`Falha ao gerar documento de "${type.toLowerCase()}".`);
            }
        } catch (error) {
            console.error("Erro ao acionar webhook:", error);
            toast.error("Ocorreu um erro inesperado.");
        } finally {
            setLoadingType(null);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Geração de Procurações</CardTitle>
                <CardDescription>
                    Selecione o tipo de procuração para gerar e enviar os dados do cliente para a automação correspondente no n8n.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {powerAttorneyOptions.map(({ type, label, icon: Icon }) => (
                    <Button
                        key={type}
                        variant="outline"
                        className="w-full h-28 flex flex-col items-center justify-center gap-2 p-4"
                        onClick={() => handleButtonClick(type as WebhookType)}
                        disabled={loadingType !== null}
                    >
                        {loadingType === type ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        ) : (
                            <Icon className="w-8 h-8" />
                        )}
                        <span className="text-center text-xs font-semibold">{label}</span>
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
}
