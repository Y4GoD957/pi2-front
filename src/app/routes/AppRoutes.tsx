import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { AppShell } from '@/features/app/layouts/AppShell'
import { DashboardHomePage } from '@/features/dashboard/pages/DashboardHomePage'
import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import { appPaths } from '@/app/routes/paths'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { PublicOnlyRoute } from '@/features/auth/components/PublicOnlyRoute'
import { Navigate, Route, Routes } from 'react-router-dom'

function AppRedirect() {
  const { isAuthenticated, isAuthReady } = useAuth()

  if (!isAuthReady) {
    return null
  }

  return (
    <Navigate
      to={isAuthenticated ? appPaths.app : appPaths.login}
      replace
    />
  )
}

function ProfileRoute() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return <ProfilePage user={user} />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={appPaths.home} element={<AppRedirect />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path={appPaths.login} element={<LoginPage />} />
        <Route path={appPaths.register} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={appPaths.app} element={<AppShell />}>
          <Route index element={<DashboardHomePage />} />
          <Route path="profile" element={<ProfileRoute />} />
        </Route>
      </Route>

      <Route path="*" element={<AppRedirect />} />
    </Routes>
  )
}
