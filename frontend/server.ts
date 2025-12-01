import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { CommonEngine } from '@angular/ssr/node';

export function app(): express.Express {
    const server = express();
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const browserDistFolder = resolve(serverDistFolder, '../browser');
    const indexHtml = join(serverDistFolder, 'index.server.html');

    const commonEngine = new CommonEngine();

    // 🔥 ВСЕГДА добавляем прокси, не только для dev режима
    const proxyOptions = {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug' as const
    };

    // Прокси для API маршрутов - ДОЛЖНО БЫТЬ ПЕРЕД ВСЕМИ ОСТАЛЬНЫМИ МАРШРУТАМИ
    server.use('/api', createProxyMiddleware(proxyOptions));
    server.use('/auth', createProxyMiddleware(proxyOptions));
    server.use('/firebase', createProxyMiddleware(proxyOptions));
    server.use('/person', createProxyMiddleware(proxyOptions));
    server.use('/template', createProxyMiddleware(proxyOptions));

    server.set('view engine', 'html');
    server.set('views', browserDistFolder);

    // Serve static files
    server.get('*.*', express.static(browserDistFolder, {
        maxAge: '1y'
    }));

    // Handle all other routes
    server.get('*', (req, res, next) => {
        const { protocol, originalUrl, baseUrl, headers } = req;

        commonEngine
            .render({
                bootstrap,
                documentFilePath: indexHtml,
                url: `${protocol}://${headers.host}${originalUrl}`,
                publicPath: browserDistFolder,
                providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
            })
            .then((html) => res.send(html))
            .catch((err) => {
                console.error('SSR Error:', err);
                // Fallback to client-side rendering
                res.sendFile(join(browserDistFolder, 'index.html'));
            });
    });

    return server;
}

function run(): void {
    const port = process.env['PORT'] || 4000;
    const server = app();
    
    server.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
        console.log(`API requests are proxied to: http://localhost:3000`);
        console.log(`Frontend available at: http://localhost:4200`);
    });
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}