import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          throw new Error("Invalid credentials");
        }

        console.log("🔍 Authenticating user:", credentials.email);

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          console.log("❌ User not found or no password:", credentials.email);
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          console.log("❌ Invalid password for:", credentials.email);
          throw new Error("Invalid credentials");
        }

        console.log("✅ Authentication successful for:", credentials.email, "role:", user.role);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("🔧 JWT callback - adding user to token:", user.email, user.role);
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("🔧 Session callback - token:", token?.id, token?.role);
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        console.log("🔧 Session callback - final session:", session.user.email, session.user.role);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};