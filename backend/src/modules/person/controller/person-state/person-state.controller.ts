// modules/person/controller/person-state.controller.ts
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@core/guard/jwt-auth.guard';
import { PersonStateService } from '../../service/person-state/person-state.service';


@ApiTags('person')
@Controller('person')
export class PersonStateController {
    constructor(private readonly personStateService: PersonStateService) {}

    @Get('state')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Получить состояние пользователя' })
    @ApiResponse({ status: 200, description: 'Состояние пользователя' })
    async getPersonState(@Req() req: any) {
        const sessionId = req.person.sessionId;
        return await this.personStateService.getPersonState(sessionId);
    }

    @Post('state')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Сохранить состояние пользователя' })
    @ApiResponse({ status: 200, description: 'Состояние сохранено' })
    async setPersonState(@Req() req: any, @Body() state: any) {
        const sessionId = req.person.sessionId;
        await this.personStateService.setPersonState(sessionId, state);
        return { message: 'State saved successfully' };
    }

    @Post('clear-state')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Очистить состояние пользователя' })
    @ApiResponse({ status: 200, description: 'Состояние очищено' })
    async clearPersonState(@Req() req: any) {
        const sessionId = req.person.sessionId;
        await this.personStateService.clearPersonState(sessionId);
        return { message: 'State cleared successfully' };
    }
}