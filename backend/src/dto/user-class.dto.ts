import { ApiProperty } from '@nestjs/swagger';

export class UserClassDto {
    @ApiProperty({ 
        description: 'Firebase UID', 
        example: 'abc123def456' 
    })
    uid: string;

    @ApiProperty({ 
        description: 'Email пользователя', 
        example: 'user@example.com' 
    })
    email: string;

    @ApiProperty({ 
        description: 'Отображаемое имя', 
        required: false,
        example: 'Иван Иванов' 
    })
    displayName?: string;

    @ApiProperty({ 
        description: 'URL фотографии', 
        required: false,
        example: 'https://example.com/photo.jpg' 
    })
    photoURL?: string;

    @ApiProperty({ 
        description: 'Дата создания аккаунта', 
        required: false,
        example: '2023-01-15T10:30:00.000Z' 
    })
    createdAt?: string;

    @ApiProperty({ 
        description: 'Дата последнего входа', 
        required: false,
        example: '2024-01-15T10:30:00.000Z' 
    })
    lastLoginAt?: string;
}