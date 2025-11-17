import { ApiProperty } from '@nestjs/swagger';

export class TechnologiesClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 'tech1' 
    })
    id: string;

    @ApiProperty({ 
        description: 'Альтернативный текст', 
        example: 'Node.js логотип' 
    })
    alt: string;

    @ApiProperty({ 
        description: 'Путь к иконке', 
        example: 'technologies/nodejs.png' 
    })
    iconPath: string;

    @ApiProperty({ 
        description: 'Ссылка на технологию', 
        example: 'https://nodejs.org' 
    })
    link: string;

    @ApiProperty({ 
        description: 'Название технологии', 
        example: 'Node.js' 
    })
    technologyName: string;

    @ApiProperty({ 
        description: 'Название изображения', 
        example: 'nodejs_logo' 
    })
    imgName: string;

    @ApiProperty({ 
        description: 'Массив изображений', 
        type: [String],
        required: false,
        example: ['node1.png', 'node2.png'] 
    })
    images?: string[];
}