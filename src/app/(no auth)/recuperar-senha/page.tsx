'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, LoaderIcon } from 'lucide-react';
import Link from 'next/link';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recuperar-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('Erro de conexão. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col relative overflow-hidden">

      <div
        className="absolute w-[2500px] h-[2500px] pointer-events-none"
        style={{
          right: '-400.05px',
          top: '-251.77px',
          transform: 'rotate(15deg)',
          transformOrigin: 'center',
        }}
      >
        <div className="w-full h-full bg-linear-to-br from-[#2563eb] to-[#1d4ed8] rounded-tl-full"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 relative z-10">

        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold">Gestão de Estoque</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">

              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
                Recuperar Senha
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Enviaremos um link para redefinir sua senha
              </p>
             
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-green-800 mb-1">Email enviado!</h3>
                    <p className="text-sm text-green-700">
                      Se existir uma conta com este email, você receberá instruções para redefinir sua senha.
                    </p>
                  </div>
                </div>
              )}
             
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {!success && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-0 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#0042D9] focus:bg-white outline-none transition-all"
                      placeholder="seu@email.com"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0042D9] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#0042D9]/90 focus:ring-2 focus:ring-[#0042D9] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                  </button>
                </form>
              )}

              {success && (
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full bg-[#0042D9] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#0042D9]/90 transition-all shadow-lg"
                  >
                    Ir para o Login
                  </button>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setError('');
                    }}
                    className="w-full bg-white text-[#0042D9] py-3 px-4 rounded-xl font-medium border-2 border-[#0042D9] hover:bg-blue-50 transition-all"
                  >
                    Enviar para outro email
                  </button>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#0042D9] transition-colors"
                >
                  <ArrowLeft size={16} />
                  Voltar para o login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
