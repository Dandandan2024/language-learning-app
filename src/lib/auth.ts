import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

function hasEmailConfig(): boolean {
  return Boolean(
    process.env.EMAIL_SERVER_HOST &&
      process.env.EMAIL_SERVER_PORT &&
      process.env.EMAIL_SERVER_USER &&
      process.env.EMAIL_SERVER_PASSWORD &&
      process.env.EMAIL_FROM
  );
}

export const authOptions: NextAuthOptions = {
  providers: (
    () => {
      const list = [] as any[];

      // Credentials (email-only) fallback so sign-in always works
      list.push(
        CredentialsProvider({
          name: "Email",
          credentials: {
            email: { label: "Email", type: "email", placeholder: "you@example.com" },
            name: { label: "Name", type: "text", placeholder: "Your name" },
          },
          async authorize(credentials) {
            const email = (credentials?.email || "").toString().trim().toLowerCase();
            const name = (credentials?.name || "User").toString().trim();
            if (!email || !email.includes("@")) return null;

            // Ensure a user record exists
            const existing = await prisma.user.findUnique({ where: { email } });
            const user =
              existing ||
              (await prisma.user.create({
                data: { email, name },
              }));

            return { id: user.id, email: user.email, name: user.name || undefined } as any;
          },
        })
      );

      // Optional Email magic-link (only if fully configured)
      if (hasEmailConfig()) {
        list.push(
          EmailProvider({
            server: {
              host: process.env.EMAIL_SERVER_HOST,
              port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
              auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
              },
            },
            from: process.env.EMAIL_FROM,
          })
        );
      }

      // Optional Google OAuth
      if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        list.push(
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          })
        );
      }

      return list;
    }
  )(),
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
};
