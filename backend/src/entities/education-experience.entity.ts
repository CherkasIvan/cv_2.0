// entities/education-experience.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('education_experience')
export class EducationExperienceEntity {
    @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Путь к логотипу', required: false, example: 'images/logo.png' })
    @Column({ nullable: true })
    logoPath?: string;

    @ApiProperty({ description: 'Альтернативный текст', required: false, example: 'Логотип университета' })
    @Column({ nullable: true })
    alt?: string;

    @ApiProperty({ description: 'Путь к иконке', required: false, example: 'icons/icon.png' })
    @Column({ nullable: true })
    iconPath?: string;

    @ApiProperty({ description: 'Название учебного заведения', example: 'Московский Государственный Университет' })
    @Column({ nullable: true })
    company: string;

    @ApiProperty({ description: 'Дата начала обучения', example: 'Сентябрь 2018' })
    @Column({ name: 'from', nullable: true })
    from: string;

    @ApiProperty({ description: 'Дата окончания обучения', example: 'Июнь 2022' })
    @Column({ name: 'to', nullable: true })
    to: string;

    @ApiProperty({ description: 'Местоположение', example: 'Москва, Россия' })
    @Column({ nullable: true })
    place: string;

    @ApiProperty({ description: 'Ссылка на сайт', example: 'https://university.example.com' })
    @Column({ nullable: true })
    link: string;

    @ApiProperty({ description: 'Специализация', example: 'Компьютерные науки' })
    @Column({ nullable: true })
    specialization: string;

    @ApiProperty({ description: 'Формат обучения', required: false, example: 'Очная форма' })
    @Column({ nullable: true })
    workTime?: string;

    @ApiProperty({ description: 'Название изображения', example: 'university_logo' })
    @Column({ nullable: true })
    imgName: string;

    @ApiProperty({ description: 'Массив изображений', type: [String], required: false, example: ['image1.jpg', 'image2.jpg'] })
    @Column('simple-array', { nullable: true })
    images?: string[];

    @ApiProperty({ description: 'Тип опыта', example: 'education' })
    @Column({ default: 'education', nullable: true })
    type: string;
}