// entities/themeless-pictures.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('themeless_pictures')
export class ThemelessPicturesEntity {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiPropertyOptional({ description: 'Название изображения' })
  @Column({ nullable: true })
  name?: string;

  @ApiPropertyOptional({ description: 'Путь к иконке для темной темы' })
  @Column({ nullable: true })
  darkModeIconPath?: string;

  @ApiPropertyOptional({ description: 'Путь к иконке для светлой темы' })
  @Column({ nullable: true })
  whiteModeIconPath?: string;

  @ApiPropertyOptional({ description: 'Путь к изображению' })
  @Column({ nullable: true })
  imgSrc?: string;

  @ApiPropertyOptional({ description: 'Альтернативный текст' })
  @Column({ nullable: true })
  alt?: string;
}