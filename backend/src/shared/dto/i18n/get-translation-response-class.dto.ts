import { ApiProperty } from '@nestjs/swagger';

export class GetTranslationResponseClassDto {
  @ApiProperty()
  value: string;

  @ApiProperty()
  module: string;
}