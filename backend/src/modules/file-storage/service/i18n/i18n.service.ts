import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as flat from 'flat';

@Injectable()
export class I18nService {
  private readonly logger = new Logger(I18nService.name);
  private readonly translationsPath: string;

  constructor() {
    const projectRoot = process.cwd();
    this.translationsPath = path.join(projectRoot, 'storage', 'translations');
    this.logger.log(`Translations path: ${this.translationsPath}`);
  }

  async getAvailableLanguages(): Promise<string[]> {
    try {
      await fs.access(this.translationsPath);
      const items = await fs.readdir(this.translationsPath, { withFileTypes: true });
      
      const languages: string[] = [];
      
      for (const item of items) {
        if (item.isDirectory()) {
          const lang = item.name;
          const translationsFile = path.join(this.translationsPath, lang, 'translations.json');
          
          try {
            await fs.access(translationsFile);
            languages.push(lang);
          } catch {
            this.logger.warn(`No translations.json found for language: ${lang}`);
          }
        }
      }
      
      return languages.length > 0 ? languages : ['en', 'ru'];
    } catch (error) {
      this.logger.error('Error getting available languages:', error);
      return ['en', 'ru'];
    }
  }

  async getAllTranslations(lang: string, flatFormat: boolean = false): Promise<any> {
    try {
      const filePath = path.join(this.translationsPath, lang, 'translations.json');
      await fs.access(filePath);
      
      const content = await fs.readFile(filePath, 'utf-8');
      const translations = JSON.parse(content);
      
      if (flatFormat) {
        return flat.flatten(translations, {
          delimiter: '.',
          safe: true,
          maxDepth: 10
        });
      }
      
      return translations;
    } catch (error: any) {
      this.logger.error(`Error loading translations for ${lang}:`, error);
      
      const langPath = path.join(this.translationsPath, lang);
      try {
        await fs.access(langPath);
        throw new NotFoundException(`translations.json not found for language: ${lang}`);
      } catch {
        throw new NotFoundException(`Language not found: ${lang}`);
      }
    }
  }

  async getFrontendTranslations(lang: string): Promise<any> {
    return this.getAllTranslations(lang, false);
  }

  async getModuleTranslations(
    lang: string, 
    module: string, 
    flatFormat: boolean = false
  ): Promise<any> {
    try {
      const allTranslations = await this.getAllTranslations(lang, false);
      
      if (module && allTranslations[module]) {
        const moduleTranslations = allTranslations[module];
        
        if (flatFormat) {
          return flat.flatten(moduleTranslations, {
            delimiter: '.',
            safe: true,
            maxDepth: 10
          });
        }
        
        return moduleTranslations;
      }
      
      return {};
    } catch (error) {
      this.logger.error(`Error loading module translations for ${lang}/${module}:`, error);
      return {};
    }
  }

  async getTranslation(lang: string, key: string): Promise<{ value: string; module: string } | null> {
    try {
      const allTranslations = await this.getAllTranslations(lang, false);
      const flattened = flat.flatten(allTranslations, {
        delimiter: '.',
        safe: true,
        maxDepth: 10
      });
      
      if (flattened[key]) {
        const module = key.split('.')[0];
        return {
          value: flattened[key],
          module: module
        };
      }
      
      return null;
    } catch (error) {
      this.logger.error(`Error getting translation for key ${key}:`, error);
      return null;
    }
  }

  async getAvailableModules(lang: string): Promise<string[]> {
    try {
      const allTranslations = await this.getAllTranslations(lang, false);
      return Object.keys(allTranslations);
    } catch (error) {
      this.logger.error(`Error getting modules for language ${lang}:`, error);
      return [];
    }
  }

  async getLanguageStats(lang: string): Promise<any> {
    try {
      const filePath = path.join(this.translationsPath, lang, 'translations.json');
      const stats = await fs.stat(filePath);
      
      const content = await fs.readFile(filePath, 'utf-8');
      const translations = JSON.parse(content);
      const flattened = flat.flatten(translations, {
        delimiter: '.',
        safe: true,
        maxDepth: 10
      });
      
      return {
        totalKeys: Object.keys(flattened).length,
        modules: Object.keys(translations).length,
        lastModified: stats.mtime
      };
    } catch (error) {
      this.logger.error(`Error getting stats for ${lang}:`, error);
      return {
        totalKeys: 0,
        modules: 0,
        lastModified: new Date()
      };
    }
  }
}