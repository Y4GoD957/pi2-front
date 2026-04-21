import {
  createRoute,
  redirect,
} from '@tanstack/react-router'

import { appPaths } from '@/app/routes/paths'
import type { AnyRoute } from '@tanstack/react-router'

export function createProfileRoutes(parentRoute: AnyRoute) {
  const profileRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.profile.replace(`${appPaths.app}/`, ''),
    beforeLoad: () => {
      throw redirect({ to: appPaths.user })
    },
  })

  return [profileRoute] as const
}
