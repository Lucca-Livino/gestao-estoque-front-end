import { z } from "zod";
import { PERFIS_USUARIO } from "@/types/Funcionarios";

const perfilValues = PERFIS_USUARIO.map((p) => p.value) as [string, ...string[]];

export const FuncionarioCreateSchema = z.object({
  nome_usuario: z
    .string()
    .min(3, "O nome do usuário deve ter no mínimo 3 caracteres")
    .max(100, "O nome do usuário deve ter no máximo 100 caracteres"),

  email: z.string().email("O formato do Email é inválido"),

  matricula: z
    .string()
    .min(1, "A Matrícula é obrigatória")
    .max(20, "A Matrícula deve ter no máximo 20 caracteres"),

  telefone: z
    .string()
    .regex(
      /^\(\d{2}\) \d{4,5}-\d{4}$/,
      "O formato do Telefone é inválido. Use (XX) XXXX-XXXX ou (XX) XXXXX-XXXX"
    ),

  perfil: z.enum(perfilValues as [string, ...string[]]),
});

export type FuncionarioCreateInput = z.infer<typeof FuncionarioCreateSchema>;


export const FuncionarioUpdateSchema = z.object({
  nome_usuario: z
    .string()
    .min(3, "O nome do usuário deve ter no mínimo 3 caracteres")
    .max(100, "O nome do usuário deve ter no máximo 100 caracteres"),
  email: z.string().email("O formato do Email é inválido"),
  matricula: z
    .string()
    .min(1, "A Matrícula é obrigatória")
    .max(20, "A Matrícula deve ter no máximo 20 caracteres"),
  telefone: z
    .string()
    .regex(
      /^\(\d{2}\) \d{4,5}-\d{4}$/,
      "O formato do Telefone é inválido. Use (XX) XXXX-XXXX ou (XX) XXXXX-XXXX"
    ),
  perfil: z
    .enum(perfilValues as [string, ...string[]])
    .refine((val) => !!val, { message: "O Perfil é obrigatório" }),
  ativo: z.boolean().optional(),
});