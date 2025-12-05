"use client";

import { Package, FileText } from "lucide-react";
import {
  StatCard as StatCardType,
  ModuleCard as ModuleCardType,
} from "@/types/Dashboard";
import { getAllowedRoutes } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { fetchData } from "@/services/api";
import { Movimentacao } from "@/types/Movimentacao";

export default function DashboardNavigation() {
  const { data: session } = useSession();
  const userRole = session?.user?.perfil;
  const allowedRoutes = getAllowedRoutes(userRole);
  const [totalSaidas, setTotalSaidas] = useState("R$ 0,00");

  useEffect(() => {
    const calcularTotalSaidas = async () => {
      try {
        const token = session?.user?.accesstoken;
        if (!token) return;

        const response = await fetchData<{ 
          data?: { docs: Movimentacao[] };
          docs?: Movimentacao[];
        }>(
          "/movimentacoes?tipo=saida",
          "GET",
          token
        );

        const movimentacoes = response.data?.docs || response.docs || [];
        
        const total = movimentacoes.reduce((acc, mov) => {
          if (mov.tipo === "saida") {
            const totalMovimentacao = mov.produtos.reduce(
              (sum, produto) => sum + (produto.preco * produto.quantidade_produtos),
              0
            );
            return acc + totalMovimentacao;
          }
          return acc;
        }, 0);

        setTotalSaidas(
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(total)
        );
      } catch (error) {
        console.error("Erro ao calcular total de saídas:", error);
        setTotalSaidas("R$ 0,00");
      }
    };

    if (session?.user?.accesstoken) {
      calcularTotalSaidas();
    }
  }, [session]);

  const statCards: StatCardType[] = [
    {
      id: "categoria-a",
      title: "Categoria",
      value: "A",
      icon: Package,
    },
    {
      id: "categoria-b",
      title: "Categoria",
      value: "B",
      icon: Package,
    },
    {
      id: "categoria-c",
      title: "Categoria",
      value: "C",
      icon: Package,
    },
    {
      id: "saidas",
      title: "Saídas",
      value: totalSaidas,
      icon: FileText,
    },
  ];

  const moduleCards: ModuleCardType[] = [
    {
      id: "produtos",
      title: "Produtos",
      description: "Cadastre e gerencie seus produtos",
      iconSrc: "/produtos_icon.png",
      iconAlt: "Produtos",
      href: "/produtos",
    },
    {
      id: "fornecedores",
      title: "Fornecedores",
      description: "Acesse o cadastro de fornecedores",
      iconSrc: "/fornecedores_icon.png",
      iconAlt: "Fornecedores",
      href: "/fornecedores",
    },
    {
      id: "movimentacoes",
      title: "Movimentações",
      description: "Gerencie suas movimentações",
      iconSrc: "/movimentacoes_icon.png",
      iconAlt: "Movimentações",
      href: "/movimentacoes",
    },
    {
      id: "funcionarios",
      title: "Funcionários",
      description: "Acesse o cadastro de funcionários",
      iconSrc: "/funcionarios_icon.png",
      iconAlt: "Funcionários",
      href: "/funcionarios",
    },
  ];

  const filteredModuleCards = moduleCards.filter((card) => {
    if (!card.href) return false;
    const routeKey = card.href.replace("/", "");
    return allowedRoutes.includes(routeKey as any);
  });

  return {
    statCards,
    moduleCards: filteredModuleCards,
  };
}
