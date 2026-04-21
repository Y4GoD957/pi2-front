import {
  Outlet,
  RouterProvider,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router'

import { appPaths } from '@/app/routes/paths'
import type { AuthContextValue } from '@/features/auth/contexts/AuthContext'
import { createAuthRoutes } from '@/features/auth/routes/authRoutes'
import { createDashboardRoutes } from '@/features/dashboard/routes/dashboardRoutes'
import { createEducensoRoutes } from '@/features/educenso/routes/educensoRoutes'
import { createProfileRoutes } from '@/features/profile/routes/profileRoutes'
import { createUserRoutes } from '@/features/user/routes/userRoutes'

interface RouterContext {
  auth: Pick<AuthContextValue, 'isAuthenticated'>
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: appPaths.home,
  beforeLoad: ({ context }: { context: RouterContext }) => {
    throw redirect({
      to: context.auth.isAuthenticated ? appPaths.app : appPaths.login,
    })
  },
})

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  beforeLoad: ({ context }: { context: RouterContext }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: appPaths.app })
    }
  },
  component: Outlet,
})

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: appPaths.app.slice(1),
  beforeLoad: ({ context }: { context: RouterContext }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: appPaths.login })
    }
  },
  component: lazyRouteComponent(
    () => import('@/features/app/layouts/AppShell'),
    'AppShell',
  ),
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  publicRoute.addChildren(createAuthRoutes(publicRoute)),
  appRoute.addChildren([
    ...createDashboardRoutes(appRoute),
    ...createEducensoRoutes(appRoute),
    ...createProfileRoutes(appRoute),
    ...createUserRoutes(appRoute),
  ]),
])

export const router = createRouter({
  routeTree,
  context: {
    auth: {
      isAuthenticated: false,
    },
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

interface AppRouterProps {
  auth: RouterContext['auth']
}

export function AppRouter({ auth }: AppRouterProps) {
  return <RouterProvider router={router} context={{ auth }} />
}
