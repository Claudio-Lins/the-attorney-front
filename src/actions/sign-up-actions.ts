import { prisma } from "@/lib/prisma";
import { withRateLimit } from "@/lib/with-rate-limit";
import { userSchema } from "@/zod-schemas/user-schema";
import { hash } from "bcryptjs";
import { sendVerificationEmail } from "./email-verification-actions";

const signUpInternal = async (formData: FormData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  
  console.log("Dados recebidos do formulário:", JSON.stringify({ name, email, password }, null, 2));
  
  const validatedData = userSchema.parse({ name, email, password });
  console.log("Dados validados:", JSON.stringify(validatedData, null, 2));
  
  const hashedPassword = await hash(validatedData.password, 10);
  
  const newUser = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email.toLocaleLowerCase(),
      password: hashedPassword,
    },
  });
  
  console.log("Usuário criado com sucesso:", JSON.stringify(newUser, null, 2));
  
  // Enviar email de verificação automaticamente
  const emailResult = await sendVerificationEmail(newUser.email);
  
  if (!emailResult.success) {
    console.log("Erro ao enviar email de verificação:", emailResult.message);
    return { 
      success: false, 
      message: "Usuário criado, mas erro ao enviar email de verificação" 
    };
  }
  
  return { 
    success: true, 
    message: "Usuário criado com sucesso! Verifique seu email.", 
    email: newUser.email 
  };
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
