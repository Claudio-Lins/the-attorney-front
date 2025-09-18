import { CreatePasswordForm } from "@/components/create-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CreatePasswordPageProps {
    searchParams: Promise<{
        clientId?: string;
        email?: string;
    }>;
}

export default async function CreatePasswordPage({
    searchParams,
}: CreatePasswordPageProps) {
    const { clientId, email } = await searchParams;

    if (!clientId || !email) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Erro</CardTitle>
                        <CardDescription>Link inválido ou expirado.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Por favor, solicite um novo link para criar sua senha.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Criar Nova Senha</CardTitle>
                    <CardDescription>Escolha uma senha segura para acessar sua conta.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreatePasswordForm clientId={clientId} email={email} />
                </CardContent>
            </Card>
        </div>
    );
}
