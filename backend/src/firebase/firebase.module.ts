import { Module } from '@nestjs/common';
import { FirebaseService } from './service/firebase.service';
import { FirebaseController } from './controller/firebase.controller';

@Module({
  controllers: [FirebaseController],
  providers: [FirebaseService],
})
export class FirebaseModule {}
