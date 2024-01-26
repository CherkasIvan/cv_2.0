import { Routes } from '@angular/router';

export const mainRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/layout'}, //`/${ERouterPath.AUTH}` },
  // {
  //     path: 'auth', //ERouterPath.AUTH,
  //     loadComponent: () =>
  //         import('./auth/auth.component').then((c) => c.AuthComponent),
  // },
  {
      path: 'layout', //ERouterPath.LAYOUT,
      // canActivate: [AuthGuard],
      loadChildren: () =>
          import('./layout/layout.component').then(
              (c) => c.LayoutComponent,
          ),
  },
];
