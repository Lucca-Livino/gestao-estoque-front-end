"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface UserData {
  nome_usuario: string;
  email: string;
  telefone: string;
}

interface UserProfileContextType {
  fotoPerfil: string | null;
  atualizarFotoPerfil: (novaFoto: string) => void;
  carregarFotoPerfil: () => Promise<void>;
  dadosUsuario: UserData | null;
  atualizarDadosUsuario: (novosDados: UserData) => void;
  carregarDadosUsuario: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [dadosUsuario, setDadosUsuario] = useState<UserData | null>(null);
  
  const usuario = session?.user;
  const matricula = usuario?.matricula || "";
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const carregarFotoPerfil = async () => {
    if (!matricula || !usuario?.accesstoken) return;

    try {
      const response = await fetch(`${API_URL}/usuarios/${matricula}`, {
        headers: {
          Authorization: `Bearer ${usuario.accesstoken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data?.foto_perfil) {
          const fotoUrl = `${API_URL}${result.data.foto_perfil}`;
          setFotoPerfil(fotoUrl);
          // Salvar no localStorage para persistência
          localStorage.setItem(`foto_perfil_${matricula}`, fotoUrl);
        } else {
          // Se não houver foto, remover do localStorage
          localStorage.removeItem(`foto_perfil_${matricula}`);
          setFotoPerfil(null);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar foto de perfil:", error);
    }
  };

  const atualizarFotoPerfil = (novaFoto: string) => {
    setFotoPerfil(novaFoto);
    if (matricula) {
      localStorage.setItem(`foto_perfil_${matricula}`, novaFoto);
    }
  };

  const carregarDadosUsuario = async () => {
    if (!matricula || !usuario?.accesstoken) return;

    try {
      const response = await fetch(`${API_URL}/usuarios/${matricula}`, {
        headers: {
          Authorization: `Bearer ${usuario.accesstoken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const dados: UserData = {
          nome_usuario: result.data.nome_usuario,
          email: result.data.email,
          telefone: result.data.telefone || '',
        };
        setDadosUsuario(dados);
        // Salvar no localStorage para persistência
        localStorage.setItem(`dados_usuario_${matricula}`, JSON.stringify(dados));
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  const atualizarDadosUsuario = (novosDados: UserData) => {
    setDadosUsuario(novosDados);
    if (matricula) {
      localStorage.setItem(`dados_usuario_${matricula}`, JSON.stringify(novosDados));
    }
  };

  // Carregar foto e dados ao montar o componente
  useEffect(() => {
    if (matricula) {
      // Primeiro, tenta carregar do localStorage
      const fotoCache = localStorage.getItem(`foto_perfil_${matricula}`);
      if (fotoCache) {
        setFotoPerfil(fotoCache);
      }
      
      const dadosCache = localStorage.getItem(`dados_usuario_${matricula}`);
      if (dadosCache) {
        try {
          setDadosUsuario(JSON.parse(dadosCache));
        } catch (error) {
          console.error("Erro ao parsear dados do cache:", error);
        }
      }
      
      // Depois busca do servidor
      carregarFotoPerfil();
      carregarDadosUsuario();
    }
  }, [matricula, usuario?.accesstoken]);

  return (
    <UserProfileContext.Provider value={{ 
      fotoPerfil, 
      atualizarFotoPerfil, 
      carregarFotoPerfil,
      dadosUsuario,
      atualizarDadosUsuario,
      carregarDadosUsuario
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile deve ser usado dentro de um UserProfileProvider");
  }
  return context;
}
