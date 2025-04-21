import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GithubModule } from './github/github.module';

@Module({
  imports: [
    FirebaseModule,
    GithubModule,
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
