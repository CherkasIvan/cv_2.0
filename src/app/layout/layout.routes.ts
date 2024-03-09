import { Routes } from '@angular/router';

import { ERoute } from '@core/enum/route.enum';

import { LayoutComponent } from './layout.component';

export const LAYOUT_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: ERoute.MAIN,
                loadComponent: () =>
                    import('./pages/main/main.component').then(
                        (c) => c.MainComponent,
                    ),
            },
            {
                path: ERoute.PROJECTS,
                loadComponent: () =>
                    import('./pages/projects/projects.component').then(
                        (c) => c.ProjectsComponent,
                    ),
            },
            {
                path: ERoute.EXPERIENCE,
                loadComponent: () =>
                    import('./pages/experience/experience.component').then(
                        (c) => c.ExperienceComponent,
                    ),
            },
            {
                path: ERoute.TECHNOLOGIES,
                loadComponent: () =>
                    import('./pages/technologies/technologies.component').then(
                        (c) => c.TechnologiesComponent,
                    ),
            },
            {
                path: '',
                redirectTo: ERoute.MAIN,
                pathMatch: 'full',
            },
        ],
    },
];
