import { firebaseConfig } from '../app/core/utils/firebase/firebase.config';

export const environment = {
    production: true,
    firebase: firebaseConfig,
    appUrl: 'http://localhost:4000',
    apiUrl: 'http://localhost:3000', 
    ssr: true,
    proxyEnabled: true,
    useBackendTranslations: true,
};