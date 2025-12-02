"use client";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Funcionario,
  PERFIS_USUARIO,
  PerfilUsuario,
} from "@/types/Funcionarios";
import { fetchData } from "@/services/api";
import { FuncionarioUpdateSchema } from "@/schemas/funcionarios";
import { Switch } from "@/components/ui/switch"; // Adicionei Switch para o campo 'ativo'

interface FuncionarioEdicaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funcionario: Funcionario | null;
}

export function FuncionarioEdicao({
  open,
  onOpenChange,
  funcionario,
}: FuncionarioEdicaoProps) {
  const [formData, setFormData] = useState({
    nome_usuario: "",
    telefone: "",
    email: "",
    perfil: "" as PerfilUsuario,
    ativo: true,
  });

  const queryClient = useQueryClient();

  const { mutate: updateFuncionario, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      if (!funcionario?._id) {
        throw new Error("ID do funcionário não encontrado");
      }

      const body = {
        nome_usuario: payload.nome_usuario,
        telefone: payload.telefone,
        email: payload.email,
        perfil: payload.perfil,
        ativo: payload.ativo,
      };

      return await fetchData<any>(
        `/funcionarios/${funcionario._id}`,
        "PATCH",
        undefined,
        body
      );
    },
    onSuccess: () => {
      toast.success("Funcionário atualizado com sucesso!", {
        description: "As alterações foram salvas.",
      });

      queryClient.invalidateQueries({ queryKey: ["listaFuncionarios"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.log("Erro ao atualizar funcionário:", error);

      const errorData = error?.response?.data || error?.data || error;
      const errorMessage =
        errorData?.customMessage ||
        errorData?.message ||
        error?.message ||
        error?.toString() ||
        "";

      if (errorData?.errorType === "validationError" && errorData?.field) {
        const field = errorData.field;
        const message = errorData.customMessage || `${field} inválido`;

        if (field === "email") {
          toast.error("Email duplicado", {
            description: message,
          });
        } else {
          toast.error("Erro de validação", {
            description: message,
          });
        }
      } else {
        const message = errorMessage || "Falha ao atualizar funcionário";
        toast.error("Erro ao atualizar funcionário", { description: message });
      }
    },
  });

  useEffect(() => {
    if (funcionario) {
      setFormData({
        nome_usuario: funcionario.nome_usuario || "",
        telefone: funcionario.telefone || "",
        email: funcionario.email || "",
        perfil: funcionario.perfil || PERFIS_USUARIO[0].value,
        ativo: funcionario.ativo ?? true,
      });
    }
  }, [funcionario]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatTelefone = (value: string) => {
    // Implementação de formatação de telefone (copiado do fornecedor)
    const telefone = value.replace(/\D/g, "");
    if (telefone.length <= 2) return telefone;
    if (telefone.length <= 6)
      return `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
    if (telefone.length <= 10)
      return `(${telefone.slice(0, 2)}) ${telefone.slice(
        2,
        6
      )}-${telefone.slice(6)}`;
    return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(
      7,
      11
    )}`;
  };

  const save = () => {
    const validationData = {
      nome_usuario: formData.nome_usuario,
      matricula: funcionario?.matricula || "", // Mantém a matrícula original para validação
      telefone: formData.telefone,
      email: formData.email,
      perfil: formData.perfil,
    };

    // Validação usando o schema de atualização (simplificado)
    const result = FuncionarioUpdateSchema.safeParse({
      ...validationData,
      ativo: formData.ativo,
    });

    if (!result.success) {
      // Pega o primeiro erro para exibir
      const firstError = result.error.issues[0];
      const fieldName = String(firstError.path[0]);
      const message = firstError.message;

      toast.warning(`Erro no campo ${fieldName}: ${message}`);
      return;
    }

    // Chama a mutation para atualizar
    updateFuncionario(formData);
  };

  if (!funcionario) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="gap-8 max-w-2xl">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>Editar Funcionário</DialogTitle>
          <DialogDescription>
            Altere as informações do funcionário selecionado
          </DialogDescription>
        </DialogHeader>

        <FieldSet className="max-h-96 overflow-y-auto">
          <FieldGroup>
            <Field>
              <FieldLabel>ID do funcionário</FieldLabel>
              <Input
                readOnly={true}
                className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                value={funcionario._id}
              />
            </Field>

            <Field>
              <FieldLabel>Matrícula</FieldLabel>
              <Input
                readOnly={true}
                className="bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
                value={funcionario.matricula || "-"}
              />
            </Field>

            <Field>
              <FieldLabel>Nome do funcionário*</FieldLabel>
              <Input
                readOnly={false}
                className="bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={formData.nome_usuario}
                onChange={(e) =>
                  handleInputChange("nome_usuario", e.target.value)
                }
                placeholder="Nome completo"
                required
              />
            </Field>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  readOnly={false}
                  className="bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@empresa.com"
                />
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel>Telefone*</FieldLabel>
                <Input
                  readOnly={false}
                  className="bg-white border-gray-300 cursor-text hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.telefone}
                  onChange={(e) => {
                    const formatted = formatTelefone(e.target.value);
                    if (formatted.length <= 15) {
                      handleInputChange("telefone", formatted);
                    }
                  }}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Perfil de Acesso*</FieldLabel>
                <Select
                  value={formData.perfil}
                  onValueChange={(value) =>
                    handleInputChange("perfil", value as PerfilUsuario)
                  }
                >
                  <SelectTrigger className="bg-white border-gray-300 cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERFIS_USUARIO.map((perfil) => (
                      <SelectItem key={perfil.value} value={perfil.value}>
                        {perfil.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Ativo / Inativo</FieldLabel>
              <div className="flex items-center space-x-2 p-2 border rounded-lg bg-gray-50">
                <Switch
                  id="ativo-status"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => handleInputChange("ativo", checked)}
                />
                <label htmlFor="ativo-status" className="text-sm font-medium leading-none cursor-pointer">
                  {formData.ativo ? "Funcionário Ativo" : "Funcionário Inativo"}
                </label>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className="pt-2 border-t">
          <div className="flex flex-row justify-center gap-1">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-1/2 cursor-pointer text-black bg-transparent border hover:bg-neutral-50 flex items-center gap-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={save}
              disabled={isPending}
              className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}