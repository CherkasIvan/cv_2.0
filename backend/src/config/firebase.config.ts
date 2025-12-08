import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as path from 'path';

const rootPath = path.resolve(process.cwd(), '..');
const envFile = process.env.NODE_ENV === 'production' 
    ? '.env' 
    : '.env.development';

dotenv.config({ path: path.resolve(rootPath, envFile) });

const formatPrivateKey = (key: string | undefined) => {
  if (!key) return undefined;
  return key.replace(/\\n/g, '\n');
};

const requiredEnvVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN', 
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);