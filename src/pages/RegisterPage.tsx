import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useRegister } from '../features/auth/auth.hooks'

export function RegisterPage() {
  const registerMutation = useRegister()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    registerMutation.mutate({
      name,
      email,
      password
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-sm"
      >
        <h1 className="text-2xl font-black text-slate-950">Criar conta</h1>
        <p className="mt-1 text-sm text-slate-500">
          Crie sua conta para comprar produtos digitais e físicos.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Nome</span>
            <input
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              value={name}
              onChange={event => setName(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Senha</span>
            <input
              type="password"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
            />
          </label>
        </div>

        {registerMutation.isError && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            Não foi possível criar sua conta.
          </p>
        )}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="mt-6 w-full rounded-2xl bg-indigo-600 px-4 py-3 font-bold text-white disabled:opacity-60"
        >
          {registerMutation.isPending ? 'Criando...' : 'Criar conta'}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Já tem conta?{' '}
          <Link to="/login" className="font-bold text-indigo-600">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  )
}
