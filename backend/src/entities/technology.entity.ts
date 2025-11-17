// entities/technology.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('technology')
export class TechnologyEntity {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Альтернативный текст' })
  @Column({ nullable: true })
  alt: string;

  @ApiPropertyOptional({ description: 'Путь к иконке' })
  @Column({ nullable: true })
  iconPath: string;

  @ApiPropertyOptional({ description: 'Ссылка на технологию' })
  @Column({ nullable: true })
  link: string;

  @ApiProperty({ description: 'Название технологии' })
  @Column({ nullable: true })
  technologyName: string;

  @ApiPropertyOptional({ description: 'Название изображения' })
  @Column({ nullable: true })
  imgName: string;

  @ApiPropertyOptional({ 
    description: 'Массив изображений',
    type: [String] 
  })
  @Column('simple-array', { nullable: true })
  images: string[];

  @ApiProperty({ 
    description: 'Категория технологии', 
    enum: ['backend', 'frontend', 'other'] 
  })
  @Column({ nullable: true })
  category: string;
}