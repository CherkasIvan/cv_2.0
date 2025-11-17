import { ApiProperty } from '@nestjs/swagger';

export class PersonClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 'person1' 
    })
    id: string;

    @ApiProperty({ 
        description: 'Имя человека', 
        example: 'Иван Иванов' 
    })
    name: string;

    @ApiProperty({ 
        description: 'Должность', 
        example: 'Full-stack разработчик' 
    })
    position: string;

    @ApiProperty({ 
        description: 'Email', 
        example: 'ivan@example.com' 
    })
    email: string;

    @ApiProperty({ 
        description: 'Телефон', 
        required: false,
        example: '+7 999 123-45-67' 
    })
    phone?: string;

    @ApiProperty({ 
        description: 'URL аватара', 
        required: false,
        example: 'images/avatar.jpg' 
    })
    avatar?: string;

    @ApiProperty({ 
        description: 'Биография', 
        required: false,
        example: 'Опытный разработчик с 5+ лет опыта...' 
    })
    bio?: string;

    @ApiProperty({ 
        description: 'Местоположение', 
        required: false,
        example: 'Москва, Россия' 
    })
    location?: string;
}