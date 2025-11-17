import { ApiProperty } from '@nestjs/swagger';

export class NavigationClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 'nav1' 
    })
    id: string;

    @ApiProperty({ 
        description: 'URL ссылки', 
        example: '/about' 
    })
    link: string;

    @ApiProperty({ 
        description: 'Позиция в навигации', 
        example: 1 
    })
    position: number;

    @ApiProperty({ 
        description: 'Текст ссылки', 
        example: 'Обо мне' 
    })
    value: string;

    @ApiProperty({ 
        description: 'Название изображения', 
        required: false,
        example: 'about_icon' 
    })
    imgName?: string;

    @ApiProperty({ 
        description: 'Массив изображений', 
        type: [String],
        required: false,
        example: ['image1.jpg', 'image2.jpg'] 
    })
    images?: string[];
}