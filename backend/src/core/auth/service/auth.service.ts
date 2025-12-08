import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

import { GuestLoginResponseClassDto } from '@shared/dto/guest-login-response-class.dto';
import { LoginClassDto } from '@shared/dto/login-class.dto';
import { LoginResponseClassDto } from '@shared/dto/login-response-class.dto';
import { RegisterClassDto } from '@shared/dto/register-class.dto';
import { PersonEntity } from '@shared/entities/person.entity';
import { PersonSessionEntity } from '@shared/entities/person-session.entity';
import { PersonSessionService } from 'src/modules/person/service/person-session/person-session.service';


interface JwtPayload {
    sub: number;
    email: string;
    roles: string[];
    sessionId: number;
    // Remove accessToken from here as it's not needed in the payload
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(PersonEntity)
        private readonly personRepository: Repository<PersonEntity>,
        @InjectRepository(PersonSessionEntity)
        private readonly sessionRepository: Repository<PersonSessionEntity>,
        private readonly jwtService: JwtService,
        private readonly personSessionService: PersonSessionService,
    ) {}

    async register(
        registerData: RegisterClassDto,
        req?: Request,
    ): Promise<LoginResponseClassDto> {
        const {
            loginEmail,
            password,
            firstName,
            lastName,
            positions,
            emails,
            phones,
            locations,
            avatar,
            bio,
        } = registerData;

        if (!loginEmail || !password) {
            throw new BadRequestException('Email и пароль обязательны');
        }

        // Проверяем, существует ли пользователь
        const existingPerson = await this.personRepository.findOne({
            where: { loginEmail },
        });

        if (existingPerson) {
            throw new BadRequestException(
                'Пользователь с таким email уже существует',
            );
        }

        // Создаем нового пользователя
        const person = this.personRepository.create({
            firstName,
            lastName,
            loginEmail,
            password,
            emails: emails || [loginEmail],
            positions: positions || [],
            phones: phones || [],
            locations: locations || [],
            isActive: true,
            roles: ['user'],
            avatar: avatar || '',
            bio: bio || '',
        });

        await this.personRepository.save(person);

        // Создаем сессию для пользователя
        const session = await this.createUserSession(person, req);

        return {
            user: this.mapPersonToResponse(person),
            token: session.accessToken,
            refreshToken: session.refreshToken,
        };
    }

    async login(user: LoginClassDto, req?: Request): Promise<LoginResponseClassDto> {
        const { loginEmail, password } = user;

        if (!loginEmail || !password) {
            throw new BadRequestException('Email и пароль обязательны');
        }

        // Ищем пользователя по loginEmail
        const person = await this.personRepository.findOne({
            where: { loginEmail },
        });

        if (!person) {
            throw new UnauthorizedException('Неверный email или пароль');
        }

        // Проверяем, может ли пользователь логиниться
        const canLogin = person.canLogin();
        if (!canLogin.canLogin) {
            throw new UnauthorizedException(canLogin.reason);
        }

        // Проверяем пароль
        const isValidPassword = await person.validatePassword(password);
        if (!isValidPassword) {
            // Увеличиваем счетчик неудачных попыток
            person.incrementFailedAttempts();
            await this.personRepository.save(person);
            throw new UnauthorizedException('Неверный email или пароль');
        }

        // Сбрасываем счетчик неудачных попыток и обновляем lastLoginAt
        person.resetFailedAttempts();
        person.lastLoginAt = new Date();
        await this.personRepository.save(person);

        // Создаем сессию для пользователя
        const session = await this.createUserSession(person, req);

        return {
            user: this.mapPersonToResponse(person),
            token: session.accessToken,
            refreshToken: session.refreshToken,
        };
    }

    async guestLogin(req?: Request): Promise<GuestLoginResponseClassDto> {
        // Создаем гостевую запись
        const guestPerson = this.personRepository.create({
            firstName: 'Гость',
            lastName: 'Пользователь',
            loginEmail: `guest_${Date.now()}@temp.com`,
            password: 'temporary_password',
            isActive: true,
            roles: ['guest'],
            isAdmin: false,
            positions: ['Гость'],
            emails: [],
            phones: [],
            locations: [],
        });

        await this.personRepository.save(guestPerson);

        // Создаем сессию для гостя
        const session = await this.createUserSession(guestPerson, req);

        return {
            user: this.mapPersonToResponse(guestPerson),
            token: session.accessToken,
            refreshToken: session.refreshToken,
        };
    }

    async logout(sessionId: number): Promise<{ message: string }> {
        await this.personSessionService.deactivateSession(sessionId);
        return { message: 'Успешный выход из системы' };
    }

    async refreshToken(refreshToken: string, req?: Request): Promise<LoginResponseClassDto> {
        // Ищем активную сессию по refresh token
        const session = await this.personSessionService.findActiveSessionByRefreshToken(refreshToken);
        
        if (!session) {
            throw new UnauthorizedException('Невалидный refresh token');
        }

        // Деактивируем старую сессию
        await this.personSessionService.deactivateSession(session.id);

        // Создаем новую сессию
        const newSession = await this.createUserSession(session.person, req);

        return {
            user: this.mapPersonToResponse(session.person),
            token: newSession.accessToken,
            refreshToken: newSession.refreshToken,
        };
    }

    async getProfile(sessionId: number): Promise<LoginResponseClassDto> {
        const session = await this.personSessionService.findSessionById(sessionId);

        if (!session || !session.isActive) {
            throw new UnauthorizedException('Сессия не найдена или неактивна');
        }

        // Обновляем время последней активности
        await this.personSessionService.updateLastActivity(sessionId);

        return {
            user: this.mapPersonToResponse(session.person),
            token: session.accessToken,
            refreshToken: '', // Не возвращаем refresh token для безопасности
        };
    }

private async createUserSession(person: PersonEntity, req?: Request): Promise<PersonSessionEntity> {
    const accessTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Generate refresh token first
    const refreshToken = this.jwtService.sign({
        sub: person.id,
        type: 'refresh',
    }, { expiresIn: '7d' });

    // Create session in database first
    const session = await this.personSessionService.createSession(
        person.id,
        '', // Temporary empty access token
        refreshToken,
        accessTokenExpires,
        refreshTokenExpires,
        req?.ip,
        req?.headers['user-agent'],
    );

    // Generate access token with the real sessionId
    const accessToken = this.jwtService.sign({
        sub: person.id,
        email: person.loginEmail,
        roles: person.roles,
        sessionId: session.id,
    });

    // Update session with the final access token
    await this.sessionRepository.update(session.id, {
        accessToken: accessToken,
    });

    session.accessToken = accessToken;
    return session;
}

    private mapPersonToResponse(person: PersonEntity): any {
        return {
            id: person.id,
            loginEmail: person.loginEmail,
            name: person.name,
            avatar: person.avatar,
            roles: person.roles,
            emails: person.emails,
            positions: person.positions,
        };
    }

    // 🎯 Дополнительные методы
    async checkUserExists(email: string): Promise<boolean> {
        const user = await this.personRepository.findOne({
            where: { loginEmail: email }
        });
        return !!user;
    }

    async changePassword(
        userId: number, 
        currentPassword: string, 
        newPassword: string
    ): Promise<{ success: boolean; message: string }> {
        const user = await this.personRepository.findOne({ where: { id: userId } });
        
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const isCurrentPasswordValid = await user.validatePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            throw new BadRequestException('Текущий пароль неверен');
        }

        user.password = newPassword;
        await this.personRepository.save(user);

        return { success: true, message: 'Пароль успешно изменен' };
    }

// 🎯 Методы для JWT стратегии
async validateUser(payload: JwtPayload): Promise<any> {
    // Use sessionId from JWT payload to find the session
    const session = await this.personSessionService.findSessionById(payload.sessionId);
    
    if (!session || !session.isActive) {
        return null;
    }

    // Check if access token is expired
    if (session.accessTokenExpires < new Date()) {
        await this.personSessionService.deactivateSession(session.id);
        return null;
    }

    // Обновляем время последней активности
    await this.personSessionService.updateLastActivity(session.id);

    return {
        userId: session.person.id,
        email: session.person.loginEmail,
        roles: session.person.roles,
        sessionId: session.id,
    };
}
    async validateUserByEmailAndPassword(
        email: string,
        password: string,
    ): Promise<any> {
        const person = await this.personRepository.findOne({
            where: { loginEmail: email },
        });

        if (!person) {
            return null;
        }

        const isValidPassword = await person.validatePassword(password);
        if (!isValidPassword) {
            return null;
        }

        return {
            userId: person.id,
            email: person.loginEmail,
            roles: person.roles,
        };
    }

    async validateSession(accessToken: string): Promise<boolean> {
        const session = await this.personSessionService.findActiveSessionByAccessToken(accessToken);
        return !!session;
    }
}