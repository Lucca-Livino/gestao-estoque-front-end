"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/header";

export default function PerfilPage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: "José Silva",
    email: "jose.silva@gmail.com",
    telefone: "(69) 992222-2222",
  });

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)] px-4 py-8">
        <div className="max-w-7xl w-full">
          {/* Single Card with Both Sections */}
          <div className="bg-[#0344DA]/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
            <div className="flex gap-12">
              {/* Left Section - User Profile */}
              <div className="w-1/3 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center space-y-6">
                  {/* Large Avatar */}
                  <div className="relative">
                    <Avatar className="h-48 w-48 border-4 border-white/20 shadow-2xl">
                      <AvatarImage src="/avatar.png" alt="User Avatar" />
                      <AvatarFallback className="text-5xl bg-blue-700 text-white">
                        JS
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* User Name */}
                  <h2 className="text-3xl font-bold text-white text-center">
                    João Silva
                  </h2>

                  {/* User Role */}
                  <p className="text-lg text-white/90 font-medium">
                    Administrador
                  </p>

                  {/* Change Photo Button */}
                  <Button
                    variant="outline"
                    className="mt-4 bg-blue-800/50 hover:bg-blue-700/60 text-white border-white/30 hover:border-white/50 px-8 py-2 rounded-lg transition-all"
                  >
                    Alterar foto
                  </Button>
                </div>
              </div>

              {/* Right Section - Account Information */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white text-center mb-12">
                  Informações da conta
                </h1>

                <div className="space-y-8">
                  {/* Nome Field */}
                  <div>
                    <label htmlFor="nome" className="block text-white text-lg font-medium mb-3">
                      Nome
                    </label>
                    <Input
                      id="nome"
                      type="text"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      disabled={!isEditing}
                      className="bg-white/90 text-gray-800 border-0 rounded-xl h-14 text-base px-6 placeholder:text-gray-400 disabled:opacity-90 disabled:cursor-default"
                      placeholder="José Silva"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-white text-lg font-medium mb-3">
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
                      className="bg-white/90 text-gray-800 border-0 rounded-xl h-14 text-base px-6 placeholder:text-gray-400 disabled:opacity-90 disabled:cursor-default"
                      placeholder="jose.silva@gmail.com"
                    />
                  </div>

                  {/* Telefone Field */}
                  <div>
                    <label htmlFor="telefone" className="block text-white text-lg font-medium mb-3">
                      Telefone
                    </label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData({ ...formData, telefone: e.target.value })
                      }
                      disabled={!isEditing}
                      className="bg-white/90 text-gray-800 border-0 rounded-xl h-14 text-base px-6 placeholder:text-gray-400 disabled:opacity-90 disabled:cursor-default"
                      placeholder="(69) 992222-2222"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-12">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="bg-blue-900/60 hover:bg-blue-800/70 text-white border-white/30 hover:border-white/50 px-10 py-3 rounded-xl text-base font-medium transition-all"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 rounded-xl text-base font-medium shadow-lg transition-all"
                  >
                    Editar
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
