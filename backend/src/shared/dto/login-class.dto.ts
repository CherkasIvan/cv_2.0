// src/shared/dto/login-class.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginClassDto {
    @ApiProperty({
        description: 'Email пользователя',
        example: 'user@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    loginEmail: string;

    @ApiProperty({
        description: 'Пароль пользователя',
        example: 'securePassword123',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
