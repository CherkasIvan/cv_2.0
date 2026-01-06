import { TranslationResultModel } from './translation-result.model';

export interface TranslationMetadataModel {
    translations: TranslationResultModel;
    lastModified: Date;
    language: string;
}
