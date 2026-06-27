import { NavLink, Outlet } from 'react-router-dom'
import {
  Bell,
  Download,
  Home,
  LogOut,
  MapPin,
  Package,
  Settings,
  User
} from 'lucide-react'

import { useAuthStore } from '../../stores/auth.store'
import { useLogout } from '../../features/auth/auth.hooks'
import { assetUrl } from '../../utils/assets'

const items = [
  { to: '/minha-conta', label: 'Resumo', icon: Home, end: true },
  { to: '/minha-conta/pedidos', label: 'Pedidos', icon: Package },
  { to: '/minha-conta/downloads', label: 'Downloads', icon: Download },
  { to: '/favoritos', label: 'Favoritos', icon: User },
  { to: '/minha-conta/enderecos', label: 'Endereços', icon: MapPin },
  { to: '/minha-conta/notificacoes', label: 'Avisos', icon: Bell },
  { to: '/minha-conta/configuracoes', label: 'Configurações', icon: Settings }
]

export function AccountLayout() {
  const user = useAuthStore(state => state.user)
  const logoutMutation = useLogout()

  const avatarUrl = user?.avatar?.url
    ? assetUrl(user.avatar.url)
    : null

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-sky-50 text-sky-600">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.name || 'Usuário'}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={30} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-black text-slate-950">
              {user?.name}
            </h1>

            <p className="truncate text-sm text-slate-500">
              {user?.email}
            </p>

            <span className="mt-2 inline-flex rounded-full bg-sky-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-sky-700">
              {user?.role}
            </span>
          </div>

          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="rounded-full bg-slate-100 p-3 text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
          >
            <LogOut size={20} />
          </button>
        </div>
      </section>

      <section className="-mx-4 overflow-x-auto px-4">
        <div className="flex gap-2 pb-2">
          {items.map(item => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-xs font-black transition ${
                    isActive
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-slate-500 shadow-sm hover:bg-sky-50'
                  }`
                }
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            )
          })}
        </div>
      </section>

      <Outlet />
    </div>
  )
}
