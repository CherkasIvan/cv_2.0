import express, { Express } from 'express';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { APP_BASE_HREF } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { CommonEngine } from '@angular/ssr';

import { REQUEST, RESPONSE } from '../src/express.tokens';
import bootstrap from '../src/main.server';

export function app(): Express {
    const server = express();
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const lang = basename(serverDistFolder);
    const langPath = `/${lang}/`;
    const browserDistFolder = resolve(serverDistFolder, `../browser/${lang}`);
    const indexHtml = join(serverDistFolder, 'index.server.html');

    const commonEngine = new CommonEngine();

    server.set('view engine', 'html');
    server.set('views', browserDistFolder);

    server.get(
        '*.*',
        express.static(browserDistFolder, {
            maxAge: '1y',
        }),
    );

    server.get(
        '*',
        (
            req: { protocol: any; originalUrl: any; headers: any },
            res: { send: (arg0: string) => any },
            next: (arg0: any) => any,
        ) => {
            const { protocol, originalUrl, headers } = req;
            commonEngine
                .render({
                    bootstrap,
                    documentFilePath: indexHtml,
                    url: `${protocol}://${headers.host}${originalUrl}`,
                    publicPath: resolve(serverDistFolder, `../browser/`),
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
    const server = app();
    server.listen(port, () => {
        console.log(
            `Node Express server listening on http://localhost:${port}`,
        );
    });
}

run();
