import { Repository } from 'typeorm';

import { PersonResponseClassDto } from '@shared/dto/person-response-class.dto';
import { PersonEntity } from '@shared/entities/person.entity';

import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PersonService {
    constructor(
        @InjectRepository(PersonEntity)
        private readonly personRepository: Repository<PersonEntity>,
    ) {}

    // Получить всех пользователей (без паролей)
    async findAll(): Promise<PersonResponseClassDto[]> {
        const users = await this.personRepository.find();
        return users.map((user) => new PersonResponseClassDto(user));
    }

    // Найти пользователя по ID
    async findById(id: number): Promise<PersonResponseClassDto> {
        const user = await this.personRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }
        return new PersonResponseClassDto(user);
    }

    // Найти пользователя по email
    async findByEmail(email: string): Promise<PersonResponseClassDto> {
        const user = await this.personRepository.findOne({
            where: { loginEmail: email },
        });
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }
        return new PersonResponseClassDto(user);
    }

    // Создать пользователя
    async create(
        userData: Partial<PersonEntity>,
    ): Promise<PersonResponseClassDto> {
        // Проверяем, существует ли пользователь с таким email
        const existingUser = await this.personRepository.findOne({
            where: { loginEmail: userData.loginEmail },
        });

        if (existingUser) {
            throw new BadRequestException(
                'Пользователь с таким email уже существует',
            );
        }

        const user = this.personRepository.create(userData);
        await this.personRepository.save(user);
        return new PersonResponseClassDto(user);
    }

    // Обновить пользователя
    async update(
        id: number,
        updateData: Partial<PersonEntity>,
    ): Promise<PersonResponseClassDto> {
        const user = await this.personRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        // Если обновляется email, проверяем уникальность
        if (
            updateData.loginEmail &&
            updateData.loginEmail !== user.loginEmail
        ) {
            const existingUser = await this.personRepository.findOne({
                where: { loginEmail: updateData.loginEmail },
            });
            if (existingUser) {
                throw new BadRequestException(
                    'Пользователь с таким email уже существует',
                );
            }
        }

        await this.personRepository.update(id, updateData);
        return this.findById(id);
    }

    // Удалить пользователя
    async delete(id: number): Promise<void> {
        const user = await this.personRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }
        await this.personRepository.delete(id);
    }

    // Проверить пароль (для аутентификации)
    async validateUserPassword(
        email: string,
        password: string,
    ): Promise<PersonResponseClassDto | null> {
        const user = await this.personRepository.findOne({
            where: { loginEmail: email },
        });

        if (user && user.password && (await user.validatePassword(password))) {
            return new PersonResponseClassDto(user);
        }
        return null;
    }

    // Получить пользователей по роли
    async findByRole(role: string): Promise<PersonResponseClassDto[]> {
        const users = await this.personRepository
            .createQueryBuilder('person')
            .where(':role = ANY(person.roles)', { role })
            .getMany();

        return users.map((user) => new PersonResponseClassDto(user));
    }

    // Сбросить пароль
    async resetPassword(id: number, newPassword: string): Promise<void> {
        const user = await this.personRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        user.password = newPassword;
        await this.personRepository.save(user);
    }

    private parseJsonField(field: string): any[] {
        try {
            return JSON.parse(field);
        } catch {
            return [];
        }
    }
}
