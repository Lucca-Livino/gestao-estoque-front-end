import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { BotaoCadastrar } from "@/components/ui/cadastrarButton";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { fetchData } from "@/services/api";
import {
  FuncionarioCreateSchema,
  type FuncionarioCreateInput,
} from "@/schemas/funcionarios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERFIS_USUARIO, PerfilUsuario } from "@/types/Funcionarios";

interface CadastroFuncionarioProps {
  color: "green" | "blue";
  size: "1/8" | "1/2";
  onTrigger?: () => void;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
}

export default function FuncionarioCadastro({
  color,
  size,
  onTrigger,
  open: controlledOpen,
  onOpenChange,
}: CadastroFuncionarioProps) {
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const isControlled = controlledOpen !== undefined;
  const dialogOpen = isControlled ? controlledOpen : internalOpen;

  const [formData, setFormData] = useState<
    Omit<FuncionarioCreateInput, "ativo">
  >({
    nome_usuario: "",
    matricula: "",
    telefone: "",
    email: "",
    perfil: PERFIS_USUARIO[0].value, // Define o primeiro perfil como default
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearFieldError = (fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const clearServerErrors = () => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      // Lógica de limpeza de erros do servidor para duplicidade
      if (
        newErrors.matricula &&
        (newErrors.matricula.includes("já está cadastrada") ||
          newErrors.matricula.includes("já cadastrada"))
      ) {
        delete newErrors.matricula;
      }
      if (
        newErrors.email &&
        (newErrors.email.includes("já está cadastrado") ||
          newErrors.email.includes("já cadastrado"))
      ) {
        delete newErrors.email;
      }
      return newErrors;
    });
  };

  const formatarTelefone = (value: string) => {
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

  const queryClient = useQueryClient();
  const { mutate: createFuncionario, isPending } = useMutation({
    mutationFn: async (payload: FuncionarioCreateInput) => {
      const body = {
        nome_usuario: payload.nome_usuario,
        matricula: payload.matricula,
        telefone: payload.telefone,
        email: payload.email,
        perfil: payload.perfil,
        ativo: true,
        // Senha inicial (pode ser enviada ou definida no backend, 
        // mas é mantida aqui como opcional no payload seguindo o padrão de cadastro simples)
        // senha: payload.senha || "senha123", 
      };

      return await fetchData<any>("/funcionarios", "POST", undefined, body);
    },
    onSuccess: () => {
      toast.success("Funcionário cadastrado com sucesso!", {
        description: "O novo funcionário foi salvo no sistema.",
      });

      queryClient.invalidateQueries({ queryKey: ["listaFuncionarios"] });
      handleOpenChange(false);
      setFormData({
        nome_usuario: "",
        matricula: "",
        telefone: "",
        email: "",
        perfil: PERFIS_USUARIO[0].value,
      });
      setErrors({});
    },
    onError: (error: any) => {
      const errorData = error?.response?.data || error?.data || error;
      console.log(errorData);
      const errorMessage =
        errorData?.customMessage ||
        errorData?.message ||
        error?.message ||
        error?.toString() ||
        "";
      const lowerMessage = errorMessage.toLowerCase();

      if (
        lowerMessage.includes("matricula") ||
        (lowerMessage.includes("email") &&
          (lowerMessage.includes("duplicado") ||
            lowerMessage.includes("já está cadastrado") ||
            lowerMessage.includes("unique")))
      ) {
        toast.error(`Campo duplicado`, {
          description: `${errorMessage}`,
        });
      } else {
        const message = errorMessage || "Falha ao cadastrar funcionário";
        toast.error("Erro ao cadastrar funcionário", { description: message });
      }
    },
  });

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  const save = () => {
    // Adiciona o campo de perfil no objeto de validação
    const validationData = { ...formData };
    
    const result = FuncionarioCreateSchema.safeParse(validationData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.warning("Verifique os campos obrigatórios");
      return;
    }

    setErrors({});
    createFuncionario(result.data);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <BotaoCadastrar
          onClick={() => { onTrigger?.(); }}
          color={color}
          size={size}
        />
      </DialogTrigger>

      <DialogContent showCloseButton={false} className="gap-8">
        <DialogHeader className="flex flex-col gap-4 py-2 border-b">
          <DialogTitle>Cadastro de Funcionário</DialogTitle>
          <DialogDescription>
            Formulário para o cadastro de novos funcionários
          </DialogDescription>
        </DialogHeader>

        <FieldSet className="max-h-96 overflow-y-auto">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nome_usuario">Nome do funcionário*</FieldLabel>
              <div className="flex flex-col">
                <Input
                  id="nome_usuario"
                  autoComplete="off"
                  placeholder="João da Silva"
                  value={formData.nome_usuario}
                  onChange={(e) => {
                    setFormData((s) => ({
                      ...s,
                      nome_usuario: e.target.value,
                    }));
                    clearFieldError("nome_usuario");
                  }}
                />
                {errors.nome_usuario && (
                  <FieldError className="text-xs ml-1 mt-1">
                    {errors.nome_usuario}
                  </FieldError>
                )}
              </div>
            </Field>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="matricula">Matrícula*</FieldLabel>
                <div className="flex flex-col">
                  <Input
                    id="matricula"
                    autoComplete="off"
                    placeholder="2024001"
                    value={formData.matricula}
                    onChange={(e) => {
                      setFormData((s) => ({ ...s, matricula: e.target.value }));
                      clearFieldError("matricula");
                      clearServerErrors();
                    }}
                  />
                  {errors.matricula && (
                    <FieldError className="text-xs ml-1 mt-1">
                      {errors.matricula}
                    </FieldError>
                  )}
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="telefone">Telefone*</FieldLabel>
                <div className="flex flex-col">
                  <Input
                    id="telefone"
                    autoComplete="off"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => {
                      const valorFormatado = formatarTelefone(e.target.value);
                      setFormData((s) => ({ ...s, telefone: valorFormatado }));
                      clearFieldError("telefone");
                    }}
                  />
                  {errors.telefone && (
                    <FieldError className="text-xs ml-1 mt-1">
                      {errors.telefone}
                    </FieldError>
                  )}
                </div>
              </Field>
            </div>

            <div className="flex flex-row gap-1">
              <Field>
                <FieldLabel htmlFor="email">Email*</FieldLabel>
                <div className="flex flex-col">
                  <Input
                    id="email"
                    autoComplete="off"
                    placeholder="joao.silva@empresa.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((s) => ({ ...s, email: e.target.value }));
                      clearFieldError("email");
                      clearServerErrors(); // Limpa erros de duplicação
                    }}
                  />
                  {errors.email && (
                    <FieldError className="text-xs ml-1 mt-1">
                      {errors.email}
                    </FieldError>
                  )}
                </div>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="perfil">Perfil de Acesso*</FieldLabel>
              <div className="flex flex-col">
                <Select
                  value={formData.perfil}
                  onValueChange={(value) =>
                    setFormData((s) => ({
                      ...s,
                      perfil: value as PerfilUsuario,
                    }))
                  }
                >
                  <SelectTrigger>
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
                {errors.perfil && (
                  <FieldError className="text-xs ml-1 mt-1">
                    {errors.perfil}
                  </FieldError>
                )}
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
        <div className="pt-2 border-t">
          <div className="flex flex-row justify-center gap-1">
            <Button
              onClick={() => handleOpenChange(false)}
              className="w-1/2 cursor-pointer text-black bg-transparent border hover:bg-neutral-50"
              data-slot="dialog-close"
            >
              Cancelar
            </Button>
            <Button
              onClick={save}
              disabled={isPending}
              className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
            >
              <Save className="w-4 h-4 mr-1" />{" "}
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}