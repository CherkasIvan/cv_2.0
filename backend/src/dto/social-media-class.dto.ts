import { ApiProperty } from '@nestjs/swagger';

export class SocialMediaClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 'sm1' 
    })
    id: string;

    @ApiProperty({ 
        description: 'URL социальной сети', 
        example: 'https://github.com/username' 
    })
    link: string;

    @ApiProperty({ 
        description: 'Название социальной сети', 
        example: 'GitHub' 
    })
    value: string;

    @ApiProperty({ 
        description: 'Название изображения', 
        example: 'github_icon' 
    })
    imgName: string;

    @ApiProperty({ 
        description: 'Массив изображений', 
        type: [String],
        required: false,
        example: ['github.png'] 
    })
    images?: string[];
}