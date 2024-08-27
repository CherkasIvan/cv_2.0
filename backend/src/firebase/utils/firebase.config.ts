import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyAgp-qSDSDi_eSVqE5hTTxc3WOe3-hC5gw',
  authDomain: 'cv-cherkas-db.firebaseapp.com',
  projectId: 'cv-cherkas-db',
  storageBucket: 'cv-cherkas-db.appspot.com',
  messagingSenderId: '704018082761',
  appId: '1:704018082761:web:ed57c2a14eb2c7d2dfd618',
  measurementId: 'G-J5RMJP90JF',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
