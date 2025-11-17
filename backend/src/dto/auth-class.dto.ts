import { ApiProperty } from '@nestjs/swagger';

export class LoginClassDto {
    @ApiProperty({ 
        description: 'Email пользователя', 
        example: 'user@example.com',
        required: true 
    })
    email: string;

    @ApiProperty({ 
        description: 'Пароль пользователя', 
        example: 'password123',
        required: true 
    })
    password: string;
}

export class LoginResponseClassDto {
    @ApiProperty({ 
        description: 'Firebase UID пользователя', 
        example: 'abc123def456' 
    })
    uid: string;

    @ApiProperty({ 
        description: 'Email пользователя', 
        example: 'user@example.com' 
    })
    email: string;

    @ApiProperty({ 
        description: 'ID сессии', 
        example: 1 
    })
    sessionId: number;
}

export class GuestLoginResponseClassDto {
    @ApiProperty({ 
        description: 'Firebase UID гостя', 
        example: 'guest123' 
    })
    uid: string;

    @ApiProperty({ 
        description: 'JWT токен', 
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
    })
    token: string;

    @ApiProperty({ 
        description: 'ID сессии', 
        example: 2 
    })
    sessionId: number;
}