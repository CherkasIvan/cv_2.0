import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';

import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
    const server = express();
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const browserDistFolder = resolve(serverDistFolder, '../browser');
    const indexHtml = join(serverDistFolder, 'index.server.html');

    const commonEngine = new CommonEngine();

    server.set('view engine', 'html');
    server.set('views', browserDistFolder);

    // Example Express Rest API endpoints
    // server.get('/api/[**', (req, res) => { });
    // Serve static files from /browser
    server.get(
        '**](https://www.bing.com/search?form=SKPBOT&q=%26apos%3B%2C%20%28req%2C%20res%29%20%3D%26gt%3B%20%7B%20%7D%29%3B%0D%0A%2F%2F%20Serve%20static%20files%20from%20%2Fbrowser%0D%0Aserver.get%28%0D%0A%26apos%3B)',
        express.static(browserDistFolder, {
            maxAge: '1y',
            index: 'index.html',
        }),
    );

    // All regular routes use the Angular engine
    server.get(
        '[**',
        (
            req: {
                protocol: any;
                originalUrl: any;
                baseUrl: any;
                headers: any;
            },
            res: { send: (arg0: string) => any },
            next: (arg0: any) => any,
        ) => {
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
                .catch((err) => next(err));
        },
    );

    return server;
}

function run(): void {
    const port = process.env['PORT'] || 4000;

    // Start up the Node server
    const server = app();
    server.listen(port, () => {
        console.log(
            `Node Express server listening on http://localhost:${port}`,
        );
    });
}

run();
