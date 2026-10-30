import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Login com Google. A sessão fica em um cookie assinado (JWT), sem tabela de
 * sessões, e o `sub` do Google identifica a pessoa na API.
 *
 * O login é opcional no site inteiro: artigos e lições nunca dependem dele.
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    session({ session, token }) {
      return { ...session, sub: token.sub };
    },
  },
};

/** Quem está logado, para uso no servidor; `null` para visitantes. */
export async function currentUser(): Promise<{ subject: string; name?: string | null } | null> {
  const session = await getServerSession(authOptions);
  const subject = (session as { sub?: string } | null)?.sub;
  return subject ? { subject, name: session?.user?.name } : null;
}
