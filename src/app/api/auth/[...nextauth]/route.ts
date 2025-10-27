import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

/**
 * Função auxiliar para renovar o access token usando o refresh token.
 */
async function refreshAccessToken(token: JWT) {
  try {
    const res = await fetch(`${process.env.API_URL_SERVER_SIDED}/login/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshtoken: token.refreshtoken }),
    });

    if (!res.ok) throw new Error("Falha ao renovar token");

    const json = await res.json();
    const data = json.data;

    return {
      ...token,
      accesstoken: data.accesstoken,
      refreshtoken: data.refreshtoken ?? token.refreshtoken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // ✅ 1 hora (ou data.expires_in se existir)
      user: data.usuario ?? token.user, // opcional, caso queira atualizar dados do usuário
    };
  } catch (err) {
    console.error("Erro ao renovar token:", err);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        siape: { label: "Siape", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.siape || !credentials?.senha) return null;

        const res = await fetch(`${process.env.API_URL_SERVER_SIDED}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            siape: credentials.siape,
            senha: credentials.senha,
          }),
        });

        if (!res.ok) return null;

        const json = await res.json();
        const user = json.data;

        if (user && user.usuario._id) {
          return {
            id: user.usuario._id,
            nome_usuario: user.usuario.nome_usuario ?? "",
            email: user.usuario.email ?? "",
            matricula: user.usuario.matricula ?? "",
            perfil: user.usuario.perfil ?? "",
            ativo: user.usuario.ativo ?? false,
            senha_definida: user.usuario.senha_definida ?? false,
            online: user.usuario.online ?? false,
            grupos: user.usuario.grupos ?? [],
            permissoes: user.usuario.permissoes ?? [],
            data_cadastro: user.usuario.data_cadastro ?? "",
            data_ultima_atualizacao: user.usuario.data_ultima_atualizacao ?? "",
            accesstoken: user.accesstoken ?? "",
            refreshtoken: user.refreshtoken ?? "",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // 1️⃣ Primeiro login
      if (user) {
        return {
          ...token,
          ...user,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hora
        };
      }

      // 2️⃣ Token ainda válido
      if (Date.now() < Number(token.accessTokenExpires ?? 0)) {
        return token;
      }

      // 3️⃣ Token expirou → tenta renovar
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user = { ...session.user, ...token };
      }

      // Se o refresh falhou, forçar logout no cliente
      if (token?.error === "RefreshAccessTokenError" && typeof window !== "undefined") {
        window.location.href = "/logout";
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
