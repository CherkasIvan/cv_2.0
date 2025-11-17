import { ApiProperty } from '@nestjs/swagger';

export class WorkExperienceClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 'exp1' 
    })
    id: string;

    @ApiProperty({ 
        description: 'Путь к логотипу', 
        example: 'images/company_logo.png' 
    })
    logoPath: string;

    @ApiProperty({ 
        description: 'Альтернативный текст', 
        required: false,
        example: 'Логотип компании' 
    })
    alt?: string;

    @ApiProperty({ 
        description: 'Путь к иконке', 
        required: false,
        example: 'icons/company_icon.png' 
    })
    iconPath?: string;

    @ApiProperty({ 
        description: 'Название компании/учебного заведения', 
        example: 'Google Inc.' 
    })
    company: string;

    @ApiProperty({ 
        description: 'Дата начала', 
        example: 'Январь 2020' 
    })
    from: string;

    @ApiProperty({ 
        description: 'Дата окончания', 
        example: 'Декабрь 2023' 
    })
    to: string;

    @ApiProperty({ 
        description: 'Местоположение', 
        example: 'Москва, Россия' 
    })
    place: string;

    @ApiProperty({ 
        description: 'Ссылка на сайт', 
        example: 'https://company.example.com' 
    })
    link: string;

    @ApiProperty({ 
        description: 'Специализация/должность', 
        example: 'Senior Backend Developer' 
    })
    specialization: string;

    @ApiProperty({ 
        description: 'График работы/обучения', 
        required: false,
        example: 'Полная занятость' 
    })
    workTime?: string;

    @ApiProperty({ 
        description: 'Название изображения', 
        example: 'company_image' 
    })
    imgName: string;

    @ApiProperty({ 
        description: 'Массив изображений', 
        type: [String],
        required: false,
        example: ['work1.jpg', 'work2.jpg'] 
    })
    images?: string[];
}