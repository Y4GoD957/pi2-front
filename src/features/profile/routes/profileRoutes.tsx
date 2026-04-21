import {
  createRoute,
  lazyRouteComponent,
} from '@tanstack/react-router'

import { appPaths } from '@/app/routes/paths'
import type { AnyRoute } from '@tanstack/react-router'

export function createProfileRoutes(parentRoute: AnyRoute) {
  const profileRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.profile.replace(`${appPaths.app}/`, ''),
    component: lazyRouteComponent(
      () => import('@/features/profile/pages/ProfilePageRoute'),
      'ProfilePageRoute',
    ),
  })

  return [profileRoute] as const
}
