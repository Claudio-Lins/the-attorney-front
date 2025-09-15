"use server"

import { signIn as nextAuthSignIn } from "@/lib/auth"
import { withRateLimit } from "@/lib/with-rate-limit"

export async function signInWithGoogle() {
  await nextAuthSignIn("google")
}

export async function signInWithCredentials(formData: FormData) {
  const email = formData.get("email")?.toString() || ""
  
  return withRateLimit(
    'login',
    async () => {
      await nextAuthSignIn("credentials", formData)
      return { success: true, message: "Login realizado com sucesso!" }
    },
    email
  );
} 