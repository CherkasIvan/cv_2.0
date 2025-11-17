// entities/hard-skills-nav.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('hard_skills_nav')
export class HardSkillsNavEntity {
    @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Ссылка для навигации', example: '/backend' })
    @Column({ nullable: true })
    link: string;

    @ApiProperty({ description: 'Значение для отображения', example: 'Backend' })
    @Column({ nullable: true })
    value: string;

    @ApiProperty({ description: 'Название изображения', required: false })
    @Column({ nullable: true })
    imgName?: string;

    @ApiProperty({ description: 'Изображения', type: [String], required: false })
    @Column('simple-array', { nullable: true })
    images?: string[];
}