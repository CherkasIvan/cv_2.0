import { Routes } from '@angular/router';

import { ERoute } from './core/enum/route.enum';

export const MAIN_ROUTES: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/auth' }, //`/${ERouterPath.AUTH}` },
    {
        path: ERoute.AUTH, //ERouterPath.AUTH,
        loadComponent: () =>
            import('./auth/auth.component').then((c) => c.AuthComponent),
    },
    {
        path: ERoute.LAYOUT, //ERouterPath.LAYOUT,
        // canActivate: [AuthGuard],
        loadComponent: () =>
            import('./layout/layout.component').then((c) => c.LayoutComponent),
    },
];
