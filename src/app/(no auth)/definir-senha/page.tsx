'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PasswordInput } from '@/components/ui/PasswordInput';

function DefinirSenhaContent() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [codigoValido, setCodigoValido] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const codigo = searchParams.get('codigo');
  
  useEffect(() => {
    if (!codigo) {
      setError('Código não fornecido na URL');
      setValidating(false);
      return;
    }
    
    if (!/^\d{6}$/.test(codigo)) {
      setError('Código inválido. Deve ter 6 dígitos.');
      setValidating(false);
      return;
    }

    setCodigoValido(true);
    setValidating(false);
  }, [codigo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo) {
      setError('Código não encontrado');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (novaSenha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redefinir-senha/codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo: codigo,
          senha: novaSenha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.message || 'Erro ao definir senha');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  if (validating) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Validando código...</p>
        </div>
      </div>
    );
  }
  
  if (!codigoValido) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Código Inválido</h1>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-all"
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Bem-vindo(a)!
            </h1>
            <p className="text-gray-600">
              Defina sua senha para ativar sua conta e começar a usar o sistema.
            </p>
          </div>

          {/* Mensagem de sucesso */}
          {success && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Senha definida com sucesso!</h3>
                <p className="text-sm text-blue-700">Redirecionando para o login...</p>
              </div>
            </div>
          )}

          {/* Mensagem de erro */}
          {error && !success && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Formulário */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-sm text-blue-800">
                  <strong>Código de Ativação:</strong>{' '}
                  <span className="text-lg font-mono font-bold">{codigo}</span>
                </p>
              </div>

              <PasswordInput
                id="novaSenha"
                label="Nova Senha"
                value={novaSenha}
                onChange={setNovaSenha}
                placeholder="Digite sua nova senha"
                required
                disabled={loading}
                showStrength
              />

              <PasswordInput
                id="confirmarSenha"
                label="Confirmar Senha"
                value={confirmarSenha}
                onChange={setConfirmarSenha}
                placeholder="Digite sua senha novamente"
                required
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Definindo senha...' : 'Ativar Minha Conta'}
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Após definir sua senha, você poderá fazer login no sistema.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <DefinirSenhaContent />
    </Suspense>
  );
}
