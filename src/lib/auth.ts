import { prisma } from "../lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

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
      if (user) {
        (token as JWT & { username?: string; role?: string }).username = (user as { username: string }).username;
        (token as JWT & { username?: string; role?: string }).role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as Session & { user: { username?: string; role?: string } }).user.username = (token as JWT & { username?: string }).username;
        (session as Session & { user: { username?: string; role?: string } }).user.role = (token as JWT & { role?: string }).role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


