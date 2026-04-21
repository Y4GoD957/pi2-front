import {
  createRoute,
  lazyRouteComponent,
} from '@tanstack/react-router'

import type { AnyRoute } from '@tanstack/react-router'

export function createDashboardRoutes(parentRoute: AnyRoute) {
  const dashboardHomeRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: '/',
    component: lazyRouteComponent(
      () => import('@/features/dashboard/pages/DashboardHomePage'),
      'DashboardHomePage',
    ),
  })

  return [dashboardHomeRoute] as const
}
