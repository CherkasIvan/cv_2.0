import { localStorageSync } from 'ngrx-store-localstorage';

import {
    Action,
    ActionReducer,
    ActionReducerMap,
    MetaReducer,
    createReducer,
    on,
} from '@ngrx/store';

import { TLocalstorageUser } from '@app/layout/store/model/localstorage-user.interface';

import { LocalstorageActions } from './localstorage.actions';

export const isFirstTimeReducer = (state: boolean = true, action: Action) => {
    switch (action.type) {
        // Определите ваши действия здесь
        default:
            return state;
    }
};

export const guestReducer = (
    state: any = { isGuest: true },
    action: Action,
) => {
    switch (action.type) {
        // Определите ваши действия здесь
        default:
            return state;
    }
};

export const registeredUserReducer = (state: any = null, action: Action) => {
    switch (action.type) {
        // Определите ваши действия здесь
        default:
            return state;
    }
};

export const routeReducer = (state: string = '', action: Action) => {
    switch (action.type) {
        // Определите ваши действия здесь
        default:
            return state;
    }
};

export const darkThemeReducer = createReducer(
    false, // Initial state is a boolean
    on(LocalstorageActions.updateMode, (state, { isDark }) => {
        localStorage.setItem('isDark', JSON.stringify(isDark));
        return isDark;
    }),
);

export const languageeReducer = (
    state: any = { language: 'ru' },
    action: Action,
) => {
    switch (action.type) {
        // Определите ваши действия здесь
        default:
            return state;
    }
};

export const localstorageUserReducer: ActionReducerMap<TLocalstorageUser> = {
    isFirstTime: isFirstTimeReducer,
    isGuest: guestReducer,
    user: registeredUserReducer,
    route: routeReducer,
    isDark: darkThemeReducer,
    language: languageeReducer,
};

export function localStorageSyncReducer(
    reducer: ActionReducer<TLocalstorageUser>,
): ActionReducer<any> {
    return localStorageSync({
        keys: [
            {
                usersState: [
                    'isFirstTime',
                    'isGuest',
                    'user',
                    'route',
                    'isDark',
                    'language',
                ],
            },
        ],
        rehydrate: true,
        checkStorageAvailability: true,
    })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = [
    localStorageSyncReducer,
];
