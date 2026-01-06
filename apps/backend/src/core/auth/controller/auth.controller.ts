import { JwtAuthGuard } from '@core/guard/jwt-auth/jwt-auth.guard';

import { GuestLoginResponseClassDto } from '@shared/dto/guest-login-response-class.dto';
import { LoginClassDto } from '@shared/dto/login-class.dto';
import { LoginResponseClassDto } from '@shared/dto/login-response-class.dto';
import { RefreshTokenDto } from '@shared/dto/refresh-token.dto';
import { RegisterClassDto } from '@shared/dto/register-class.dto';

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { AuthService } from '../service/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get()
    @ApiOperation({
        summary: 'Информация о модуле аутентификации',
        description:
            'Возвращает информацию о доступных эндпоинтах аутентификации',
    })
    @ApiResponse({
        status: 200,
        description: 'Информация о модуле',
    })
    async getAuthInfo(): Promise<{
        message: string;
        endpoints: string[];
        timestamp: string;
    }> {
        return {
            message: 'Модуль аутентификации CV Portfolio API',
            endpoints: [
                'POST /auth/login - Аутентификация пользователя',
                'POST /auth/register - Регистрация пользователя',
                'POST /auth/guest-login - Гостевая аутентификация',
                'POST /auth/logout - Выход из системы',
                'POST /auth/refresh - Обновление токена',
                'GET /auth/profile - Получить профиль',
                'GET /auth/validate - Проверка токена',
            ],
            timestamp: new Date().toISOString(),
        };
    }

    @Get('health')
    @ApiOperation({
        summary: 'Проверка работоспособности модуля аутентификации',
        description: 'Health check endpoint для мониторинга состояния сервиса',
    })
    @ApiResponse({
        status: 200,
        description: 'Модуль работает корректно',
        schema: {
            example: {
                status: 'healthy',
                service: 'authentication',
                timestamp: '2024-01-15T10:30:00.000Z',
            },
        },
    })
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
    } {
        return {
            status: 'healthy',
            service: 'authentication',
            timestamp: new Date().toISOString(),
        };
    }

    @Post('login')
    @ApiOperation({
        summary: 'Аутентификация пользователя',
        description: 'Вход пользователя с использованием email и пароля',
    })
    @ApiBody({ type: LoginClassDto })
    @ApiResponse({
        status: 200,
        description: 'Успешная аутентификация',
        type: LoginResponseClassDto,
    })
    @ApiResponse({
        status: 400,
        description:
            'Неверные учетные данные или отсутствуют обязательные поля',
    })
    @ApiResponse({
        status: 401,
        description: 'Неверный email или пароль',
    })
    async login(@Body() user: LoginClassDto): Promise<LoginResponseClassDto> {
        return this.authService.login(user);
    }

    @Post('register')
    @ApiOperation({
        summary: 'Регистрация пользователя',
        description: 'Создание нового аккаунта пользователя',
    })
    @ApiBody({ type: RegisterClassDto })
    @ApiResponse({
        status: 201,
        description: 'Успешная регистрация',
        type: LoginResponseClassDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Пользователь с таким email уже существует',
    })
    async register(
        @Body() registerData: RegisterClassDto,
    ): Promise<LoginResponseClassDto> {
        return this.authService.register(registerData);
    }

    @Post('guest-login')
    @ApiOperation({
        summary: 'Гостевая аутентификация',
        description: 'Создание временной гостевой сессии без регистрации',
    })
    @ApiResponse({
        status: 201,
        description: 'Гостевая сессия успешно создана',
        type: GuestLoginResponseClassDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Ошибка создания гостевой сессии',
    })
    async guestLogin(): Promise<GuestLoginResponseClassDto> {
        return this.authService.guestLogin();
    }

    @Post('logout')
    @ApiOperation({
        summary: 'Выход из системы',
        description: 'Завершение сессии пользователя',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Успешный выход из системы',
    })
    @ApiResponse({
        status: 401,
        description: 'Пользователь не аутентифицирован',
    })
    async logout(@Req() req: any): Promise<{ message: string }> {
        return this.authService.logout(req.user);
    }

    @Post('refresh')
    @ApiOperation({
        summary: 'Обновление токена',
        description: 'Обновление JWT токена с использованием refresh token',
    })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({
        status: 200,
        description: 'Токен успешно обновлен',
        type: LoginResponseClassDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Невалидный refresh token',
    })
    async refreshToken(
        @Body() refreshTokenDto: RefreshTokenDto,
    ): Promise<LoginResponseClassDto> {
        return this.authService.refreshToken(refreshTokenDto.token);
    }

    @Get('profile')
    @ApiOperation({
        summary: 'Получить профиль пользователя',
        description:
            'Получение данных текущего аутентифицированного пользователя',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Профиль пользователя',
        type: LoginResponseClassDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Пользователь не аутентифицирован',
    })
    async getProfile(@Req() req: any): Promise<LoginResponseClassDto> {
        return this.authService.getProfile(req.user);
    }

    @Get('validate')
    @ApiOperation({
        summary: 'Проверка валидности токена',
        description: 'Проверка действительности JWT токена',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Токен валиден',
    })
    @ApiResponse({
        status: 401,
        description: 'Токен невалиден',
    })
    async validateToken(): Promise<{ valid: boolean }> {
        return { valid: true };
    }
}
