import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import * as path from 'path';

import { Module } from '@nestjs/common';

import { FirebaseService } from './service/firebase.service';
import { FirebaseController } from './controller/firebase.controller';

@Module({
    controllers: [FirebaseController],
    providers: [FirebaseService],
    exports: [FirebaseService],
})
export class FirebaseModule {
    constructor() {
        dotenv.config({ path: path.resolve(process.cwd(), '.env') });
        
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('FIREBASE_PRIVATE_KEY is not defined');
        }

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                }),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'cv-cherkas-db.appspot.com',
            });
        }
    }
}