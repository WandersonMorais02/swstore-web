import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, Box, Home, Settings, Truck, Users } from 'lucide-react'

const items = [
  { to: '/admin', label: 'Resumo', icon: Home, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: Box },
  { to: '/admin/sellers', label: 'Sellers', icon: Users },
  { to: '/admin/financeiro', label: 'Financeiro', icon: BarChart3 },
  { to: '/admin/fretes-locais', label: 'Fretes locais', icon: Truck },
  { to: '/admin/configuracoes', label: 'Configurações', icon: Settings }
]

export function AdminLayout() {
  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">
          Painel administrativo
        </h1>
        <p className="text-sm text-slate-500">
          Gerencie sellers, produtos, aprovações e financeiro.
        </p>
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
                  `flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-xs font-black ${
                    isActive
                      ? 'bg-slate-950 text-white'
                      : 'bg-white text-slate-500 shadow-sm'
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
