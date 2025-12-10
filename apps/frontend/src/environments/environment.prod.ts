export const environment = {
    production: true,
    apiUrl: process.env['API_URL'],
    ssr: process.env['SSR'] === 'true' || true,
    appUrl: process.env['APP_URL'] || 'http://localhost',
    proxyEnabled: false,
    useBackendTranslations: true,
};
