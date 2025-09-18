"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClientSchema } from "@/zod-schemas/client-schema";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<ClientSchema>[] = [
	{
		accessorKey: "client_id",
		header: "Client ID",
		cell: ({ row }) => {
			const clientId = row.getValue("client_id") as string;
			return <div className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{clientId}</div>;
		},
	},
	{
		accessorKey: "first_name",
		header: "Nome",
		cell: ({ row }) => {
			const firstName = row.getValue("first_name") as string;
			const lastName = row.original.last_name;
			return (
				<div className="font-medium">
					{firstName} {lastName}
				</div>
			);
		},
	},
	{
		accessorKey: "passport_number",
		header: "Passaporte",
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => {
			const email = row.getValue("email") as string;
			return email ? (
				<div className="text-sm">{email}</div>
			) : (
				<div className="text-sm text-slate-400 italic">Não informado</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const client = row.original;
			const isAuthenticated = !!client.userId;

			return isAuthenticated ? (
				<Badge variant="default">Ativo</Badge>
			) : (
				<Badge variant="destructive">Pendente</Badge>
			);
		},
	},
	{
		accessorKey: "phone",
		header: "Telefone",
		cell: ({ row }) => {
			const phone = row.getValue("phone") as string;
			return phone ? (
				<div className="text-sm">{phone}</div>
			) : (
				<div className="text-sm text-slate-400 italic">Não informado</div>
			);
		},
	},
	{
		accessorKey: "nationality",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="text-lg font-bold -ml-4"
				>
					Nacionalidade
					<ArrowUpDown className="ml-2 h-4 w-4 text-lg font-bold" />
				</Button>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const client = row.original;

			return (
				// <DropdownMenu>
				// 	<DropdownMenuTrigger asChild>
				<Button variant="link" asChild className="h-8 w-8 p-0">
					<Link href={`/admin/clients/${client.client_id}`}>
						<Eye className="h-8 w-8 text-lg font-bold" />
					</Link>
				</Button>
				// 	</DropdownMenuTrigger>
				// 	<DropdownMenuContent align="end">
				// 		<DropdownMenuLabel>Actions</DropdownMenuLabel>
				// 		<DropdownMenuItem onClick={() => navigator.clipboard.writeText(client.clientId)}>
				// 			Copy payment ID
				// 		</DropdownMenuItem>
				// 		<DropdownMenuSeparator />
				// 		<DropdownMenuItem>
				// 			<Link href={`/admin/clients/${client.clientId}`}>View client</Link>
				// 		</DropdownMenuItem>
				// 		<DropdownMenuItem>View payment details</DropdownMenuItem>
				// 	</DropdownMenuContent>
				// </DropdownMenu>
			);
		},
	},
];
