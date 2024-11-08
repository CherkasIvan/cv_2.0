import express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';

import bootstrap from './src/main.server';

const DIST_FOLDER = join(process.cwd(), 'dist/cv_2.0/browser');
const app = express();

const engine = new CommonEngine();

app.engine(
    'html',
    (
        filePath: string,
        options: any,
        callback: (err?: Error | null, html?: string) => void,
    ) => {
        engine
            .render({
                bootstrap,
                documentFilePath: join(DIST_FOLDER, 'index.html'),
                url: options.req.url,
                providers: [
                    { provide: APP_BASE_HREF, useValue: options.req.baseUrl },
                ],
            })
            .then((html) => callback(null, html))
            .catch((err) => callback(err));
    },
);

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.get(
    '*.*',
    express.static(DIST_FOLDER, {
        maxAge: '1y',
    }),
);

app.get('/*', (req, res) => {
    res.render('index', { req });
});

const PORT = process.env['PORT'] || 4000;
app.listen(PORT, () => {
    console.log(`Node Express server listening on http://localhost:${PORT}`);
});
