import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'
import { useMe } from '../features/auth/auth.hooks'

export function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  const meQuery = useMe()

  if (meQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">
        Verificando sessão...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}
