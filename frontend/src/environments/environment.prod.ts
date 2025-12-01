import { firebaseConfig } from '@core/utils/firebase/firebase.config';

export const environment = {
    production: true,
    apiUrl: process.env['API_URL'],
    ssr: process.env['SSR'] === 'true' || true,
    firebase: firebaseConfig,
    appUrl: process.env['APP_URL'] || 'http://localhost',
};