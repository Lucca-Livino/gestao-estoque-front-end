"use client";

import { StatCard as StatCardType } from "@/types/Dashboard";
import { useRouter } from "next/navigation";

interface StatCardProps {
  card: StatCardType;
}

export default function StatCard({ card }: StatCardProps) {
  const { id, title, value, icon: Icon } = card;
  const router = useRouter();
  
  // Ajusta o tamanho da fonte baseado no comprimento do valor
  const getValueSize = (value: string) => {
    if (value.includes('R$')) return 'text-2xl';
    return 'text-4xl';
  };

  const handleClick = () => {
    // Redirecionamento baseado no id do card
    if (id === "categoria-a") {
      router.push("/categoria_A");
    } else if (id === "categoria-b") {
      router.push("/categoria_B");
    } else if (id === "categoria-c") {
      router.push("/categoria_C");
    }
    // Adicione mais redirecionamentos conforme necessário
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl p-8 text-blue-900 min-h-[120px] flex items-center cursor-pointer hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] transition-all duration-200 transform hover:scale-105 shadow-[0_0_15px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center space-x-4 w-full">
        <Icon className="w-12 h-12" />
        <div>
          <h3 className="text-xl font-medium">{title}</h3>
          <p className={`${getValueSize(value)} font-bold`}>{value}</p>
        </div>
      </div>
    </div>
  );
}