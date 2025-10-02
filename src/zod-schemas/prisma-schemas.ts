// prisma-schemas.ts
import { z } from "zod/v4";

// ===== Enums =====

export const roleEnum = z.enum(["ADMIN", "USER"]);
export type RoleEnum = z.infer<typeof roleEnum>;

export const serviceStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);
export type ServiceStatusEnum = z.infer<typeof serviceStatusEnum>;

export const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export type PriorityEnum = z.infer<typeof priorityEnum>;

// ===== aimaVectors =====

export const aimaVectorsSchema = z.object({
	id: z.bigint(),
	content: z.string().nullable().optional(),
	metadata: z.any().nullable().optional(), // JSON
	embedding: z.any().nullable().optional(), // vetor não suportado diretamente
});
export type AimaVectorsSchema = z.infer<typeof aimaVectorsSchema>;

// ===== attorney_mensagens =====

export const attorneyMensagensSchema = z.object({
	id: z.number(),
	session_id: z.string().max(255),
	message: z.any(),
});
export type AttorneyMensagensSchema = z.infer<typeof attorneyMensagensSchema>;

// ===== documents =====

export const documentsSchema = z.object({
	id: z.bigint(),
	content: z.string().nullable().optional(),
	metadata: z.any().nullable().optional(),
	embedding: z.any().nullable().optional(),
});
export type DocumentsSchema = z.infer<typeof documentsSchema>;

// ===== service_category =====

export const serviceCategorySchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});
export type ServiceCategorySchema = z.infer<typeof serviceCategorySchema>;

export const createServiceCategorySchema = z.object({
	name: z.string().min(1, "Nome da categoria é obrigatório"),
	description: z.string().nullable().optional(),
});
export type CreateServiceCategorySchema = z.infer<typeof createServiceCategorySchema>;

// ===== service =====

export const createServiceSchema = z.object({
	name: z.string().min(1, "Nome do serviço é obrigatório"),
	description: z.string().min(1, "Descrição é obrigatória"),
	price: z.number().positive("Preço deve ser positivo"),
	duration: z.number().nullable().optional(),
	is_active: z.boolean().default(true),
	category_id: z.string().min(1, "Categoria é obrigatória"),
});
export type CreateServiceSchema = z.infer<typeof createServiceSchema>;

export const serviceSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	price: z.number(),
	duration: z.number().nullable().optional(),
	is_active: z.boolean(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	category_id: z.string(),
});
export type ServiceSchema = z.infer<typeof serviceSchema>;

export const updateServiceSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Nome do serviço é obrigatório"),
	description: z.string().min(1, "Descrição é obrigatória"),
	price: z.number().positive("Preço deve ser positivo"),
	duration: z.number().nullable().optional(),
	is_active: z.boolean(),
	category_id: z.string().min(1, "Categoria é obrigatória"),
});
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;

// ===== filiation =====

export const filiationSchema = z.object({
	father: z.string().nullable().optional(),
	mother: z.string().nullable().optional(),
});
export type FiliationSchema = z.infer<typeof filiationSchema>;

// ===== client =====

export const createClientSchema = z.object({
	client_id: z.string().optional(), // Será gerado se não fornecido
	first_name: z.string().min(1, "Nome é obrigatório"),
	last_name: z.string().min(1, "Sobrenome é obrigatório"),
	email: z.string().email("Email inválido").nullable().optional(),
	passport_number: z.string().min(1, "Número do passaporte é obrigatório"),
	passport_expiry: z.coerce.date().nullable().optional(),
	passport_issue_date: z.coerce.date().nullable().optional(),
	nationality: z.string().nullable().optional(),
	place_of_birth: z.string().nullable().optional(),
	country_of_birth: z.string().nullable().optional(),
	date_of_birth: z.coerce.date().nullable().optional(),
	gender: z.string().nullable().optional(),
	filiation: filiationSchema.nullable().optional(),
	phone: z.string().nullable().optional(),
	role: roleEnum.default("USER"),
	photo_url: z.string().nullable().optional(),
});
export type CreateClientSchema = z.infer<typeof createClientSchema>;

export const clientSchema = z.object({
	id: z.string(),
	client_id: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	email: z.string().nullable().optional(),
	passport_number: z.string(),
	passport_expiry: z.coerce.date().nullable().optional(),
	passport_issue_date: z.coerce.date().nullable().optional(),
	nationality: z.string().nullable().optional(),
	place_of_birth: z.string().nullable().optional(),
	country_of_birth: z.string().nullable().optional(),
	date_of_birth: z.coerce.date().nullable().optional(),
	gender: z.string().nullable().optional(),
	filiation: filiationSchema.nullable().optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	phone: z.string().nullable().optional(),
	role: roleEnum,
	photo_url: z.string().nullable().optional(),
});
export type ClientSchema = z.infer<typeof clientSchema>;

export const updateClientSchema = z.object({
	id: z.string(),
	first_name: z.string().min(1, "Nome é obrigatório").optional(),
	last_name: z.string().min(1, "Sobrenome é obrigatório").optional(),
	email: z.string().email("Email inválido").nullable().optional(),
	passport_number: z.string().optional(),
	passport_expiry: z.coerce.date().nullable().optional(),
	passport_issue_date: z.coerce.date().nullable().optional(),
	nationality: z.string().nullable().optional(),
	place_of_birth: z.string().nullable().optional(),
	country_of_birth: z.string().nullable().optional(),
	date_of_birth: z.coerce.date().nullable().optional(),
	gender: z.string().nullable().optional(),
	filiation: filiationSchema.nullable().optional(),
	phone: z.string().nullable().optional(),
	photo_url: z.string().nullable().optional(),
});
export type UpdateClientSchema = z.infer<typeof updateClientSchema>;

// ===== client_service =====

export const clientServiceSchema = z.object({
	id: z.string(),
	client_id: z.string(),
	service_id: z.string(),
	os_number: z.string().nullable().optional(),
	status: serviceStatusEnum,
	start_date: z.coerce.date().nullable().optional(),
	end_date: z.coerce.date().nullable().optional(),
	notes: z.string().nullable().optional(),
	documents: z.any().nullable().optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	assigned_to: z.string().nullable().optional(),
	priority: priorityEnum,
});
export type ClientServiceSchema = z.infer<typeof clientServiceSchema>;

export const createClientServiceSchema = z.object({
	client_id: z.string().min(1, "Cliente é obrigatório"),
	service_id: z.string().min(1, "Serviço é obrigatório"),
	os_number: z.string().nullable().optional(),
	status: serviceStatusEnum.default("PENDING"),
	start_date: z.coerce.date().nullable().optional(),
	end_date: z.coerce.date().nullable().optional(),
	notes: z.string().nullable().optional(),
	priority: priorityEnum.default("MEDIUM"),
	assigned_to: z.string().nullable().optional(),
	documents: z.any().nullable().optional(),
});
export type CreateClientServiceSchema = z.infer<typeof createClientServiceSchema>;

export const updateClientServiceSchema = z.object({
	id: z.string().optional(), // ✅ Torna o id opcional, já que será usado apenas como parâmetro
	os_number: z.string().nullable().optional(),
	status: serviceStatusEnum.optional(),
	start_date: z.coerce.date().nullable().optional(),
	end_date: z.coerce.date().nullable().optional(),
	notes: z.string().nullable().optional(),
	priority: priorityEnum.optional(),
	assigned_to: z.string().nullable().optional(),
	documents: z.any().nullable().optional(),
});
export type UpdateClientServiceSchema = z.infer<typeof updateClientServiceSchema>;

// ===== client_service_history =====

export const clientServiceHistorySchema = z.object({
	id: z.string(),
	client_service_id: z.string(),
	changed_at: z.coerce.date(),
	changed_by: z.string().nullable().optional(),
	field: z.string(),
	old_value: z.string().nullable().optional(),
	new_value: z.string().nullable().optional(),
	note: z.string().nullable().optional(),
});
export type ClientServiceHistorySchema = z.infer<typeof clientServiceHistorySchema>;

export const createClientServiceHistorySchema = z.object({
	client_service_id: z.string().min(1, "Client Service é obrigatório"),
	changed_by: z.string().nullable().optional(),
	field: z.string().min(1, "Campo é obrigatório"),
	old_value: z.string().nullable().optional(),
	new_value: z.string().nullable().optional(),
	note: z.string().nullable().optional(),
});
export type CreateClientServiceHistorySchema = z.infer<typeof createClientServiceHistorySchema>;

// ===== address =====

export const addressSchema = z.object({
	id: z.string(),
	street: z.string(),
	number: z.string(),
	complement: z.string().nullable().optional(),
	neighborhood: z.string(),
	city: z.string(),
	state: z.string(),
	zip_code: z.string(),
	country: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	client_id: z.string(),
});
export type AddressSchema = z.infer<typeof addressSchema>;

export const createAddressSchema = z.object({
	street: z.string().min(1, "Rua é obrigatória"),
	number: z.string().min(1, "Número é obrigatório"),
	complement: z.string().nullable().optional(),
	neighborhood: z.string().min(1, "Bairro é obrigatório"),
	city: z.string().min(1, "Cidade é obrigatória"),
	state: z.string().min(1, "Estado é obrigatório"),
	zip_code: z.string().min(1, "CEP é obrigatório"),
	country: z.string().min(1, "País é obrigatório"),
	client_id: z.string().min(1, "Cliente é obrigatório"),
});
export type CreateAddressSchema = z.infer<typeof createAddressSchema>;

export const updateAddressSchema = z.object({
	id: z.string(),
	street: z.string().min(1, "Rua é obrigatória").optional(),
	number: z.string().min(1, "Número é obrigatório").optional(),
	complement: z.string().nullable().optional(),
	neighborhood: z.string().min(1, "Bairro é obrigatório").optional(),
	city: z.string().min(1, "Cidade é obrigatória").optional(),
	state: z.string().min(1, "Estado é obrigatório").optional(),
	zip_code: z.string().min(1, "CEP é obrigatório").optional(),
	country: z.string().min(1, "País é obrigatório").optional(),
});
export type UpdateAddressSchema = z.infer<typeof updateAddressSchema>;

export const addressArraySchema = z.array(addressSchema);
export type AddressArraySchema = z.infer<typeof addressArraySchema>;

// ===== Schema específico para dados do passaporte (compatibilidade com n8n) =====

export const passportDataSchema = z.object({
	passportNumber: z.string().min(1, "Número do passaporte é obrigatório"),
	surname: z.string().min(1, "Sobrenome é obrigatório"),
	firstName: z.string().min(1, "Nome é obrigatório"),
	issuingCountry: z.string().nullable().optional(),
	nationality: z.string().nullable().optional(),
	dateOfBirth: z.string().nullable().optional(), // formato AAAA-MM-DD
	sex: z.string().nullable().optional(),
	placeOfBirth: z.string().nullable().optional(),
	filiation: filiationSchema.nullable().optional(),
	dateOfIssue: z.string().nullable().optional(), // formato AAAA-MM-DD
	dateOfExpiry: z.string().nullable().optional(), // formato AAAA-MM-DD
	authority: z.string().nullable().optional(),
});
export type PassportDataSchema = z.infer<typeof passportDataSchema>;

// ===== Schema para transformar dados do passaporte em client =====

export const passportToClientSchema = passportDataSchema.transform((data) => ({
	client_id: `CLIENT_${data.passportNumber.toUpperCase().replace(/[^A-Z0-9]/g, "")}`,
	first_name: data.firstName,
	last_name: data.surname,
	passport_number: data.passportNumber,
	passport_expiry: data.dateOfExpiry ? new Date(data.dateOfExpiry) : null,
	passport_issue_date: data.dateOfIssue ? new Date(data.dateOfIssue) : null,
	nationality: data.nationality,
	place_of_birth: data.placeOfBirth,
	country_of_birth: data.issuingCountry,
	date_of_birth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
	gender: data.sex,
	filiation: data.filiation,
	role: "USER" as const,
}));
export type PassportToClientSchema = z.infer<typeof passportToClientSchema>;
