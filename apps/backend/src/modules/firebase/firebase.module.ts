import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import * as path from 'path';

import { Module } from '@nestjs/common';

import { FirebaseController } from './controller/firebase.controller';
import { FirebaseService } from './service/firebase.service';

// Загружаем .env файлы из корня проекта
const rootPath = path.resolve(process.cwd(), '..');
const envFile =
    process.env.NODE_ENV === 'production' ? '.env' : '.env.development';

dotenv.config({ path: path.resolve(rootPath, envFile) });

@Module({
    controllers: [FirebaseController],
    providers: [FirebaseService],
    exports: [FirebaseService],
})
export class FirebaseModule {
    constructor() {
        this.initializeFirebase();
    }

    private initializeFirebase() {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (!privateKey) {
            throw new Error('FIREBASE_PRIVATE_KEY is not defined');
        }

        const cleanPrivateKey = privateKey
            .replace(/\\n/g, '\n')
            .replace(/^"|"$/g, '')
            .trim();

        if (!admin.apps.length) {
            try {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        privateKey: cleanPrivateKey,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.trim(),
                    }),
                    storageBucket:
                        process.env.FIREBASE_STORAGE_BUCKET ||
                        'cv-cherkas-db.appspot.com',
                });
                console.log('✅ Firebase Admin initialized successfully');
            } catch (error) {
                console.error('❌ Firebase initialization error:', error);
                throw error;
            }
        }
    }
}
