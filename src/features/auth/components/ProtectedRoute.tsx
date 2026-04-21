import { useAuth } from '@/features/auth/hooks/useAuth'
import { appPaths } from '@/app/routes/paths'
import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
  const { isAuthenticated, isAuthReady } = useAuth()

  if (!isAuthReady) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to={appPaths.login} replace />
  }

  return <Outlet />
}
