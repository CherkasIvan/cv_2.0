import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const animationsGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const canActivate = true;

    if (!canActivate) {
        router.navigate(['/auth']);
    }

    return canActivate;
};
