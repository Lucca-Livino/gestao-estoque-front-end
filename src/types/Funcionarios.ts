export type PerfilUsuario = "administrador" | "gerente" | "estoquista";

export interface Funcionario {
  _id: string;
  data_cadastro: string;
  data_ultima_atualizacao: string;
  nome_usuario: string; // Equivalente a nome_fornecedor
  email: string;
  matricula: string; // Equivalente a CNPJ
  telefone: string; // Adicionado para consistência com o CRUD de fornecedor
  perfil: PerfilUsuario;
  ativo: boolean; // Equivalente a status
  senha_definida: boolean;
  online: boolean;

  // Campos que não serão manipulados nos formulários
  senha?: string;
  accesstoken?: string;
  refreshtoken?: string;
}

export interface FuncionarioCreateInput {
  nome_usuario: string;
  email: string;
  matricula: string;
  telefone: string;
  perfil: PerfilUsuario;
  senha?: string;
  ativo?: boolean;
}

// Lista de perfis para uso no Select (Edição)
export const PERFIS_USUARIO: { value: PerfilUsuario; label: string }[] = [
  { value: "administrador", label: "Administrador" },
  { value: "gerente", label: "Gerente" },
  { value: "estoquista", label: "Estoquista" },
];