import { ApiProperty } from '@nestjs/swagger';

export class MainPageInfoClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 'main1' 
    })
    id: string;

    @ApiProperty({ 
        description: 'Текст при наведении на кнопку', 
        required: false,
        example: 'Посмотреть проекты' 
    })
    buttonHoverText?: string;

    @ApiProperty({ 
        description: 'Текст кнопки', 
        required: false,
        example: 'Мои работы' 
    })
    buttonText?: string;

    @ApiProperty({ 
        description: 'Описание на главной странице', 
        example: 'Full-stack разработчик с опытом создания веб-приложений' 
    })
    description: string;

    @ApiProperty({ 
        description: 'Имя', 
        example: 'Иван Иванов' 
    })
    name: string;

    @ApiProperty({ 
        description: 'Путь к основному изображению', 
        example: 'images/main_photo.jpg' 
    })
    imgSrc: string;

    @ApiProperty({ 
        description: 'Стек технологий', 
        example: 'JavaScript, TypeScript, React, Node.js' 
    })
    stack: string;

    @ApiProperty({ 
        description: 'Статус', 
        example: 'Открыт для предложений' 
    })
    status: string;

    @ApiProperty({ 
        description: 'Название изображения', 
        example: 'main_photo' 
    })
    imgName: string;

    @ApiProperty({ 
        description: 'Массив изображений', 
        type: [String],
        required: false,
        example: ['photo1.jpg', 'photo2.jpg'] 
    })
    images?: string[];
}