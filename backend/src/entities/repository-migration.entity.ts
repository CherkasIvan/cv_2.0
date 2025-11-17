// entities/repository-migration.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('repositories')
export class RepositoryMigrationEntity {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Название репозитория' })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({ description: 'Описание репозитория' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'URL репозитория' })
  @Column({ nullable: true })
  url: string;

  @ApiPropertyOptional({ description: 'Язык программирования' })
  @Column({ nullable: true })
  language?: string;

  @ApiPropertyOptional({ description: 'Количество звезд', default: 0 })
  @Column({ default: 0, nullable: true })
  stars?: number;

  @ApiPropertyOptional({ description: 'Количество форков', default: 0 })
  @Column({ default: 0, nullable: true })
  forks?: number;

  @ApiPropertyOptional({ description: 'Дата последнего обновления' })
  @Column({ nullable: true })
  updatedAt?: string;

  @ApiPropertyOptional({ 
    description: 'Темы/тэги репозитория',
    type: [String] 
  })
  @Column('simple-array', { nullable: true })
  topics?: string[];
}