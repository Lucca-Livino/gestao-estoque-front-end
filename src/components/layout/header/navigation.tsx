"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAllowedRoutes, type RouteKey } from "@/lib/permissions";
import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navigation() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { data: session } = useSession();
  const { fotoPerfil, dadosUsuario } = useUserProfile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const allItems: Array<{ label: string; href: string; key: RouteKey }> = [
    { label: "Produtos", href: "/produtos", key: "produtos" },
    { label: "Movimentações", href: "/movimentacoes", key: "movimentacoes" },
    { label: "Fornecedores", href: "/fornecedores", key: "fornecedores" },
    { label: "Funcionários", href: "/funcionarios", key: "funcionarios" },
  ];

  const allowedRoutes = getAllowedRoutes(session?.user?.perfil);
  const items = allItems.filter((item) => allowedRoutes.includes(item.key));

  const userName: string = dadosUsuario?.nome_usuario || session?.user?.nome_usuario || "Usuário";
  
  const userAbbreviation: string = userName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleEditProfile = () => {
    setIsMenuOpen(false);
    router.push("/perfil");
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    router.push("/logout");
  };

  return (
    <nav>
      {/* Menu Desktop - oculto em telas menores que 600px */}
      <ul className="hidden sm:flex items-center space-x-4">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-white hover:bg-blue-700/80"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Botão Hambúrguer - visível apenas em telas menores que 600px */}
      <button
        className="sm:hidden text-white p-2 hover:bg-blue-700/80 rounded-md"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menu Mobile - dropdown com z-index alto para sobrepor */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-[72px] left-0 right-0 bg-blue-600 shadow-lg z-[9999]">
          <ul className="flex flex-col">
            {items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href} className="border-b border-blue-500/30">
                  <Link
                    href={item.href}
                    className={`block px-6 py-4 text-sm font-medium ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-white hover:bg-blue-700/80"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            
            {/* Seção de Perfil no final do menu */}
            <li className="border-t-2 border-blue-500/50 mt-2">
              <div className="px-6 py-4 flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={fotoPerfil || "/foto-perfil.jpeg"} alt="User Avatar" />
                  <AvatarFallback className="text-blue-700">{userAbbreviation}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-blue-200">{session?.user?.perfil || "Usuário"}</p>
                </div>
              </div>
            </li>
            <li className="border-t border-blue-500/30">
              <button
                onClick={handleEditProfile}
                className="w-full text-left px-6 py-4 text-sm font-medium text-white hover:bg-blue-700/80 flex items-center space-x-2"
              >
                <User size={18} />
                <span>Editar perfil</span>
              </button>
            </li>
            <li className="border-t border-blue-500/30">
              <button
                onClick={handleLogout}
                className="w-full text-left px-6 py-4 text-sm font-medium text-white hover:bg-blue-700/80 flex items-center space-x-2"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
