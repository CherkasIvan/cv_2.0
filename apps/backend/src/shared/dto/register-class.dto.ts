// shared/dto/register-class.dto.ts
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterClassDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    loginEmail: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    password: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    lastName: string;

    @ApiProperty({ example: ['Developer'] })
    @IsArray()
    @IsOptional()
    positions?: string[];

    @ApiProperty({ example: ['user@example.com'] })
    @IsArray()
    @IsOptional()
    emails?: string[];

    @ApiProperty({ example: ['+1234567890'] })
    @IsArray()
    @IsOptional()
    phones?: string[];

    @ApiProperty({ example: ['New York'] })
    @IsArray()
    @IsOptional()
    locations?: string[];

    @ApiProperty({ example: 'http://example.com/avatar.jpg' })
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiProperty({ example: 'Bio' })
    @IsString()
    @IsOptional()
    bio?: string;
}
