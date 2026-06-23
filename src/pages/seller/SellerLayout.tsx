import { NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3,
  Box,
  CreditCard,
  Home,
  Package,
  Settings
} from 'lucide-react'

const items = [
  { to: '/seller', label: 'Resumo', icon: Home, end: true },
  { to: '/seller/produtos', label: 'Produtos', icon: Box },
  { to: '/seller/pedidos', label: 'Pedidos', icon: Package },
  { to: '/seller/financeiro', label: 'Financeiro', icon: CreditCard },
  { to: '/seller/metricas', label: 'Métricas', icon: BarChart3 },
  { to: '/seller/configuracoes', label: 'Configurações', icon: Settings },
]

export function SellerLayout() {
  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">
          Painel do vendedor
        </h1>
        <p className="text-sm text-slate-500">
          Gerencie produtos, vendas e repasses.
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
                      ? 'bg-sky-600 text-white'
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
