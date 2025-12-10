import { Routes } from '@angular/router';

import { NoAuthGuard } from '@core/utils/guards/no-auth/no-auth.guard';
import { ERoute } from '@cv_2.0/shared/enum/route.enum';

import { AuthGuard } from './core/utils/guards/auth/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const MAIN_ROUTES: Routes = [
    {
        path: '',
        redirectTo: ERoute.AUTH,
        pathMatch: 'full',
    },
    {
        path: ERoute.AUTH,
        canActivate: [NoAuthGuard],
        loadComponent: () =>
            import('./layout/pages/auth/auth.component').then(
                (c) => c.AuthComponent,
            ),
    },
    {
        path: ERoute.LAYOUT,
        component: LayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./layout/layout.routes').then((c) => c.LAYOUT_ROUTES),
    },
    {
        path: '**',
        redirectTo: ERoute.AUTH,
        pathMatch: 'full',
    },
];
