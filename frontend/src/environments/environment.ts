import { firebaseConfig } from '../app/core/utils/firebase/firebase.config';

export const environment = {
    production: false,
    firebase: firebaseConfig,
    appUrl: 'http://localhost:4200',
    apiUrl: 'http://localhost:3000', 
    ssr: true,
};