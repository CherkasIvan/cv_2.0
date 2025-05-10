import express from 'express';
import { createServer } from 'http';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { join } from 'path';

import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';
import { CommonEngine, isMainModule } from '@angular/ssr/node';

import { AppServerModule } from '@app-servire.module';

// Убедитесь, что путь правильный

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = join(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

/**
 * Serve static files from /browser
 */
app.get(
    '**',
    express.static(browserDistFolder, {
        maxAge: '1y',
        index: 'index.html',
    }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
        .render({
            bootstrap: AppServerModule,
            documentFilePath: indexHtml,
            url: `${protocol}://${headers.host}${originalUrl}`,
            publicPath: browserDistFolder,
            providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
        })
        .then((html) => res.send(html))
        .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
    if (process.env['NODE_ENV'] === 'production') {
        enableProdMode(); // Включение режима продакшн
    }
    const port = process.env['PORT'] || 4000;
    app.listen(port, () => {
        console.log(
            `Node Express server listening on http://localhost:${port}`,
        );
    });
}
