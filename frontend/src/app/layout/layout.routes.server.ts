import { RenderMode, ServerRoute } from '@angular/ssr';

import { ERoute } from '@core/enum/route.enum';

export const layoutServerRoutes: ServerRoute[] = [
    {
        path: `${ERoute.LAYOUT}/${ERoute.MAIN}`,
        renderMode: RenderMode.Server,
    },
    {
        path: `${ERoute.LAYOUT}/${ERoute.PROJECTS}`,
        renderMode: RenderMode.Server,
    },
    {
        path: `${ERoute.LAYOUT}/${ERoute.EXPERIENCE}`,
        renderMode: RenderMode.Server,
    },
    {
        path: `${ERoute.LAYOUT}/${ERoute.TECHNOLOGIES}`,
        renderMode: RenderMode.Server,
    },
    {
        path: `${ERoute.LAYOUT}`,
        renderMode: RenderMode.Server,
    },
];
