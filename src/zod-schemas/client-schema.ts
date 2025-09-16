import { z } from "zod/v4";
import { addressArraySchema, AddressSchema, filiationSchema, roleEnum } from "./prisma-schemas";

export const clientSchema = z.object({
	id: z.string(), // UUID do Prisma
	client_id: z.string().min(1, "client_id é obrigatório."),
	first_name: z.string().min(1, "Primeiro nome é obrigatório."),
	last_name: z.string().min(1, "Sobrenome é obrigatório."),
	email: z.string().email("E-mail inválido.").nullable().optional(),
	password: z.string().nullable().optional(),
	passport_number: z.string(),
	country_of_birth: z.string().nullable().optional(),
	passport_issue_date: z.coerce.date().nullable().optional(),
	passport_expiry: z.coerce.date().nullable().optional(),
	nationality: z.string().nullable().optional(),
	place_of_birth: z.string().nullable().optional(),
	date_of_birth: z.coerce.date().nullable().optional(),
	gender: z.string().nullable().optional(),
	marital_status: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"]).nullable().optional(),
	filiation: filiationSchema.nullable().optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	phone: z.string().nullable().optional(),
	role: roleEnum,
	photo_url: z.string().url().nullable().optional(),
	address: addressArraySchema.optional(), // relacionamento com endereços
});

// Exporta o tipo inferido
export type ClientSchema = z.infer<typeof clientSchema>;

// Schema para criação de cliente
export const createClientFormSchema = z.object({
	first_name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
	last_name: z.string().min(2, { message: "Sobrenome deve ter pelo menos 2 caracteres" }),
	email: z.string().email({ message: "Email inválido" }).nullable().optional(),
	passport_number: z.string().min(5, { message: "Número de passaporte inválido" }),
	passport_expiry: z.coerce.date({ message: "Data de expiração é obrigatória" }),
	nationality: z.string().min(2, { message: "Nacionalidade é obrigatória" }),
	place_of_birth: z.string().min(2, { message: "Local de nascimento é obrigatório" }),
	country_of_birth: z.string().min(2, { message: "País de nascimento é obrigatório" }),
	passport_issue_date: z.coerce.date({ message: "Data de emissão do passaporte é obrigatória" }),
	date_of_birth: z.coerce.date({ message: "Data de nascimento é obrigatória" }),
	gender: z.enum(["M", "F"], { message: "Gênero é obrigatório" }),
	filiation: z.object({
		father: z.string().min(2, { message: "Nome do pai é obrigatório" }),
		mother: z.string().min(2, { message: "Nome da mãe é obrigatório" }),
	}),
	phone: z.string().min(8, { message: "Telefone inválido" }),
	photo_url: z.string().url().nullable().optional(),
	client_id: z.string().optional(), // será gerado se não fornecido
});

export type CreateClientFormSchema = z.infer<typeof createClientFormSchema>;

// Schema para edição de cliente (EditClientDialog) - compatibilidade com formulários existentes
export const editClientSchema = z.object({
	firstName: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
	lastName: z.string().min(2, { message: "Sobrenome deve ter pelo menos 2 caracteres" }),
	email: z.string().email({ message: "Email inválido" }),
	passportNumber: z.string().min(5, { message: "Número de passaporte inválido" }),
	passportExpiry: z.coerce.date({ message: "Data de expiração é obrigatória" }),
	nationality: z.string().min(2, { message: "Nacionalidade é obrigatória" }),
	placeOfBirth: z.string().min(2, { message: "Local de nascimento é obrigatório" }),
	countryOfBirth: z.string().min(2, { message: "País de nascimento é obrigatório" }),
	passportIssueDate: z.coerce.date({ message: "Data de emissão do passaporte é obrigatória" }),
	dateOfBirth: z.coerce.date({ message: "Data de nascimento é obrigatória" }),
	gender: z.enum(["M", "F"], { message: "Gênero é obrigatório" }),
	maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"], {
		message: "Estado civil é obrigatório",
	}),
	fatherName: z.string().min(2, { message: "Nome do pai é obrigatório" }),
	motherName: z.string().min(2, { message: "Nome da mãe é obrigatório" }),
	phone: z.string().min(8, { message: "Telefone inválido" }),
	photoUrl: z.string().url().nullable().optional(),
	clientId: z.string().optional(),
	addresses: addressArraySchema.optional(),
});

export type EditClientSchema = z.infer<typeof editClientSchema>;

// Schema para transformar dados do formulário de edição para o formato do banco
export const editClientToDbSchema = editClientSchema.transform((data) => ({
	first_name: data.firstName,
	last_name: data.lastName,
	email: data.email,
	passport_number: data.passportNumber,
	passport_expiry: data.passportExpiry,
	nationality: data.nationality,
	place_of_birth: data.placeOfBirth,
	country_of_birth: data.countryOfBirth,
	passport_issue_date: data.passportIssueDate,
	date_of_birth: data.dateOfBirth,
	gender: data.gender,
	marital_status: data.maritalStatus,
	filiation: {
		father: data.fatherName,
		mother: data.motherName,
	},
	phone: data.phone,
	photo_url: data.photoUrl,
}));

export type EditClientToDbSchema = z.infer<typeof editClientToDbSchema>;

// Schema para transformar dados do banco para o formato do formulário de edição
export const dbToEditClientSchema = clientSchema.transform((data) => ({
	firstName: data.first_name,
	lastName: data.last_name,
	email: data.email || "",
	passportNumber: data.passport_number,
	passportExpiry: data.passport_expiry,
	nationality: data.nationality || "",
	placeOfBirth: data.place_of_birth || "",
	countryOfBirth: data.country_of_birth || "",
	passportIssueDate: data.passport_issue_date,
	dateOfBirth: data.date_of_birth,
	gender: data.gender as "M" | "F",
	maritalStatus: data.marital_status as "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | "SEPARATED",
	fatherName: data.filiation?.father || "",
	motherName: data.filiation?.mother || "",
	phone: data.phone || "",
	photoUrl: data.photo_url,
	clientId: data.client_id,
	addresses: data.address,
}));

export type DbToEditClientSchema = z.infer<typeof dbToEditClientSchema>;
