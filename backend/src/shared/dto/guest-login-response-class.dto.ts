import { ApiProperty } from '@nestjs/swagger';

export class GuestLoginResponseClassDto {
    @ApiProperty({ description: 'Данные гостевого пользователя' })
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
