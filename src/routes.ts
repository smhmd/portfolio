import { index, route, type RouteConfig } from '@react-router/dev/routes'

import { appIDs } from 'src/apps'

const appRoutes = appIDs.map((app) => route(app, `apps/${app}/route.tsx`))

export default [
  index('apps/launcher/route.tsx'),
  ...appRoutes,
  route('sitemap.xml', 'sitemap.ts'),
] satisfies RouteConfig
