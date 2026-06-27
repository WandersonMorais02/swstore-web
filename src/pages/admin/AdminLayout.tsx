import { NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3,
  Box,
  Crown,
  Home,
  Settings,
  TicketPercent,
  Truck,
  User,
  Users
} from 'lucide-react'

import { useAuthStore } from '../../stores/auth.store'
import { assetUrl } from '../../utils/assets'

const items = [
  { to: '/admin', label: 'Resumo', icon: Home, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: Box },
  { to: '/admin/sellers', label: 'Sellers', icon: Users },
  { to: '/admin/usuarios', label: 'Usuários', icon: Users },
  { to: '/admin/financeiro', label: 'Financeiro', icon: BarChart3 },
  { to: '/admin/fretes-locais', label: 'Fretes locais', icon: Truck },
  { to: '/admin/coupons', label: 'Cupons', icon: TicketPercent },
  { to: '/admin/configuracoes', label: 'Configurações', icon: Settings }
]

export function AdminLayout() {
  const user = useAuthStore(state => state.user)

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
                alt={user?.name || 'Administrador'}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={30} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-black text-slate-950">
              Painel Administrativo
            </h1>

            <p className="truncate text-sm text-slate-500">
              {user?.name}
            </p>

            <p className="truncate text-xs text-slate-400">
              {user?.email}
            </p>

            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white">
              <Crown size={12} />
              Administrador
            </span>
          </div>
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
                      ? 'bg-slate-950 text-white'
                      : 'bg-white text-slate-500 shadow-sm hover:bg-slate-50'
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
