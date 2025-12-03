import NextAuth from "next-auth";

declare module "next-auth" {

	interface Session {
		user: {
			id: string;
			nome_usuario: string;
			email: string;
			matricula: string;
			perfil: string;
			accesstoken: string;
			refreshtoken: string;
			telefone?: string;
		};
	}

	interface User {
		id: string;
		nome_usuario: string;
		email: string;
		matricula: string;
		perfil: string;
		accesstoken: string;
		refreshtoken: string;
		telefone?: string;
	}

}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		nome_usuario: string;
		email: string;
		matricula: string;
		perfil: string;
		accesstoken: string;
		refreshtoken: string;
		telefone?: string;
		accessTokenExpires?: number;
		error?: string;
	}
}
