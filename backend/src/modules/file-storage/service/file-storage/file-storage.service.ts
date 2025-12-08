import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createReadStream, ReadStream } from 'fs';
import * as yaml from 'js-yaml';
import { createHash } from 'crypto';
import * as sharp from 'sharp'; 
import * as mime from 'mime-types';
import { exec } from 'child_process';
import { promisify } from 'util';
import { IMulterFileModel } from '@shared/models/file-storage/multer-file.model';
import { IFileFilterOptionsModel } from '@shared/models/file-storage/file-filter-options.model';
import { IFileMetadataModel } from '@shared/models/file-storage/file-metadata.model';
import { IFileWriteOptionsModel } from '@shared/models/file-storage/file-write-options.model';
import { IUploadFileOptionsModel } from '@shared/models/file-storage/upload-file-options.model';
import { IStorageStatsModel } from '@shared/models/file-storage/storage-stats.model';


const execAsync = promisify(exec);

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly storagePath: string;
  
  private static readonly SUPPORTED_IMAGE_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
  private static readonly SUPPORTED_VIDEO_FORMATS = ['.mp4', '.webm', '.avi', '.mov', '.mkv'];
  private static readonly SUPPORTED_AUDIO_FORMATS = ['.mp3', '.wav', '.ogg', '.m4a'];
  private static readonly SUPPORTED_I18N_FORMATS = ['.json'];;
  
  private readonly maxFileSize = 100 * 1024 * 1024;
  private readonly defaultThumbnailSize = 200;

  constructor(private configService: ConfigService) {
    this.storagePath = this.configService.get<string>('FILE_STORAGE_PATH') || 
      path.join(process.cwd(), 'storage');
    
    this.ensureStorageDirectory().catch((error) => {
      this.logger.error(`Failed to initialize storage: ${error.message}`);
    });
  }

  private async ensureStorageDirectory(): Promise<void> {
    const requiredDirectories = [
      this.storagePath,
      path.join(this.storagePath, 'i18n'),
      path.join(this.storagePath, 'icons'),
      path.join(this.storagePath, 'images'),
      path.join(this.storagePath, 'videos'),
      path.join(this.storagePath, 'audio'),
      path.join(this.storagePath, 'documents'),
      path.join(this.storagePath, 'thumbnails'),
      path.join(this.storagePath, 'cache'),
    ];

    try {
      for (const directory of requiredDirectories) {
        await fs.mkdir(directory, { recursive: true });
      }
      this.logger.log(`Storage initialized at: ${this.storagePath}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to create storage directories: ${errorMessage}`);
      throw error;
    }
  }

  async readFile(filePath: string, encoding: BufferEncoding = 'utf-8'): Promise<string | Buffer> {
    const fullPath = this.getFullPath(filePath);
    
    try {
      const content = await fs.readFile(fullPath);
      return encoding === 'binary' ? content : content.toString(encoding);
    } catch (error: unknown) {
      this.handleFileError(error, `Failed to read file: ${filePath}`);
    }
  }

  async readFileAsObject<T = Record<string, any>>(filePath: string): Promise<T> {
    const content = await this.readFile(filePath, 'utf-8') as string;
    const extension = path.extname(filePath).toLowerCase();

    try {
      switch (extension) {
        case '.json':
          return JSON.parse(content) as T;
        case '.yaml':
        case '.yml':
          return yaml.load(content) as T;
        case '.txt':
          return content as unknown as T;
        default:
          throw new BadRequestException(`Unsupported file format for parsing: ${extension}`);
      }
    } catch (error: unknown) {
      this.handleFileError(error, `Failed to parse file: ${filePath}`);
    }
  }

  async writeFile(
    filePath: string, 
    content: string | Buffer | Record<string, any>,
    options?: IFileWriteOptionsModel
  ): Promise<IFileMetadataModel> {
    const fullPath = this.getFullPath(filePath);
    const fileSize = this.calculateContentSize(content);
    
    this.validateFileSize(fileSize);
    
    await this.ensureDirectoryExists(path.dirname(fullPath));
    
    const buffer = this.convertContentToBuffer(content, filePath);
    const processedBuffer = await this.processFileContent(buffer, filePath, options);
    
    await fs.writeFile(fullPath, processedBuffer);
    
    const metadata = await this.generateFileMetadata(filePath, processedBuffer, options);
    
    if (options?.generateThumbnail && this.isThumbnailSupported(filePath)) {
      await this.generateAndSaveThumbnail(filePath, processedBuffer, metadata);
    }
    
    this.logger.log(`File written: ${filePath} (${metadata.size} bytes)`);
    return metadata;
  }

  async uploadFile(
    file: IMulterFileModel,
    destination: string,
    options?: IUploadFileOptionsModel
  ): Promise<IFileMetadataModel> {
    const filePath = path.join(destination, this.sanitizeFilename(file.originalname));
    
    const writeOptions: IFileWriteOptionsModel = {
      ...options,
      maxWidth: options?.resize?.width,
      maxHeight: options?.resize?.height,
    };
    
    return this.writeFile(filePath, file.buffer, writeOptions);
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = this.getFullPath(filePath);
    
    try {
      await fs.unlink(fullPath);
      await this.deleteAssociatedThumbnails(filePath);
      this.logger.log(`File deleted: ${filePath}`);
    } catch (error: unknown) {
      this.handleFileError(error, `Failed to delete file: ${filePath}`);
    }
  }

  async listFiles(
    directory: string = '', 
    recursive: boolean = false,
    filter?: IFileFilterOptionsModel
  ): Promise<IFileMetadataModel[]> {
    const fullDir = this.getFullPath(directory);
    
    try {
      const items = await fs.readdir(fullDir, { withFileTypes: true });
      const files: IFileMetadataModel[] = [];

      for (const item of items) {
        const relativePath = path.join(directory, item.name);
        
        if (item.isDirectory() && recursive) {
          const subFiles = await this.listFiles(relativePath, true, filter);
          files.push(...subFiles);
        } else if (item.isFile()) {
          try {
            const metadata = await this.getFileMetadata(relativePath);
            if (this.matchesFilter(metadata, filter)) {
              files.push(metadata);
            }
          } catch (error: unknown) {
            this.logger.warn(`Failed to get metadata for ${relativePath}: ${error}`);
          }
        }
      }

      return files;
    } catch (error: unknown) {
      if (this.isFileNotFoundError(error)) {
        return [];
      }
      throw new BadRequestException(`Failed to list files: ${error}`);
    }
  }

  async getFileMetadata(filePath: string): Promise<IFileMetadataModel> {
    const fullPath = this.getFullPath(filePath);
    
    try {
      const stats = await fs.stat(fullPath);
      const buffer = await fs.readFile(fullPath);
      const extension = path.extname(filePath).toLowerCase();

      const metadata: IFileMetadataModel = {
        id: this.generateFileHash(buffer),
        filename: path.basename(filePath),
        path: filePath,
        size: stats.size,
        mimeType: mime.lookup(extension) || 'application/octet-stream',
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,
        hash: this.generateFileHash(buffer),
        category: this.detectFileCategory(extension),
        tags: [],
      };

      await this.enrichMetadataWithSpecifics(fullPath, buffer, metadata);
      
      const thumbnailPath = this.getThumbnailPath(filePath);
      if (await this.fileExists(thumbnailPath)) {
        metadata.thumbnail = thumbnailPath;
      }

      return metadata;
    } catch (error: unknown) {
      this.handleFileError(error, `Failed to get file metadata: ${filePath}`);
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    const fullPath = this.getFullPath(filePath);
    
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async getFileStream(filePath: string): Promise<ReadStream> {
    const fullPath = this.getFullPath(filePath);
    
    if (!await this.fileExists(filePath)) {
      throw new NotFoundException(`File not found: ${filePath}`);
    }

    return createReadStream(fullPath);
  }

  async getThumbnail(filePath: string, width: number = this.defaultThumbnailSize, height?: number): Promise<Buffer> {
    const thumbnailPath = this.getThumbnailPath(filePath, width, height);
    
    if (await this.fileExists(thumbnailPath)) {
      return fs.readFile(this.getFullPath(thumbnailPath));
    }

    const originalBuffer = await fs.readFile(this.getFullPath(filePath));
    const extension = path.extname(filePath).toLowerCase();

    if (this.isImageFile(extension)) {
      return this.generateImageThumbnail(originalBuffer, width, height);
    } else if (this.isVideoFile(extension)) {
      return this.generateVideoThumbnail(filePath, width, height);
    }

    throw new BadRequestException('Thumbnail generation not supported for this file type');
  }

async getI18nTranslations(language: string): Promise<Record<string, any>> {
  try {
    const filePath = path.join('translations', language, 'translations.json');
    const content = await this.readFile(filePath, 'utf-8') as string;
    return JSON.parse(content);
  } catch (error: unknown) {
    this.logger.warn(`No translations found for language: ${language}`);
    return {};
  }
}

  async getI18nFile(language: string, filename: string): Promise<any> {
    let filePath = path.join('i18n', language, filename);
    
    if (!filename.match(/\.(yaml|yml|json)$/)) {
      filePath += '.yaml';
    }

    return this.readFileAsObject(filePath);
  }

  async saveI18nTranslations(language: string, translations: any): Promise<IFileMetadataModel> {
  const filePath = path.join('translations', language, 'translations.json');
  return this.writeFile(filePath, translations, { category: 'i18n' });
}

  async saveI18nFile(language: string, filename: string, content: any): Promise<IFileMetadataModel> {
    const normalizedFilename = filename.match(/\.(yaml|yml|json)$/) ? filename : `${filename}.yaml`;
    const filePath = path.join('i18n', language, normalizedFilename);
    
    return this.writeFile(filePath, content, { category: 'i18n' });
  }

async getAvailableLanguages(): Promise<string[]> {
  const i18nDir = path.join(this.storagePath, 'translations');
  
  try {
    const items = await fs.readdir(i18nDir, { withFileTypes: true });
    return items
      .filter(item => item.isDirectory())
      .map(dir => dir.name)
      .filter(lang => {
        // Проверяем, есть ли файл translations.json
        const translationsFile = path.join(i18nDir, lang, 'translations.json');
        return fs.access(translationsFile).then(() => true).catch(() => false);
      });
  } catch (error: unknown) {
    return ['en', 'ru'];
  }
}

  async getMediaByCategory(category: 'icons' | 'images' | 'videos' | 'audio'): Promise<IFileMetadataModel[]> {
    return this.listFiles(category, true);
  }

  async searchMedia(query: string, category?: string): Promise<IFileMetadataModel[]> {
    const files = await this.listFiles('', true, { category });
    
    const searchTerm = query.toLowerCase();
    return files.filter(file => 
      file.filename.toLowerCase().includes(searchTerm) ||
      file.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async resizeImage(filePath: string, width: number, height?: number): Promise<Buffer> {
    const buffer = await fs.readFile(this.getFullPath(filePath));
    return sharp(buffer)
      .resize(width, height, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .toBuffer();
  }

  async compressImage(filePath: string, quality: number = 80): Promise<Buffer> {
    const buffer = await fs.readFile(this.getFullPath(filePath));
    const extension = path.extname(filePath).toLowerCase();
    
    const imageProcessor = sharp(buffer);
    
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        return imageProcessor.jpeg({ quality }).toBuffer();
      case '.png':
        return imageProcessor.png({ compressionLevel: 9, quality }).toBuffer();
      case '.webp':
        return imageProcessor.webp({ quality }).toBuffer();
      default:
        return buffer;
    }
  }

  async clearCache(): Promise<void> {
    const cachePaths = [
      path.join(this.storagePath, 'cache'),
      path.join(this.storagePath, 'thumbnails'),
    ];
    
    try {
      for (const cachePath of cachePaths) {
        await fs.rm(cachePath, { recursive: true, force: true });
        await fs.mkdir(cachePath, { recursive: true });
      }
      this.logger.log('Cache cleared successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to clear cache: ${errorMessage}`);
    }
  }

  async getStorageStats(): Promise<IStorageStatsModel> {
    const files = await this.listFiles('', true);
    
    const stats: IStorageStatsModel = {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      byCategory: {},
    };

    for (const file of files) {
      const category = file.category || 'unknown';
      
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = { count: 0, size: 0 };
      }
      
      stats.byCategory[category].count++;
      stats.byCategory[category].size += file.size;
    }

    return stats;
  }

  private getFullPath(relativePath: string): string {
    const normalized = path.normalize(relativePath);
    
    if (normalized.startsWith('..') || path.isAbsolute(normalized)) {
      throw new BadRequestException('Invalid file path: path traversal or absolute path not allowed');
    }
    
    return path.join(this.storagePath, normalized);
  }

  private generateFileHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }

  private calculateContentSize(content: string | Buffer | Record<string, any>): number {
    if (Buffer.isBuffer(content)) {
      return content.length;
    }
    
    if (typeof content === 'string') {
      return Buffer.byteLength(content, 'utf-8');
    }
    
    return Buffer.byteLength(JSON.stringify(content), 'utf-8');
  }

  private validateFileSize(size: number): void {
    if (size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024}MB`
      );
    }
  }

  private convertContentToBuffer(content: string | Buffer | Record<string, any>, filePath: string): Buffer {
    if (Buffer.isBuffer(content)) {
      return content;
    }
    
    if (typeof content === 'string') {
      return Buffer.from(content, 'utf-8');
    }
    
    const extension = path.extname(filePath).toLowerCase();
    
    switch (extension) {
      case '.json':
        return Buffer.from(JSON.stringify(content, null, 2), 'utf-8');
      case '.yaml':
      case '.yml':
        return Buffer.from(yaml.dump(content), 'utf-8');
      default:
        return Buffer.from(String(content), 'utf-8');
    }
  }

  private async processFileContent(buffer: Buffer, filePath: string, options?: IFileWriteOptionsModel): Promise<Buffer> {
    const extension = path.extname(filePath).toLowerCase();
    
    if (this.isImageFile(extension) && (options?.maxWidth || options?.maxHeight)) {
      return this.processImage(buffer, options.maxWidth, options.maxHeight);
    }
    
    return buffer;
  }

  private async processImage(buffer: Buffer, maxWidth?: number, maxHeight?: number): Promise<Buffer> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      if (!maxWidth && !maxHeight) {
        return buffer;
      }
      
      return image
        .resize(maxWidth || metadata.width, maxHeight || metadata.height, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .toBuffer();
    } catch (error: unknown) {
      this.logger.warn(`Failed to process image: ${error}`);
      return buffer;
    }
  }

  private async ensureDirectoryExists(directory: string): Promise<void> {
    await fs.mkdir(directory, { recursive: true });
  }

  private async generateFileMetadata(
    filePath: string, 
    buffer: Buffer, 
    options?: IFileWriteOptionsModel
  ): Promise<IFileMetadataModel> {
    const stats = await fs.stat(this.getFullPath(filePath));
    const extension = path.extname(filePath).toLowerCase();

    return {
      id: this.generateFileHash(buffer),
      filename: path.basename(filePath),
      path: filePath,
      size: stats.size,
      mimeType: mime.lookup(extension) || 'application/octet-stream',
      createdAt: stats.birthtime,
      updatedAt: stats.mtime,
      hash: this.generateFileHash(buffer),
      category: options?.category || this.detectFileCategory(extension),
      tags: options?.tags || [],
    };
  }

  private detectFileCategory(extension: string): string {
    if (FileStorageService.SUPPORTED_IMAGE_FORMATS.includes(extension)) return 'images';
    if (FileStorageService.SUPPORTED_VIDEO_FORMATS.includes(extension)) return 'videos';
    if (FileStorageService.SUPPORTED_AUDIO_FORMATS.includes(extension)) return 'audio';
    if (FileStorageService.SUPPORTED_I18N_FORMATS.includes(extension)) return 'i18n';
    if (['.ico', '.svg'].includes(extension)) return 'icons';
    return 'documents';
  }

  private isImageFile(extension: string): boolean {
    return FileStorageService.SUPPORTED_IMAGE_FORMATS.includes(extension);
  }

  private isVideoFile(extension: string): boolean {
    return FileStorageService.SUPPORTED_VIDEO_FORMATS.includes(extension);
  }

  private isThumbnailSupported(filePath: string): boolean {
    const extension = path.extname(filePath).toLowerCase();
    return this.isImageFile(extension) || this.isVideoFile(extension);
  }

  private async enrichMetadataWithSpecifics(fullPath: string, buffer: Buffer, metadata: IFileMetadataModel): Promise<void> {
    const extension = path.extname(metadata.filename).toLowerCase();
    
    if (this.isImageFile(extension)) {
      await this.addImageMetadata(buffer, metadata);
    } else if (this.isVideoFile(extension)) {
      await this.addVideoMetadata(fullPath, metadata);
    }
  }

  private async addImageMetadata(buffer: Buffer, metadata: IFileMetadataModel): Promise<void> {
    try {
      const imageMetadata = await sharp(buffer).metadata();
      metadata.width = imageMetadata.width;
      metadata.height = imageMetadata.height;
    } catch (error: unknown) {
      this.logger.warn(`Failed to extract image metadata: ${error}`);
    }
  }

  private async addVideoMetadata(fullPath: string, metadata: IFileMetadataModel): Promise<void> {
    try {
      const { stdout } = await execAsync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${fullPath}"`
      );
      
      const duration = parseFloat(stdout.trim());
      if (!isNaN(duration)) {
        metadata.duration = Math.round(duration);
      }
    } catch (error: unknown) {
      this.logger.warn(`Failed to extract video metadata: ${error}`);
    }
  }

  private getThumbnailPath(filePath: string, width: number = this.defaultThumbnailSize, height?: number): string {
    const extension = path.extname(filePath);
    const basename = path.basename(filePath, extension);
    const dir = path.dirname(filePath);
    const size = height ? `${width}x${height}` : `${width}`;
    
    return path.join(dir, 'thumbnails', `${basename}_${size}.jpg`);
  }

  private async generateAndSaveThumbnail(filePath: string, buffer: Buffer, metadata: IFileMetadataModel): Promise<void> {
    try {
      const thumbnailBuffer = await this.generateImageThumbnail(buffer, this.defaultThumbnailSize);
      const thumbnailPath = this.getThumbnailPath(filePath);
      const fullThumbnailPath = this.getFullPath(thumbnailPath);
      
      await this.ensureDirectoryExists(path.dirname(fullThumbnailPath));
      await fs.writeFile(fullThumbnailPath, thumbnailBuffer);
      
      metadata.thumbnail = thumbnailPath;
    } catch (error: unknown) {
      this.logger.warn(`Failed to generate thumbnail for ${filePath}: ${error}`);
    }
  }

  private async generateImageThumbnail(buffer: Buffer, width: number, height?: number): Promise<Buffer> {
    return sharp(buffer)
      .resize(width, height, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 70 })
      .toBuffer();
  }

  private async generateVideoThumbnail(filePath: string, width: number, height?: number): Promise<Buffer> {
    const fullPath = this.getFullPath(filePath);
    const thumbnailPath = path.join(this.storagePath, 'cache', `${Date.now()}_thumb.jpg`);
    
    try {
      await execAsync(
        `ffmpeg -i "${fullPath}" -ss 00:00:01 -vframes 1 -vf "scale=${width}:-1" "${thumbnailPath}" -y`
      );
      
      const thumbnailBuffer = await fs.readFile(thumbnailPath);
      await fs.unlink(thumbnailPath);
      
      return thumbnailBuffer;
    } catch (error: unknown) {
      throw new BadRequestException(`Failed to generate video thumbnail: ${error}`);
    }
  }

  private async deleteAssociatedThumbnails(filePath: string): Promise<void> {
    const thumbnailPath = this.getThumbnailPath(filePath);
    if (await this.fileExists(thumbnailPath)) {
      await fs.unlink(this.getFullPath(thumbnailPath)).catch(() => {
        this.logger.warn(`Failed to delete thumbnail: ${thumbnailPath}`);
      });
    }
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  private matchesFilter(metadata: IFileMetadataModel, filter?: IFileFilterOptionsModel): boolean {
    if (!filter) return true;

    if (filter.category && metadata.category !== filter.category) {
      return false;
    }

    if (filter.tags?.length && filter.tags.every(tag => !metadata.tags?.includes(tag))) {
      return false;
    }

    if (filter.extensions?.length) {
      const fileExtension = path.extname(metadata.filename).toLowerCase();
      if (!filter.extensions.includes(fileExtension)) {
        return false;
      }
    }

    if (filter.minSize && metadata.size < filter.minSize) {
      return false;
    }

    if (filter.maxSize && metadata.size > filter.maxSize) {
      return false;
    }

    return true;
  }

  private handleFileError(error: unknown, context: string): never {
    if (this.isFileNotFoundError(error)) {
      throw new NotFoundException(`${context}: File not found`);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new BadRequestException(`${context}: ${errorMessage}`);
  }

  private isFileNotFoundError(error: unknown): boolean {
    return error instanceof Error && 'code' in error && error.code === 'ENOENT';
  }
}