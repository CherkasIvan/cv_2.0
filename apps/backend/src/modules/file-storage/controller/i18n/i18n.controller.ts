import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { I18nService } from '../../service/i18n/i18n.service';

@ApiTags('Translations')
@Controller('i18n')
export class I18nController {
  private readonly logger = new Logger(I18nController.name);

  constructor(private readonly i18nService: I18nService) {
    this.logger.log('I18nController initialized');
  }

  @Get('test')
  @Public()
  @ApiOperation({ summary: 'Test endpoint' })
  test() {
    return { message: 'I18n controller is working!' };
  }

  @Get('languages')
  @Public()
  @ApiOperation({ summary: 'Get available languages' })
  async getLanguages(): Promise<string[]> {
    return this.i18nService.getAvailableLanguages();
  }

  @Get(':lang/frontend')
  @Public()
  @ApiOperation({ summary: 'Get translations for frontend use' })
  async getFrontendTranslations(@Param('lang') lang: string): Promise<any> {
    this.logger.log(`GET /i18n/${lang}/frontend called`);
    
    try {
      const translations = await this.i18nService.getFrontendTranslations(lang);
      return translations;
    } catch (error) {
      this.logger.error(`Error getting frontend translations for ${lang}:`, error);
      
      // Fallback translations
      return {
        header: {
          title: "Тестовый заголовок",
          subtitle: "Тестовый подзаголовок"
        },
        menu: {
          home: "Главная",
          about: "О нас"
        }
      };
    }
  }

  @Get(':lang')
  @Public()
  @ApiOperation({ summary: 'Get all translations for language' })
  async getAllTranslations(
    @Param('lang') lang: string,
    @Query('flat') flat?: boolean
  ): Promise<any> {
    return this.i18nService.getAllTranslations(lang, flat === true);
  }

  @Get(':lang/key/:key')
  @Public()
  @ApiOperation({ summary: 'Get specific translation key' })
  async getTranslation(
    @Param('lang') lang: string,
    @Param('key') key: string
  ): Promise<{ value: string; module: string }> {
    const result = await this.i18nService.getTranslation(lang, key);
    if (!result) {
      return { value: '', module: '' };
    }
    return result;
  }

  @Get(':lang/stats')
  @Public()
  @ApiOperation({ summary: 'Get language statistics' })
  async getLanguageStats(@Param('lang') lang: string): Promise<any> {
    return this.i18nService.getLanguageStats(lang);
  }

  @Get(':lang/modules')
  @Public()
  @ApiOperation({ summary: 'Get available modules for language' })
  async getModules(@Param('lang') lang: string): Promise<string[]> {
    return this.i18nService.getAvailableModules(lang);
  }

  @Get(':lang/:module')
  @Public()
  @ApiOperation({ summary: 'Get translations for specific module' })
  async getModuleTranslations(
    @Param('lang') lang: string,
    @Param('module') module: string,
    @Query('format') format?: string
  ): Promise<any> {
    const flatFormat = format === 'flat';
    return this.i18nService.getModuleTranslations(lang, module, flatFormat);
  }
}