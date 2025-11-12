// Define o tipo para os perfis de usuário, baseado no "enum" do schema
export type PerfilUsuario = "administrador" | "gerente" | "estoquista";

// Interface principal do Usuário
export interface Usuario {
  // Campos que o Mongoose adiciona automaticamente
  _id: string;
  data_cadastro: string; // Ou Date, dependendo de como você trata (Mongoose usa 'createdAt')
  data_ultima_atualizacao: string; // Ou Date (Mongoose usa 'updatedAt')

  // Campos do seu schema
  nome_usuario: string;
  email: string;
  matricula: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  senha_definida: boolean;
  online: boolean;

  // Campos opcionais (não são "required" ou não têm "default")
  senha?: string;
  accesstoken?: string;
  refreshtoken?: string;
  token_recuperacao?: string;
  token_recuperacao_expira?: string;
  codigo_recuperacao?: string;
  data_expiracao_codigo?: Date;
}

// --- Opcional: Tipo para Criar um Novo Usuário ---
// (Frequentemente útil para formulários ou payloads de API)

// Use "Pick" ou "Omit" para basear-se na interface principal.
// Aqui, estou "Omit" (omitindo) os campos que o banco de dados gera.
export type CriarUsuarioDto = Omit<
  Usuario,
  | "_id"
  | "data_cadastro"
  | "data_ultima_atualizacao"
  | "perfil" // Opcional, pois tem 'default'
  | "ativo" // Opcional, pois tem 'default'
  | "senha_definida" // Opcional, pois tem 'default'
  | "online" // Opcional, pois tem 'default'
> & {
  // Reescrevemos os campos com 'default' como opcionais
  perfil?: PerfilUsuario;
  ativo?: boolean;
  senha_definida?: boolean;
  online?: boolean;
};