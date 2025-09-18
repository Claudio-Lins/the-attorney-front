'use client';

import { createPasswordForClient } from "@/actions/client-auth-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { newPasswordSchema } from "@/zod-schemas/password-schema";
import { useState } from "react";
import { toast } from "sonner";

interface CreatePasswordFormProps {
    clientId: string;
    email: string;
}

export function CreatePasswordForm({ clientId, email }: CreatePasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof newPasswordSchema>>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof newPasswordSchema>) {
        setIsLoading(true);
        try {
            await createPasswordForClient({
                ...values,
                clientId,
                email,
            });
            toast.success("Senha criada com sucesso! Você será redirecionado para o login.");
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (error) {
            console.error("Erro ao criar senha:", error);
            toast.error(error instanceof Error ? error.message : "Ocorreu um erro inesperado.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Criando senha..." : "Criar Senha"}
                </Button>
            </form>
        </Form>
    );
}
