"use server";

import { revalidatePath } from "next/cache";

import { createService } from "@/actions/service";
import { serviceSchema } from "@/zod-schemas/prisma-schemas";

export async function handleCreateService(formData: FormData) {
	const data = {
		name: formData.get("name"),
		description: formData.get("description"),
		price: Number(formData.get("price")),
		duration: formData.get("duration") ? Number(formData.get("duration")) : null,
		isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
		categoryId: formData.get("categoryId"),
	};

	await createService(data);
	revalidatePath("/[locale]/(authenticated)/admin/services", "page"); // ajuste o path conforme sua rota
}
