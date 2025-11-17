// entities/main-page-info.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('main_page_info')
export class MainPageInfoEntity {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiPropertyOptional({ description: 'Текст при наведении на кнопку' })
  @Column({ nullable: true })
  buttonHoverText: string;

  @ApiPropertyOptional({ description: 'Текст кнопки' })
  @Column({ nullable: true })
  buttonText: string;

  @ApiProperty({ description: 'Описание' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Имя' })
  @Column({ nullable: true })
  name: string;

  @ApiPropertyOptional({ description: 'Путь к изображению' })
  @Column({ nullable: true })
  imgSrc: string;

  @ApiProperty({ description: 'Стек технологий' })
  @Column({ nullable: true })
  stack: string;

  @ApiProperty({ description: 'Статус' })
  @Column({ nullable: true })
  status: string;

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