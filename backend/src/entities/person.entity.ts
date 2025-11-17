// entities/persons.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('persons')
export class PersonEntity {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Имя человека' })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({ description: 'Должность' })
  @Column({ nullable: true })
  position: string;

  @ApiProperty({ description: 'Email адрес' })
  @Column({ nullable: true })
  email: string;

  @ApiPropertyOptional({ description: 'Номер телефона' })
  @Column({ nullable: true })
  phone?: string;

  @ApiPropertyOptional({ description: 'URL аватара' })
  @Column({ nullable: true })
  avatar?: string;

  @ApiPropertyOptional({ description: 'Биография' })
  @Column({ nullable: true })
  bio?: string;

  @ApiPropertyOptional({ description: 'Местоположение' })
  @Column({ nullable: true })
  location?: string;
}