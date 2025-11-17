// entities/work-experience.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('work_experience')
export class WorkExperienceEntity {
    @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Путь к логотипу компании', required: false, example: 'images/company_logo.png' })
    @Column({ nullable: true })
    logoPath?: string;

    @ApiProperty({ description: 'Альтернативный текст', required: false, example: 'Логотип компании' })
    @Column({ nullable: true })
    alt?: string;

    @ApiProperty({ description: 'Путь к иконке', required: false, example: 'icons/company_icon.png' })
    @Column({ nullable: true })
    iconPath?: string;

    @ApiProperty({ description: 'Название компании', example: 'Google Inc.' })
    @Column({ nullable: true })
    company: string;

    @ApiProperty({ description: 'Дата начала работы', example: 'Январь 2020' })
    @Column({ name: 'from', nullable: true })
    from: string;

    @ApiProperty({ description: 'Дата окончания работы', example: 'Декабрь 2023' })
    @Column({ name: 'to', nullable: true })
    to: string;

    @ApiProperty({ description: 'Местоположение', example: 'Москва, Россия' })
    @Column({ nullable: true })
    place: string;

    @ApiProperty({ description: 'Ссылка на сайт компании', example: 'https://company.example.com' })
    @Column({ nullable: true })
    link: string;

    @ApiProperty({ description: 'Должность', example: 'Senior Backend Developer' })
    @Column({ nullable: true })
    specialization: string | null;

    @ApiProperty({ description: 'График работы', required: false, example: 'Полная занятость' })
    @Column({ nullable: true })
    workTime?: string;

    @ApiProperty({ description: 'Название изображения', example: 'company_image' })
    @Column({ nullable: true })
    imgName: string;

    @ApiProperty({ description: 'Массив изображений', type: [String], required: false, example: ['work1.jpg', 'work2.jpg'] })
    @Column('simple-array', { nullable: true })
    images?: string[];

    @ApiProperty({ description: 'Тип опыта', example: 'work' })
    @Column({ default: 'work', nullable: true })
    type: string;
}