import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'
import { useMe } from '../features/auth/auth.hooks'

type RoleRouteProps = {
  roles: string[]
}

export function RoleRoute({ roles }: RoleRouteProps) {
  const user = useAuthStore(state => state.user)

  const meQuery = useMe()

  if (meQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">
        Verificando acesso...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
