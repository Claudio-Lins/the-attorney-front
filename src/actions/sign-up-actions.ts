import { prisma } from "@/lib/prisma";
import { withRateLimit } from "@/lib/with-rate-limit";
import { userSchema } from "@/zod-schemas/user-schema";
import { hash } from "bcryptjs";
import { sendVerificationEmail } from "./email-verification-actions";

const signUpInternal = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passportNumber = formData.get("passportNumber") as string | null;

  const validatedData = userSchema.parse({ name, email, password });
  const hashedPassword = await hash(validatedData.password, 10);

  if (passportNumber) {
    // --- Client Activation Flow ---
    try {
      const client = await prisma.client.findUnique({
        where: { passport_number: passportNumber },
      });

      if (!client) {
        return { success: false, message: "Cliente não encontrado." };
      }
      if (client.email && client.email.toLowerCase() !== validatedData.email.toLowerCase()) {
        return { success: false, message: "O email fornecido não corresponde ao do cliente." };
      }
      if (client.userId) {
        return { success: false, message: "Este cliente já possui uma conta de usuário ativa." };
      }

      const newUser = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: validatedData.name,
            email: validatedData.email.toLowerCase(),
            password: hashedPassword,
          },
        });

        await tx.client.update({
          where: {
            id: client.id,
          },
          data: {
            userId: user.id,
            email: client.email ? client.email : validatedData.email.toLowerCase(),
          },
        });
        return user;
      });

      const emailResult = await sendVerificationEmail(newUser.email);
      if (!emailResult.success) {
        return { success: false, message: "Usuário criado, mas erro ao enviar email de verificação." };
      }

      return { success: true, message: "Conta de usuário ativada com sucesso! Verifique seu email.", email: newUser.email };

    } catch (error) {
      console.error("Erro na ativação do cliente:", error);
      // Prisma unique constraint violation
      if ((error as any).code === 'P2002') {
        return { success: false, message: "Um usuário com este email já existe." };
      }
      return { success: false, message: "Ocorreu um erro interno ao ativar a conta." };
    }
  } else {
    // --- Standard Sign-up Flow ---
    try {
      const newUser = await prisma.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email.toLocaleLowerCase(),
          password: hashedPassword,
        },
      });

      const emailResult = await sendVerificationEmail(newUser.email);
      if (!emailResult.success) {
        return { success: false, message: "Usuário criado, mas erro ao enviar email de verificação" };
      }

      return { success: true, message: "Usuário criado com sucesso! Verifique seu email.", email: newUser.email };
    } catch (error) {
      console.error("Erro no cadastro padrão:", error);
      // Prisma unique constraint violation
      if ((error as any).code === 'P2002') {
        return { success: false, message: "Um usuário com este email já existe." };
      }
      return { success: false, message: "Ocorreu um erro interno ao criar o usuário." };
    }
  }
};

const signUp = async (formData: FormData) => {
  const email = formData.get("email")?.toString() || "";
  
  return withRateLimit(
    'signup',
    () => signUpInternal(formData),
    email
  );
};

export type SignUpResult = {
  success: boolean;
  message: string;
  email?: string;
};

export { signUp };
