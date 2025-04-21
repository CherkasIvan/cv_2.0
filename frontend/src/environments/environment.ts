import { firebaseConfig } from '../app/core/utils/firebase/firebase.config';

export const environment = {
    production: false,
    firebase: firebaseConfig,
    backendUrl: 'http://localhost:3000/',
    appUrl: 'http://localhost:4200/',
};
