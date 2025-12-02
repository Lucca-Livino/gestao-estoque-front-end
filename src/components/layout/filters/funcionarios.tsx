import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PERFIS_USUARIO, PerfilUsuario } from "@/types/Funcionarios";

export interface FuncionariosFilterProps {
  nomeUsuario?: string;
  setNomeUsuario: (v: string) => void;
  perfil?: PerfilUsuario | null;
  setPerfil: (v: PerfilUsuario | null) => void;
  ativo?: boolean | null;
  setAtivo: (v: boolean | null) => void;
  onSubmit?: () => void;
  onStatusChange?: (newStatus: boolean | null) => void;
  onPerfilChange?: (newPerfil: PerfilUsuario | null) => void;
}

/**
 * Componente de filtro para a listagem de Funcionários/Usuários.
 * Permite buscar por texto (nome, email, matrícula), filtrar por Perfil e por Status (Ativo/Inativo).
 */
export function FuncionariosFilter({
  nomeUsuario,
  setNomeUsuario,
  perfil,
  setPerfil,
  ativo,
  setAtivo,
  onSubmit,
  onStatusChange,
  onPerfilChange,
}: FuncionariosFilterProps) {
  return (
    <div className="mb-4 flex flex-row gap-4">
      {/* Filtro de Busca por Texto (Nome, Email, Matrícula) */}
      <InputGroup className="w-100">
        <InputGroupInput
          placeholder="Buscar por nome, email ou matrícula"
          value={nomeUsuario}
          onChange={(e) => setNomeUsuario(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSubmit) {
              e.preventDefault?.();
              onSubmit();
            }
          }}
        />
        <InputGroupAddon>
          <SearchIcon className="cursor-pointer text-gray-500 hover:text-blue-600" onClick={onSubmit} />
        </InputGroupAddon>
      </InputGroup>

      {/* Filtro de Perfil */}
      <Select
        value={perfil === null || perfil === undefined ? "todos" : perfil}
        onValueChange={(v) => {
          const novo = v === "todos" ? null : (v as PerfilUsuario);
          setPerfil(novo);
          onPerfilChange?.(novo);
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Perfil" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="todos">Todos os Perfis</SelectItem>
            {/* Mapeando a lista de perfis do tipo Funcionario */}
            {PERFIS_USUARIO.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Filtro de Status (Ativo) */}
      <Select
        value={ativo === null ? "todos" : ativo === true ? "true" : "false"}
        onValueChange={(v) => {
          const novo = v === "todos" ? null : v === "true";
          setAtivo(novo);
          onStatusChange?.(novo);
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="true">Ativo</SelectItem>
            <SelectItem value="false">Inativo</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Botão de Ação para Filtrar */}
      <Button
        onClick={onSubmit}
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
      >
        <ListFilter className="w-4 h-4 mr-1" />
        Filtrar
      </Button>
    </div>
  );
}