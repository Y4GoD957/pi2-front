import {
  createRoute,
  lazyRouteComponent,
} from '@tanstack/react-router'

import { appPaths } from '@/app/routes/paths'
import type { AnyRoute } from '@tanstack/react-router'

export function createEducensoRoutes(parentRoute: AnyRoute) {
  const reportsRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.reports.replace(`${appPaths.app}/`, ''),
    component: lazyRouteComponent(
      () => import('@/features/educenso/pages/ReportsPageRoute'),
      'ReportsPageRoute',
    ),
  })

  const reportCreateRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.reportCreate.replace(`${appPaths.app}/`, ''),
    component: lazyRouteComponent(
      () => import('@/features/educenso/pages/ReportCreatePageRoute'),
      'ReportCreatePageRoute',
    ),
  })

  const reportDetailRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.reportDetail.replace(`${appPaths.app}/`, ''),
    component: lazyRouteComponent(
      () => import('@/features/educenso/pages/ReportDetailPageRoute'),
      'ReportDetailPageRoute',
    ),
  })

  return [reportsRoute, reportCreateRoute, reportDetailRoute] as const
}
