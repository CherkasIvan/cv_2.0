// entities/project.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('project')
export class ProjectEntity {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Название проекта' })
  @Column({ nullable: true })
  title: string;

  @ApiProperty({ description: 'Описание проекта' })
  @Column({ nullable: true })
  description: string;

  @ApiPropertyOptional({ 
    description: 'Технологии проекта',
    type: [String] 
  })
  @Column('simple-array', { nullable: true })
  technologies: string[];

  @ApiPropertyOptional({ description: 'GitHub URL' })
  @Column({ nullable: true })
  githubUrl: string;

  @ApiPropertyOptional({ description: 'Live URL' })
  @Column({ nullable: true })
  liveUrl: string;

  @ApiPropertyOptional({ 
    description: 'Массив изображений',
    type: [String] 
  })
  @Column('simple-array', { nullable: true })
  images: string[];

  @ApiPropertyOptional({ description: 'Альтернативный текст' })
  @Column({ nullable: true })
  alt: string;

  @ApiPropertyOptional({ description: 'Категория проекта' })
  @Column({ nullable: true })
  category: string;

  @ApiPropertyOptional({ description: 'Статус проекта' })
  @Column({ nullable: true })
  status: string;

  @ApiPropertyOptional({ description: 'Дата начала проекта' })
  @Column({ nullable: true })
  startDate: string;

  @ApiPropertyOptional({ description: 'Дата окончания проекта' })
  @Column({ nullable: true })
  endDate: string;
}