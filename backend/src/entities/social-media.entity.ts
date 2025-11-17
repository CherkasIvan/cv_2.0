// entities/social-media.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('social_media')
export class SocialMediaEntity {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Ссылка на социальную сеть' })
  @Column({ nullable: true })
  link: string;

  @ApiProperty({ description: 'Название социальной сети' })
  @Column({ nullable: true })
  value: string;

  @ApiPropertyOptional({ description: 'Название изображения' })
  @Column({ nullable: true })
  imgName: string;

  @ApiPropertyOptional({ 
    description: 'Массив изображений',
    type: [String] 
  })
  @Column('simple-array', { nullable: true })
  images: string[];
}