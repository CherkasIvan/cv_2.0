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
export class GithubModule {}
