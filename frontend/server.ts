import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { APP_BASE_HREF } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { CommonEngine } from '@angular/ssr';

import { REQUEST, RESPONSE } from './src/express.tokens';
import bootstrap from './src/main.server';

export function app(): express.Express {
    const server = express();
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const indexHtml = join(serverDistFolder, 'index.server.html');

    const commonEngine = new CommonEngine();

    server.set('view engine', 'html');
    server.set('views', serverDistFolder);

    server.get(
        '*.*',
        express.static(resolve(serverDistFolder, 'browser'), {
            maxAge: '1y',
            index: 'index.html',
        }),
    );

    server.get('*', (req, res, next) => {
        commonEngine
            .render({
                bootstrap,
                documentFilePath: indexHtml,
                url: req.originalUrl,
                publicPath: resolve(serverDistFolder, 'browser'),
                providers: [
                    { provide: APP_BASE_HREF, useValue: '/' },
                    { provide: LOCALE_ID, useValue: 'en' }, // Default language
                    { provide: RESPONSE, useValue: res },
                    { provide: REQUEST, useValue: req },
                ],
            })
            .then((html) => res.send(html))
            .catch((err) => next(err));
    });

    return server;
}

function run(): void {
    const server = app();
    const port = process.env['PORT'] || 4000;
    server.listen(port, () => {
        console.log(
            `Node Express server listening on http://localhost:${port}`,
        );
    });
}

run();
