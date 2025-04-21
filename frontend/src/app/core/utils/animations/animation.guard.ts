import { CanActivateFn } from '@angular/router';

export const animationGuard: CanActivateFn = (route, state) => {
  return true;
};
