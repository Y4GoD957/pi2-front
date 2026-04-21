import {
  createRoute,
  lazyRouteComponent,
} from '@tanstack/react-router'

import { appPaths } from '@/app/routes/paths'
import type { AnyRoute } from '@tanstack/react-router'

export function createAuthRoutes(parentRoute: AnyRoute) {
  const loginRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.login.slice(1),
    component: lazyRouteComponent(
      () => import('@/features/auth/pages/LoginPage'),
      'LoginPage',
    ),
  })

  const registerRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.register.slice(1),
    component: lazyRouteComponent(
      () => import('@/features/auth/pages/RegisterPage'),
      'RegisterPage',
    ),
  })

  return [loginRoute, registerRoute] as const
}
