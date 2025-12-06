"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/header";

export default function PerfilPage() {
  const { data: session } = useSession();
  const { fotoPerfil, atualizarFotoPerfil, dadosUsuario, atualizarDadosUsuario } = useUserProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingPhoto, UpandoFoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const usuario = session?.user;
  const matricula = usuario?.matricula || "";
  const perfilUsuario = usuario?.perfil || "";

  const nomeUsuario = dadosUsuario?.nome_usuario || usuario?.nome_usuario || "Usuário";
  const emailUsuario = dadosUsuario?.email || usuario?.email || "";
  const telefoneUsuario = dadosUsuario?.telefone || usuario?.telefone || "";

  const [formData, setFormData] = useState({
    nome_usuario: nomeUsuario,
    email: emailUsuario,
    telefone: telefoneUsuario,
  });

  useEffect(() => {
    setFormData({
      nome_usuario: nomeUsuario,
      email: emailUsuario,
      telefone: telefoneUsuario,
    });
  }, [nomeUsuario, emailUsuario, telefoneUsuario]);

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nome_usuario: dadosUsuario?.nome_usuario || nomeUsuario,
      email: dadosUsuario?.email || emailUsuario,
      telefone: dadosUsuario?.telefone || telefoneUsuario,
    });
  };

  const handleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!formData.nome_usuario || formData.nome_usuario.trim().length < 3) {
        alert("Nome deve ter pelo menos 3 caracteres");
        return;
      }

      if (!formData.email || !formData.email.includes("@")) {
        alert("Email inválido");
        return;
      }

      const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      if (!formData.telefone || !telefoneRegex.test(formData.telefone)) {
        alert("Telefone deve estar no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX");
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${API_URL}/usuarios/${matricula}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usuario?.accesstoken}`,
        },
        body: JSON.stringify({
          nome_usuario: formData.nome_usuario,
          email: formData.email,
          telefone: formData.telefone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Erro ao atualizar perfil');
      }

      const novosDados = {
        nome_usuario: formData.nome_usuario,
        email: formData.email,
        telefone: formData.telefone,
      };
      
      atualizarDadosUsuario(novosDados);

      alert("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      alert(error.message || "Erro ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const TiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!TiposPermitidos.includes(file.type)) {
      alert("Formato de arquivo não suportado. Use apenas: JPEG, PNG, GIF ou WEBP");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("O arquivo deve ter no máximo 5MB");
      return;
    }

    try {
      UpandoFoto(true);

      const formData = new FormData();
      formData.append('foto', file);

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${API_URL}/usuarios/${matricula}/foto-perfil`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${usuario?.accesstoken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Erro ao fazer upload da foto');
      }

      const novaFotoUrl = `${API_URL}${result.data.foto_perfil}`;
      atualizarFotoPerfil(novaFotoUrl);

      alert("Foto de perfil atualizada com sucesso!");
    } catch (error: any) {
      console.error('Erro no upload:', error);
      alert(error.message || "Erro ao fazer upload da foto");
    } finally {
      UpandoFoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)] px-4 py-4 sm:py-8">
        <div className="max-w-7xl w-full">
          <div className="bg-[#0344DA]/90 backdrop-blur-sm rounded-xl sm:rounded-3xl p-4 sm:p-8 md:p-12 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
              <div className="w-full lg:w-1/3 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center space-y-4 sm:space-y-6 w-full">
                  <div className="relative flex justify-center w-full">
                    <Avatar className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 border-4 border-white/20 shadow-2xl">
                      <AvatarImage 
                        src={fotoPerfil || "/foto-perfil.jpeg"} 
                        alt="User Avatar" 
                      />
                      <AvatarFallback className="text-3xl sm:text-4xl lg:text-5xl bg-blue-700 text-white">
                        {nomeUsuario.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center">
                    {nomeUsuario}
                  </h2>

                  <p className="text-base sm:text-lg text-white/90 font-medium">
                    {perfilUsuario.charAt(0).toUpperCase() + perfilUsuario.slice(1)}
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  <div className="flex justify-center w-full">
                    <Button
                      onClick={handlePhotoButtonClick}
                      disabled={isUploadingPhoto}
                      variant="outline"
                      className="mt-2 sm:mt-4 bg-blue-800/50 hover:bg-blue-700/60 text-white border-white/30 hover:border-white/50 px-6 sm:px-8 py-2 rounded-lg text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploadingPhoto ? "Enviando..." : "Alterar foto"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-6 sm:mb-8 lg:mb-12">
                  Informações da conta
                </h1>

                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <div>
                    <label htmlFor="nome_usuario" className="block text-white text-sm sm:text-base lg:text-lg font-medium mb-2 sm:mb-3">
                      Nome
                    </label>
                    <Input
                      id="nome_usuario"
                      type="text"
                      value={formData.nome_usuario}
                      onChange={(e) =>
                        setFormData({ ...formData, nome_usuario: e.target.value })
                      }
                      disabled={!isEditing}
                      className="bg-white/90 text-gray-800 border-0 rounded-xl h-14 text-base px-6 placeholder:text-gray-400 disabled:opacity-90 disabled:cursor-default"
                      placeholder="José Silva"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white text-sm sm:text-base lg:text-lg font-medium mb-2 sm:mb-3">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!isEditing}
                      className="bg-white/90 text-gray-800 border-0 rounded-lg sm:rounded-xl h-12 sm:h-14 text-sm sm:text-base px-4 sm:px-6 placeholder:text-gray-400 disabled:opacity-90 disabled:cursor-default"
                      placeholder="jose.silva@gmail.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefone" className="block text-white text-sm sm:text-base lg:text-lg font-medium mb-2 sm:mb-3">
                      Telefone
                    </label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        let formattedValue = '';
                        
                        if (value.length > 0) {
                          formattedValue = '(' + value.substring(0, 2);
                        }
                        if (value.length >= 3) {
                          formattedValue += ') ' + value.substring(2, 7);
                        }
                        if (value.length >= 7) {
                          formattedValue += '-' + value.substring(7, 11);
                        }
                        
                        setFormData({ ...formData, telefone: formattedValue });
                      }}
                      disabled={!isEditing}
                      maxLength={15}
                      className="bg-white/90 text-gray-800 border-0 rounded-lg sm:rounded-xl h-12 sm:h-14 text-sm sm:text-base px-4 sm:px-6 placeholder:text-gray-400 disabled:opacity-90 disabled:cursor-default"
                      placeholder="(69) 99999-9999"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 lg:mt-12">
                  {isEditing && (
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={isSaving}
                      className="bg-blue-900/60 hover:bg-blue-800/70 text-white border-white/30 hover:border-white/50 px-6 sm:px-10 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button
                    onClick={handleEdit}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 sm:px-10 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Salvando..." : isEditing ? "Salvar" : "Editar"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
