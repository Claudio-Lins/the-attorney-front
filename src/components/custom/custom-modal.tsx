"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

type ModalVariant = "default" | "warning" | "error" | "success" | "info";

type ModalAction = {
	label: string;
	onClick: () => void;
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

interface CustomModalProps {
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
	title?: string;
	description?: string;
	children?: ReactNode;
	actions?: ModalAction[];
	variant?: ModalVariant;
	logo?: string;
	className?: string;
}

export function CustomModal({
	open,
	onOpenChangeAction,
	title = "Confirmação",
	description,
	children,
	actions = [],
	variant = "default",
	logo = "/assets/lgs/vca-hor-pos_lg.svg",
	className,
}: CustomModalProps) {
	const variantStyles = {
		default: {
			title: "bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-800 bg-clip-text text-transparent",
			description: "text-zinc-950",
		},
		warning: {
			title: "text-yellow-600",
			description: "text-yellow-800",
		},
		error: {
			title: "text-red-600",
			description: "text-red-800",
		},
		success: {
			title: "text-green-600",
			description: "text-green-800",
		},
		info: {
			title: "text-blue-600",
			description: "text-blue-800",
		},
	};

	const defaultActions: ModalAction[] = [
		{
			label: "Cancelar",
			onClick: () => onOpenChangeAction(false),
			variant: "outline" as const,
		},
	];

	const modalActions = actions.length > 0 ? actions : defaultActions;

	return (
		<Dialog open={open} onOpenChange={onOpenChangeAction}>
			<DialogContent className={cn("bg-white/50 backdrop-blur-sm border-none shadow-lg", "max-w-md w-full", className)}>
				<DialogHeader className="flex flex-col items-center gap-6">
					{logo && (
						<Image
							className="h-auto w-60 pr-10 cursor-pointer object-contain md:w-80"
							src={logo}
							alt="VCA Logo"
							width={300}
							height={50}
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					)}
					<Separator />

					<DialogTitle className={cn("text-2xl font-bold", variantStyles[variant].title)}>{title}</DialogTitle>

					{description && (
						<DialogDescription className={cn("text-center", variantStyles[variant].description)}>
							{description}
						</DialogDescription>
					)}

					{children}
				</DialogHeader>

				{modalActions.length > 0 && (
					<DialogFooter className="flex gap-2">
						{modalActions.map((action) => (
							<Button
								key={action.label}
								variant={action.variant ?? "default"}
								onClick={action.onClick}
								className="w-full"
							>
								{action.label}
							</Button>
						))}
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
