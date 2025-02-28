import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    FirebaseModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  // providers: [
  //   {
  //     provide: APP_INTERCEPTOR,
  //     useClass: CacheInterceptor,
  //   },
  // ],
})
export class AppModule {}
