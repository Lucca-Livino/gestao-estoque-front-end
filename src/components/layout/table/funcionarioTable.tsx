"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { CustomPagination } from "../pagination/paginationWrapper";
import { ItemsPerPage } from "../pagination/itemsPerPage";
import { Funcionario } from "@/types/Funcionarios"; // Importa o tipo Funcionário
import { useQueryState, parseAsInteger } from "nuqs";
import { AdjustDate } from "@/lib/adjustDate";
import FuncionarioCadastro from "../popUp/funcionarios/funcionarioCadastro"; // Componente de Cadastro
import { FuncionarioListagem } from "../popUp/funcionarios/funcionarioListagem"; // Componente de Visualização
import { FuncionarioEdicao } from "../popUp/funcionarios/funcionarioEdicao"; // Componente de Edição
import {
  FuncionariosFilter, // Componente de Filtro (atualizado na iteração anterior)
  FuncionariosFilterProps,
} from "../filters/funcionarios"; // Ajuste o path se necessário

interface TabelaFuncionariosProps {
  funcionarios: Funcionario[];
  totalPages: number;
  totalDocs: number;
  currentPage: number;
  perPage: number;
  filtros: FuncionariosFilterProps;
}

export default function TabelaFuncionarios({
  funcionarios,
  totalPages,
  totalDocs,
  currentPage,
  perPage,
  filtros,
}: TabelaFuncionariosProps) {
  const [pageState, setPageState] = useQueryState(
    "page",
    parseAsInteger.withDefault(currentPage)
  );

  const [perPageState, setPerPageState] = useQueryState(
    "limite",
    parseAsInteger.withDefault(perPage)
  );

  // Estados para os modais de Visualização, Edição e Cadastro
  const [open, setOpen] = useState<boolean>(false);
  const [selectedFuncionario, setSelectedFuncionario] =
    useState<Funcionario | null>(null);

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editFuncionario, setEditFuncionario] = useState<Funcionario | null>(null);

  const [cadastroOpen, setCadastroOpen] = useState<boolean>(false);

  return (
    <>
      {/* Área de Filtro e Botão de Cadastro */}
      <div className="flex flex-row place-content-between pb-2">
        {/* Usando o componente de filtro de Funcionários */}
        <FuncionariosFilter
          nomeUsuario={filtros.nomeUsuario}
          setNomeUsuario={filtros.setNomeUsuario}
          perfil={filtros.perfil}
          setPerfil={filtros.setPerfil}
          ativo={filtros.ativo}
          setAtivo={filtros.setAtivo}
          onSubmit={filtros.onSubmit}
          onStatusChange={filtros.onStatusChange}
          onPerfilChange={filtros.onPerfilChange}
        />

        {/* Botão de Cadastro */}
        <FuncionarioCadastro
          color="green"
          size="1/8"
          open={cadastroOpen}
          onOpenChange={(value) => setCadastroOpen(value)}
        />
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left text-neutral-500">ID</TableHead>
              <TableHead className="text-left text-neutral-500">
                Nome
              </TableHead>
              <TableHead className="text-left text-neutral-500">
                Email
              </TableHead>
              <TableHead className="text-left text-neutral-500">
                Cargo
              </TableHead>
              {/* Removido Data Cadastro para manter o layout simples do Figma */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {funcionarios.map((funcionario) => (
              <TableRow
                key={funcionario._id}
                onClick={() => {
                  setSelectedFuncionario(funcionario);
                  setOpen(true);
                }}
                className="hover:bg-slate-50 cursor-pointer"
              >
                {/* Coluna ID (usando os 12 primeiros caracteres do _id, como é comum) */}
                <TableCell className="font-medium text-left text-neutral-700 w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                  {funcionario._id.slice(0, 12)}...
                </TableCell>
                {/* Coluna Nome */}
                <TableCell className="text-left text-neutral-700">
                  {funcionario.nome_usuario}
                </TableCell>
                {/* Coluna Email */}
                <TableCell className="text-left text-neutral-700">
                  {funcionario.email}
                </TableCell>
                {/* Coluna Cargo (Perfil) */}
                <TableCell className="text-left text-neutral-700 capitalize">
                  {funcionario.perfil}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modais de Visualização e Edição */}
      <FuncionarioListagem
        open={open}
        funcionario={selectedFuncionario}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) setSelectedFuncionario(null);
        }}
        onEditar={(funcionario) => {
          setOpen(false); // Fecha o modal de visualização
          setEditFuncionario(funcionario);
          setEditOpen(true); // Abre o modal de edição
        }}
        onCadastrar={() => {
          setOpen(false);
          setCadastroOpen(true); // Abre o modal de cadastro
        }}
        onExcluir={() => {
          setOpen(false);
          setSelectedFuncionario(null);
        }}
      />

      <FuncionarioEdicao
        open={editOpen}
        onOpenChange={(value) => {
          setEditOpen(value);
          if (!value) setEditFuncionario(null);
        }}
        funcionario={editFuncionario}
      />

      {/* Paginação */}
      <div className="flex justify-between">
        <div className="px-4 py-6 flex items-center justify-between w-full">
          <ItemsPerPage
            perPage={perPageState ?? perPage}
            setPerPage={(value) => {
              setPerPageState(value);
              setPageState(1);
            }}
            totalItems={Number(totalDocs)}
            tableData={funcionarios}
            tableTitle="Relatório de Funcionários"
            tableColumns={[
              { key: "_id", label: "ID", format: (value) => value.slice(0, 12) + "..." },
              { key: "nome_usuario", label: "Nome" },
              { key: "email", label: "Email" },
              { key: "matricula", label: "Matrícula" },
              { key: "perfil", label: "Cargo/Perfil", format: (value) => value.charAt(0).toUpperCase() + value.slice(1) },
              {
                key: "ativo",
                label: "Status",
                format: (value) => (value ? "Ativo" : "Inativo"),
              },
              {
                key: "data_cadastro",
                label: "Data de cadastro",
                format: (value) => (value ? AdjustDate(value) : "-"),
              },
            ]}
          />

          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage ?? 1}
            onPageChange={(page) => setPageState(page)}
          />
        </div>
      </div>
    </>
  );
}