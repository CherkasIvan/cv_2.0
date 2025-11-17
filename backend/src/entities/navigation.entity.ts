// entities/navigation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('navigation')
export class NavigationEntity {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Ссылка для навигации' })
  @Column({ nullable: true })
  link: string;

  @ApiProperty({ description: 'Позиция в навигации' })
  @Column({ nullable: true })
  position: number;

  @ApiProperty({ description: 'Отображаемое значение' })
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