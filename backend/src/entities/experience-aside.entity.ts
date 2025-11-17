// entities/experience-aside.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('experience_aside')
export class ExperienceAsideEntity {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Заголовок опыта' })
  @Column({ nullable: true })
  title: string;

  @ApiProperty({ description: 'Значение опыта' })
  @Column({ nullable: true })
  value: string;

  @ApiPropertyOptional({ description: 'Название изображения' })
  @Column({ nullable: true })
  imgName?: string;

  @ApiPropertyOptional({ 
    description: 'Массив изображений',
    type: [String] 
  })
  @Column('simple-array', { nullable: true })
  images?: string[];
}