import { RenderMode, ServerRoute } from '@angular/ssr';

import { layoutServerRoutes } from '@layout/layout.routes.server';

import { ERoute } from './core/enum/route.enum';

export const mainServerRoutes: ServerRoute[] = [
    {
        path: '',
        renderMode: RenderMode.Client,
    },
    {
        path: ERoute.AUTH,
        renderMode: RenderMode.Client,
    },
    ...layoutServerRoutes,
    {
        path: '**',
        renderMode: RenderMode.Server,
    },
];
