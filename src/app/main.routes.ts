import { Routes } from '@angular/router';

import { ERoute } from './core/enum/route.enum';

export const MAIN_ROUTES: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/layout' }, //`/${ERouterPath.AUTH}` },
    {
        path: ERoute.LAYOUT, //ERouterPath.LAYOUT,
        // canActivate: [AuthGuard],
        loadComponent: () =>
            import('./layout/layout.component').then((c) => c.LayoutComponent),
    },
];
