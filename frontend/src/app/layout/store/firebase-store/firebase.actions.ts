import { createAction, props } from '@ngrx/store';

// ========== LOAD ACTIONS ==========

// Убрать imgName из большинства действий
export const loadNavigation = createAction('[Firebase] Load Navigation');
export const loadSocialMedia = createAction('[Firebase] Load Social Media');
export const loadWorkExperience = createAction(
    '[Firebase] Load Work Experience',
);
export const loadFrontendTech = createAction('[Firebase] Load Frontend Tech');
export const loadBackendTech = createAction('[Firebase] Load Backend Tech');
export const loadOtherTech = createAction('[Firebase] Load Other Tech');
export const loadHardSkillsNav = createAction(
    '[Firebase] Load Hard Skills Nav',
);
export const loadEducationPlaces = createAction(
    '[Firebase] Load Education Places',
);
export const loadExperienceAside = createAction(
    '[Firebase] Load Experience Aside',
);
export const loadTechnologiesAside = createAction(
    '[Firebase] Load Technologies Aside',
);

// Оставить imgName только там где это действительно нужно
export const loadMainPageInfo = createAction(
    '[Firebase] Load Main Page Info',
    props<{ imgName?: string }>(),
);

// Добавить новые действия для загрузки изображений
export const loadThemeImages = createAction(
    '[Firebase] Load Theme Images',
    props<{ folder: string; searchParam?: string }>(),
);

export const loadImagesByFolder = createAction(
    '[Firebase] Load Images By Folder',
    props<{ folder: string; searchParam?: string }>(),
);

// ========== SUCCESS ACTIONS ==========

export const loadNavigationSuccess = createAction(
    '[Firebase] Load Navigation Success',
    props<{ navigation: any; images: string[] }>(),
);

export const loadSocialMediaSuccess = createAction(
    '[Firebase] Load Social Media Success',
    props<{ socialMediaLinks: any; images: string[] }>(),
);

export const loadWorkExperienceSuccess = createAction(
    '[Firebase] Load Work Experience Success',
    props<{ workExperience: any; images: string[] }>(),
);

export const loadFrontendTechSuccess = createAction(
    '[Firebase] Load Frontend Tech Success',
    props<{ frontendTech: any; images: string[] }>(),
);

export const loadBackendTechSuccess = createAction(
    '[Firebase] Load Backend Tech Success',
    props<{ backendTech: any; images: string[] }>(),
);

export const loadOtherTechSuccess = createAction(
    '[Firebase] Load Other Tech Success',
    props<{ otherTech: any; images: string[] }>(),
);

export const loadHardSkillsNavSuccess = createAction(
    '[Firebase] Load Hard Skills Nav Success',
    props<{ hardSkillsNav: any; images: string[] }>(),
);

export const loadEducationPlacesSuccess = createAction(
    '[Firebase] Load Education Places Success',
    props<{ education: any; images: string[] }>(),
);

export const loadMainPageInfoSuccess = createAction(
    '[Firebase] Load Main Page Info Success',
    props<{ mainPageInfo: any; images: string[] }>(),
);

export const loadExperienceAsideSuccess = createAction(
    '[Firebase] Load Experience Aside Success',
    props<{ experienceAside: any; images: string[] }>(),
);

export const loadTechnologiesAsideSuccess = createAction(
    '[Firebase] Load Technologies Aside Success',
    props<{ technologiesAside: any; images: string[] }>(),
);

export const loadThemeImagesSuccess = createAction(
    '[Firebase] Load Theme Images Success',
    props<{ images: string[] }>(),
);

export const loadImagesByFolderSuccess = createAction(
    '[Firebase] Load Images By Folder Success',
    props<{ folder: string; images: string[] }>(),
);

// ========== FAILURE ACTIONS ==========

export const loadNavigationFailure = createAction(
    '[Firebase] Load Navigation Failure',
    props<{ error: Error }>(),
);

export const loadSocialMediaFailure = createAction(
    '[Firebase] Load Social Media Failure',
    props<{ error: Error }>(),
);

export const loadWorkExperienceFailure = createAction(
    '[Firebase] Load Work Experience Failure',
    props<{ error: Error }>(),
);

export const loadFrontendTechFailure = createAction(
    '[Firebase] Load Frontend Tech Failure',
    props<{ error: Error }>(),
);

export const loadBackendTechFailure = createAction(
    '[Firebase] Load Backend Tech Failure',
    props<{ error: Error }>(),
);

export const loadOtherTechFailure = createAction(
    '[Firebase] Load Other Tech Failure',
    props<{ error: Error }>(),
);

export const loadHardSkillsNavFailure = createAction(
    '[Firebase] Load Hard Skills Nav Failure',
    props<{ error: Error }>(),
);

export const loadEducationPlacesFailure = createAction(
    '[Firebase] Load Education Places Failure',
    props<{ error: Error }>(),
);

export const loadMainPageInfoFailure = createAction(
    '[Firebase] Load Main Page Info Failure',
    props<{ error: Error }>(),
);

export const loadExperienceAsideFailure = createAction(
    '[Firebase] Load Experience Aside Failure',
    props<{ error: Error }>(),
);

export const loadTechnologiesAsideFailure = createAction(
    '[Firebase] Load Technologies Aside Failure',
    props<{ error: Error }>(),
);

export const loadThemeImagesFailure = createAction(
    '[Firebase] Load Theme Images Failure',
    props<{ error: Error }>(),
);

export const loadImagesByFolderFailure = createAction(
    '[Firebase] Load Images By Folder Failure',
    props<{ folder: string; error: Error }>(),
);
