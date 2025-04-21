import { firebaseConfig } from '../app/core/utils/firebase/firebase.config';

export const environment = {
    production: true,
    firebase: firebaseConfig,
    appUrl: 'http://localhost:4200/',
    backendUrl: 'http://localhost:3000/',
};
