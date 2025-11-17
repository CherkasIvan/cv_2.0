import { firebaseConfig } from '@core/utils/firebase/firebase.config';

export const environment = {
    production: true,
    apiUrl: '/api',
    ssr: true,
    firebase: firebaseConfig,
};
