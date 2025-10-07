import { prisma } from "../lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

type AuthUser = {
  id: string;
  name: string | null;
  username: string;
  role: string;
};

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.username === "string" && typeof obj.role === "string";
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });
        if (!user || !user.passwordHash) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.name ?? user.username, username: user.username, role: user.role } as {
          id: string;
          name: string | null;
          username: string;
          role: string;
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      const t = token as JWT & { username?: string; role?: string };
      if (user && isAuthUser(user)) {
        t.username = user.username;
        t.role = user.role;
      }
      return t;
    },
    async session({ session, token }) {
      const s = session as Session & { user: { username?: string; role?: string } };
      const t = token as JWT & { username?: string; role?: string };
      if (s.user) {
        s.user.username = t.username;
        s.user.role = t.role;
      }
      return s;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


