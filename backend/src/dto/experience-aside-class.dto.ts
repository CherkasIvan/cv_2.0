import { ApiProperty } from '@nestjs/swagger';

export class ExperienceAsideClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 'exp_aside1' 
    })
    id: string;

    @ApiProperty({ 
        description: 'Заголовок опыта', 
        example: 'Работа' 
    })
    title: string;

    @ApiProperty({ 
        description: 'Значение опыта', 
        example: '5+ лет в веб-разработке' 
    })
    value: string;

    @ApiProperty({ 
        description: 'Название изображения', 
        required: false,
        example: 'work_icon' 
    })
    imgName?: string;

    @ApiProperty({ 
        description: 'Массив изображений', 
        type: [String],
        required: false,
        example: ['exp1.jpg', 'exp2.jpg'] 
    })
    images?: string[];
}