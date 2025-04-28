import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { GithubController } from './controller/github.controller';
import { GithubService } from './service/github.service';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

@Module({
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {
  constructor() {
    const privateKey = process.env.GITHUB_PRIVATE_ACCESS_TOKEN;
    if (!privateKey) {
      throw new Error('GITHUB_PRIVATE_ACCESS_TOKEN is not defined');
    }
  }
}
