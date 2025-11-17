import { ApiProperty } from '@nestjs/swagger';

export class ThemelessPicturesClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 'pic1' 
    })
    id: string;

    @ApiProperty({ 
        description: 'Название изображения', 
        required: false,
        example: 'Декоративное изображение' 
    })
    name?: string;

    @ApiProperty({ 
        description: 'Путь к иконке для темной темы', 
        required: false,
        example: 'icons/dark_icon.png' 
    })
    darkModeIconPath?: string;

    @ApiProperty({ 
        description: 'Путь к иконке для светлой темы', 
        required: false,
        example: 'icons/light_icon.png' 
    })
    whiteModeIconPath?: string;

    @ApiProperty({ 
        description: 'Путь к изображению', 
        required: false,
        example: 'images/decorative.jpg' 
    })
    imgSrc?: string;

    @ApiProperty({ 
        description: 'Альтернативный текст', 
        required: false,
        example: 'Декоративное изображение' 
    })
    alt?: string;
}