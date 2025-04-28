import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { CacheModule } from '@nestjs/cache-manager';
import { GithubModule } from './github/github.module';

@Module({
  imports: [
    FirebaseModule,
    GithubModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
