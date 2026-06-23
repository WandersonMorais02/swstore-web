import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import { useLogin } from '../features/auth/auth.hooks'

type LocationState = {
  from?: string
}

export function LoginPage() {
  const loginMutation = useLogin()
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as LocationState | null
  const from = state?.from || '/minha-conta'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    loginMutation.mutate(
      {
        email,
        password
      },
      {
        onSuccess: () => {
          navigate(from, { replace: true })
        }
      }
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-[2rem] bg-white p-6 shadow-sm"
        >
          <h1 className="text-2xl font-black text-slate-950">Entrar</h1>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Acesse sua conta para comprar, baixar e acompanhar pedidos.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">
                Email
              </span>

              <input
                type="email"
                autoComplete="email"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">
                Senha
              </span>

              <input
                type="password"
                autoComplete="current-password"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                value={password}
                onChange={event => setPassword(event.target.value)}
                required
              />
            </label>
          </div>

          {loginMutation.isError && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              Não foi possível entrar. Confira seu email e senha.
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-6 w-full rounded-2xl bg-indigo-600 px-4 py-3 font-black text-white disabled:opacity-60"
          >
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            Ainda não tem conta?{' '}
            <Link to="/cadastro" className="font-black text-indigo-600">
              Criar conta
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
