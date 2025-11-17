import { ApiProperty } from '@nestjs/swagger';

export class MigrationResponseClassDto {
  @ApiProperty({ description: 'Сообщение о результате миграции' })
  message: string;
}