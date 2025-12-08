import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    ParseIntPipe, 
    Post, 
    Put, 
    UseGuards 
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@core/guard/jwt-auth/jwt-auth.guard';

import { PersonResponseClassDto } from '@shared/dto/person-response-class.dto';
import { RegisterClassDto } from '@shared/dto/register-class.dto';

import { PersonService } from '../service/person.service';

@ApiTags('persons')
@Controller('persons')
export class PersonController {
    constructor(private readonly personsService: PersonService) {}

    @Get()
    @ApiOperation({ summary: 'Получить всех персон' })
    @ApiResponse({
        status: 200,
        description: 'Список всех персон',
        type: [PersonResponseClassDto],
    })
    async findAll(): Promise<PersonResponseClassDto[]> {
        return this.personsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить персону по ID' })
    @ApiResponse({
        status: 200,
        description: 'Персона успешно найдена',
        type: PersonResponseClassDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Персона не найдена',
    })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<PersonResponseClassDto> {
        return this.personsService.findById(id);
    }

    @Get('email/:email')
    @ApiOperation({ summary: 'Получить персону по email' })
    @ApiResponse({
        status: 200,
        description: 'Персона успешно найдена',
        type: PersonResponseClassDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Персона не найдена',
    })
    async findByEmail(
        @Param('email') email: string,
    ): Promise<PersonResponseClassDto> {
        return this.personsService.findByEmail(email);
    }

    @Post()
    @ApiOperation({ summary: 'Создать новую персону' })
    @ApiResponse({
        status: 201,
        description: 'Персона успешно создана',
        type: PersonResponseClassDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Неверные данные',
    })
    async create(
        @Body() createPersonDto: RegisterClassDto,
    ): Promise<PersonResponseClassDto> {
        return this.personsService.create(createPersonDto);
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Обновить персону' })
    @ApiResponse({
        status: 200,
        description: 'Персона успешно обновлена',
        type: PersonResponseClassDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Персона не найдена',
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePersonDto: Partial<RegisterClassDto>,
    ): Promise<PersonResponseClassDto> {
        return this.personsService.update(id, updatePersonDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Удалить персону' })
    @ApiResponse({
        status: 200,
        description: 'Персона успешно удалена',
    })
    @ApiResponse({
        status: 404,
        description: 'Персона не найдена',
    })
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.personsService.delete(id);
    }

    @Post(':id/deactivate')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Деактивировать персону' })
    @ApiResponse({
        status: 200,
        description: 'Персона успешно деактивирована',
        type: PersonResponseClassDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Персона не найдена',
    })
    async deactivate(@Param('id', ParseIntPipe) id: number): Promise<PersonResponseClassDto> {
        return this.personsService.update(id, { isActive: false });
    }

    @Post(':id/activate')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Активировать персону' })
    @ApiResponse({
        status: 200,
        description: 'Персона успешно активирована',
        type: PersonResponseClassDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Персона не найдена',
    })
    async activate(@Param('id', ParseIntPipe) id: number): Promise<PersonResponseClassDto> {
        return this.personsService.update(id, { 
            isActive: true,
            failedLoginAttempts: 0,
            lockedUntil: null 
        });
    }
}