import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseClassDto {
    @ApiProperty({ description: 'Данные пользователя' })
    user: {
        id: number;
        loginEmail: string;
        name: string;
        avatar: string;
        roles: string[];
        emails: string[];
        positions: string[];
    };

    @ApiProperty({ description: 'Токен аутентификации' })
    token: string;

    @ApiProperty({ description: 'Refresh token для обновления' })
    refreshToken: string;
}
