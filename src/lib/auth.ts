import { prisma } from "@/lib/prisma"
import { loginSchema } from "@/zod-schemas/login-schema"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/en/sign-in",
    error: "/en/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedCredentials = loginSchema.parse(credentials)

        const user = await prisma.user.findFirst({
          where: {
            email: validatedCredentials?.email.toLocaleLowerCase()
          }
        })
        if (!user) {
          throw new Error("Credenciais inválidas")
        }

        const passwordsMatch = await compare(validatedCredentials.password, user.password!) 
        if (!passwordsMatch) {
          throw new Error("Credenciais inválidas")
        }

        // Verificar se o email foi verificado
        if (!user.emailVerified) {
          throw new Error("Email não verificado. Verifique seu email antes de fazer login.")
        }

         return {
           id: user.id,
           email: user.email,
           name: user.name || "Usuário",
           role: user.role,
           image: user.image,
           createdAt: user.createdAt,
           updatedAt: user.updatedAt,
           emailVerified: user.emailVerified,
         }
      },
    }),
  ],
   callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role || 'USER';
        token.image = user.image || null;
        token.createdAt = user.createdAt || new Date();
        token.updatedAt = user.updatedAt || new Date();
        token.emailVerified = user.emailVerified || null;

        try {
          const client = await prisma.client.findUnique({
            where: { userId: user.id },
          });
          if (client) {
            token.clientId = client.id;
          }
        } catch (error) {
          console.error("Error fetching client in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string | null,
          email: token.email as string,
          role: token.role as string,
          image: token.image as string | null,
          createdAt: token.createdAt as Date,
          updatedAt: token.updatedAt as Date,
          emailVerified: token.emailVerified as Date | null,
          clientId: token.clientId as string | undefined,
        };
      }
      return session
    },
  },
})