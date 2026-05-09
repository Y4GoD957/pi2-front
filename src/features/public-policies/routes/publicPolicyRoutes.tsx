import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import type { AnyRoute } from '@tanstack/react-router'

import { appPaths } from '@/app/routes/paths'

export function createPublicPolicyRoutes(parentRoute: AnyRoute) {
  const publicPoliciesRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.publicPolicies.replace(`${appPaths.app}/`, ''),
    component: lazyRouteComponent(
      () => import('@/features/public-policies/pages/PublicPoliciesPageRoute'),
      'PublicPoliciesPageRoute',
    ),
  })

  const publicPolicyCreateRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.publicPolicyCreate.replace(`${appPaths.app}/`, ''),
    component: lazyRouteComponent(
      () => import('@/features/public-policies/pages/PublicPolicyCreatePageRoute'),
      'PublicPolicyCreatePageRoute',
    ),
  })

  const publicPolicyDetailRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.publicPolicyDetail.replace(`${appPaths.app}/`, ''),
    component: lazyRouteComponent(
      () => import('@/features/public-policies/pages/PublicPolicyDetailPageRoute'),
      'PublicPolicyDetailPageRoute',
    ),
  })

  const publicPolicyEditRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: appPaths.publicPolicyEdit.replace(`${appPaths.app}/`, ''),
    component: lazyRouteComponent(
      () => import('@/features/public-policies/pages/PublicPolicyEditPageRoute'),
      'PublicPolicyEditPageRoute',
    ),
  })

  return [
    publicPoliciesRoute,
    publicPolicyCreateRoute,
    publicPolicyDetailRoute,
    publicPolicyEditRoute,
  ] as const
}
