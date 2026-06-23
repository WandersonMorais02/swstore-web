import { Link, NavLink } from 'react-router-dom'
import { Bell, Heart, Search, ShoppingCart, User } from 'lucide-react'
import { InstallPWAButton } from '../pwa/InstallPWAButton'

const navItems = [
  { to: '/', label: 'Início' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/minha-conta', label: 'Minha conta' }
]

export function Header() {
  return (
    <>
    <InstallPWAButton />
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-sky-50/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-black tracking-tight text-slate-950">
          SW<span className="text-sky-600">Store</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link className="rounded-full p-2 text-slate-700 hover:bg-white" to="/catalogo">
            <Search size={21} />
          </Link>

          <Link className="rounded-full p-2 text-slate-700 hover:bg-white" to="/favoritos">
            <Heart size={21} />
          </Link>

          <Link className="rounded-full p-2 text-slate-700 hover:bg-white" to="/carrinho">
            <ShoppingCart size={21} />
          </Link>

          <Link className="rounded-full p-2 text-slate-700 hover:bg-white" to="/minha-conta">
            <Bell size={21} />
          </Link>

          <Link className="hidden rounded-full bg-slate-950 p-2 text-white md:inline-flex" to="/minha-conta">
            <User size={19} />
          </Link>
        </div>
      </div>
    </header>
    </>
  )
}
