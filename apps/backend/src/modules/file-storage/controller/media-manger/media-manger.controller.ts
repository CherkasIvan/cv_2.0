import { Response } from 'express';

import { JwtAuthGuard } from '@core/guard/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '@core/guard/roles/roles.guard';

import { Public } from '@common/decorators/public.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import {
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Post,
    Query,
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { FileStorageService } from '../../service/file-storage/file-storage.service';

@ApiTags('Media')
@Controller('media-manager')
export class MediaManagerController {
    constructor(private readonly fileStorageService: FileStorageService) {}

    // ... остальные методы без изменений

    @Get('file/*path') // Изменено с :path(*) на *path
    @Public()
    @ApiOperation({ summary: 'Получить файл' })
    @ApiResponse({ status: 200, description: 'Файл' })
    async getFile(
        @Param('path') path: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const metadata = await this.fileStorageService.getFileMetadata(path);

        res.set({
            'Content-Type': metadata.mimeType,
            'Content-Length': metadata.size.toString(),
            'Content-Disposition': `inline; filename="${metadata.filename}"`,
            'Cache-Control': 'public, max-age=31536000',
        });

        const stream = await this.fileStorageService.getFileStream(path);
        return new StreamableFile(stream);
    }

    @Get('thumbnail/*path') // Изменено с :path(*) на *path
    @Public()
    @ApiOperation({ summary: 'Получить превью файла' })
    @ApiResponse({ status: 200, description: 'Превью файла' })
    async getThumbnail(
        @Param('path') path: string,
        @Res({ passthrough: true }) res: Response,
        @Query('width') width?: string,
        @Query('height') height?: string,
    ) {
        const widthNum = width ? parseInt(width, 10) : 200;
        const heightNum = height ? parseInt(height, 10) : undefined;

        const thumbnail = await this.fileStorageService.getThumbnail(
            path,
            widthNum,
            heightNum,
        );

        res.set({
            'Content-Type': 'image/jpeg',
            'Content-Length': thumbnail.length.toString(),
            'Cache-Control': 'public, max-age=31536000',
        });

        return thumbnail;
    }

    @Delete('file/*path') // Изменено с :path(*) на *path
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'editor')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удалить файл' })
    @ApiResponse({ status: 200, description: 'Файл удален' })
    async deleteFile(@Param('path') path: string) {
        await this.fileStorageService.deleteFile(path);
        return { success: true, message: 'File deleted successfully' };
    }

    @Get('resize/*path') // Изменено с :path(*) на *path
    @Public()
    @ApiOperation({ summary: 'Изменить размер изображения' })
    async resizeImage(
        @Param('path') path: string,
        @Res({ passthrough: true }) res: Response,
        @Query('width') width: string,
        @Query('height') height?: string,
    ) {
        const widthNum = parseInt(width, 10);
        const heightNum = height ? parseInt(height, 10) : undefined;

        const resized = await this.fileStorageService.resizeImage(
            path,
            widthNum,
            heightNum,
        );

        res.set({
            'Content-Type': 'image/jpeg',
            'Content-Length': resized.length.toString(),
            'Cache-Control': 'public, max-age=31536000',
        });

        return resized;
    }
}
