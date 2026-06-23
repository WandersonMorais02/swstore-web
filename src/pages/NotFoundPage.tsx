import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Home,
  Search,
  ShoppingBag
} from 'lucide-react'

export function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-sky-50 text-sky-600">
          <ShoppingBag size={42} />
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-sky-600">
          Erro 404
        </p>

        <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-6xl">
          Página não encontrada
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500">
          A página que você tentou acessar não existe, foi removida
          ou o endereço informado está incorreto.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-4 text-sm font-black text-white transition hover:bg-sky-700"
          >
            <Home size={18} />
            Voltar ao início
          </Link>

          <Link
            to="/catalogo"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-900 transition hover:bg-slate-50"
          >
            <Search size={18} />
            Explorar catálogo
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-900 transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="font-black text-slate-950">
            Talvez você esteja procurando:
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Link
              to="/catalogo"
              className="rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-slate-100"
            >
              <p className="font-black text-slate-950">
                Catálogo
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Todos os produtos disponíveis
              </p>
            </Link>

            <Link
              to="/favoritos"
              className="rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-slate-100"
            >
              <p className="font-black text-slate-950">
                Favoritos
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Seus produtos salvos
              </p>
            </Link>

            <Link
              to="/minha-conta"
              className="rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-slate-100"
            >
              <p className="font-black text-slate-950">
                Minha conta
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Pedidos e downloads
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
