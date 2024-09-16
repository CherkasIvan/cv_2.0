import { Module } from '@nestjs/common';
import { IndexedDbController } from './controller/indexed-db/indexed-db.controller';
import { IndexedDbService } from './service/indexed-db/indexed-db.service';

@Module({
  controllers: [IndexedDbController],
  providers: [IndexedDbService],
})
export class IndexedDbModule {}
