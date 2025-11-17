import { ApiProperty } from '@nestjs/swagger';

export class HardSkillsNavigationClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 'hard_skill1' 
    })
    id: string;

    @ApiProperty({ 
        description: 'URL ссылки', 
        example: '/skills/backend' 
    })
    link: string;

    @ApiProperty({ 
        description: 'Название навыка', 
        example: 'Backend разработка' 
    })
    value: string;

    @ApiProperty({ 
        description: 'Название изображения', 
        required: false,
        example: 'backend_skill' 
    })
    imgName?: string;

    @ApiProperty({ 
        description: 'Массив изображений', 
        type: [String],
        required: false,
        example: ['skill1.png', 'skill2.png'] 
    })
    images?: string[];
}