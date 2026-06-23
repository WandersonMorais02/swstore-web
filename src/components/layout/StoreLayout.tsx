import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { useMe } from '../../features/auth/auth.hooks'

export function StoreLayout() {
  useMe()

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-4">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
