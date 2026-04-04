import { appPaths } from '@/app/routes/paths'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={appPaths.app} replace />
  }

  return <Outlet />
}
