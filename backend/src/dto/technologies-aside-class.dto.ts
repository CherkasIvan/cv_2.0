import { ApiProperty } from '@nestjs/swagger';

export class TechnologiesAsideClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 'tech_aside1' 
    })
    id: string;

    @ApiProperty({ 
        description: 'Заголовок технологии', 
        example: 'Backend' 
    })
    title: string;

    @ApiProperty({ 
        description: 'Значение технологии', 
        example: 'Node.js, NestJS, PostgreSQL' 
    })
    value: string;

    @ApiProperty({ 
        description: 'Название изображения', 
        required: false,
        example: 'backend_icon' 
    })
    imgName?: string;

    @ApiProperty({ 
        description: 'Массив изображений', 
        type: [String],
        required: false,
        example: ['backend1.png', 'backend2.png'] 
    })
    images?: string[];
}