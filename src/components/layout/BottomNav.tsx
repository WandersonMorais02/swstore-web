import { Link, useLocation } from 'react-router-dom'
import { Grid2X2, Heart, Home, ShoppingCart, User } from 'lucide-react'

const items = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/catalogo', label: 'Loja', icon: Grid2X2 },
  { to: '/favoritos', label: 'Favoritos', icon: Heart },
  { to: '/carrinho', label: 'Carrinho', icon: ShoppingCart },
  { to: '/minha-conta', label: 'Conta', icon: User }
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white md:hidden">
      <div className="grid h-16 grid-cols-5">
        {items.map(item => {
          const active = location.pathname === item.to
          const Icon = item.icon

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] ${
                active ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <Icon size={20} fill={active && item.to === '/favoritos' ? 'currentColor' : 'none'} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
