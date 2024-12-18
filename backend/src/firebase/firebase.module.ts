import { Module } from '@nestjs/common';
import { FirebaseService } from './service/firebase.service';
import { FirebaseController } from './controller/firebase-controller/firebase.controller';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

@Module({
  controllers: [FirebaseController],
  providers: [FirebaseService],
})
export class FirebaseModule {
  constructor() {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('FIREBASE_PRIVATE_KEY is not defined');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      storageBucket: 'gs://cv-cherkas-db.appspot.com',
    });
  }
}
