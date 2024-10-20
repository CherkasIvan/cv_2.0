import express from 'express';
import { REQUEST, RESPONSE } from 'express.tokens';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { APP_BASE_HREF } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { CommonEngine } from '@angular/ssr';

import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
    const server = express();
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const indexHtml = join(serverDistFolder, 'index.server.html');

    const lang = basename(serverDistFolder);

    const langPath = `/${lang}`;
    const browserDistFolder = resolve(serverDistFolder, `browser/${lang}`);

    const commonEngine = new CommonEngine();

    server.set('view engine', 'html');
    server.set('views', browserDistFolder);

    // Example Express Rest API endpoints
    // server.get('/api/[**', (req, res) => { });
    // Serve static files from /browser
    server.get(
        '*.*',
        express.static(browserDistFolder, {
            maxAge: '1y',
            index: 'index.html',
        }),
    );

    // All regular routes use the Angular engine
    server.get(
        '*',
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
                    publicPath: resolve(serverDistFolder, `browser/`),
                    providers: [
                        { provide: APP_BASE_HREF, useValue: langPath },
                        { provide: LOCALE_ID, useValue: lang },
                        { provide: RESPONSE, useValue: res },
                        { provide: REQUEST, useValue: req },
                    ],
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
