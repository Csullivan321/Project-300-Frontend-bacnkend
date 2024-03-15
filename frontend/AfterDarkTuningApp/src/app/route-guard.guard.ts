import { CanActivateFn , Router} from '@angular/router';

export const routeGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
