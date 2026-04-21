import {
  createRoute,
  lazyRouteComponent,
} from '@tanstack/react-router'

import { appPaths } from '@/app/routes/paths'
import type { AnyRoute } from '@tanstack/react-router'

export function createUserRoutes(parentRoute: AnyRoute) {
  const userRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.user.replace(`${appPaths.app}/`, ''),
    component: lazyRouteComponent(
      () => import('@/features/user/pages/UserPageRoute'),
      'UserPageRoute',
    ),
  })

  const userAccountRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.account.replace(`${appPaths.app}/`, ''),
    component: lazyRouteComponent(
      () => import('@/features/user/pages/UserAccountPageRoute'),
      'UserAccountPageRoute',
    ),
  })

  return [userRoute, userAccountRoute] as const
}
