// Re-export everything from the route-handlers index
export {
  handleAllRoutes,
  requiresAuthentication,
  isValidRoute,
  getRouteCategory,
  publicRoutes,
  creatorRoutes,
  validationRoutes,
  validatorRoutes,
  coreSystemRoutes
} from './route-handlers/index';