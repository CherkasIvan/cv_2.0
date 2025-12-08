import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PassportModule } from '@nestjs/passport';
import { I18nController } from './controller/i18n/i18n.controller';
import { MediaManagerController } from './controller/media-manger/media-manger.controller';
import { FileStorageService } from './service/file-storage/file-storage.service';
import { I18nService } from './service/i18n/i18n.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 100, 
    }]),
  ],
  controllers: [MediaManagerController, I18nController],
  providers: [FileStorageService, I18nService],
  exports: [FileStorageService, I18nService],
})
export class FileStorageModule {}