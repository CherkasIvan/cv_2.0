import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { HardSkillsNavEntity } from './hard-skills-nav.entity';

@Entity('technologies_aside')
export class TechnologiesAsideEntity {
    @ApiProperty({ description: 'Уникальный идентификатор' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Заголовок технологии' })
    @Column({ nullable: true })
    title: string;

    @ApiProperty({ description: 'Значение технологии' })
    @Column({ nullable: true })
    value: string;

    @ApiPropertyOptional({ description: 'Название изображения' })
    @Column({ nullable: true })
    imgName?: string;

    @ApiPropertyOptional({
        description: 'Массив изображений',
        type: [String],
    })
    @Column('simple-array', { nullable: true })
    images?: string[];

    @OneToMany(
        () => HardSkillsNavEntity,
        (hardSkill) => hardSkill.technologyAside,
    )
    hardSkills: HardSkillsNavEntity[];
}
