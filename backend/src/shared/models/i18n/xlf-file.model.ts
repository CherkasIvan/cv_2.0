import { TranslationUnitModel } from "./translation-unit.model";

export interface XlfFileModel {
  original: string;
  sourceLanguage: string;
  targetLanguage: string;
  translationUnits: TranslationUnitModel[];
}