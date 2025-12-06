import { Button } from "@/components/ui/button";
import { PackagePlus } from "lucide-react";

interface BotaoCadastrarProps {
  onClick: () => void;
  color?: "green" | "blue";
  size?: "1/2" | "1/8";
}

export function BotaoCadastrar({
  onClick,
  color = "green",
  size = "1/2",
}: BotaoCadastrarProps) {
  const colorClasses =
    color === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700";

  const sizeClasses = size === "1/2" ? "sm:w-1/2" : "sm:w-auto sm:px-6";

  return (
    <Button
      className={`cursor-pointer text-white ${colorClasses} w-full ${sizeClasses}`}
      onClick={onClick}
      data-test="btn-abrir-cadastro"
    >
      <PackagePlus className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-1" />
      <span className="sm:inline">Cadastrar</span>
    </Button>
  );
}
