import { Observable } from 'rxjs';

import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    InputSignal,
    Output,
    input,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { TGitHub } from '@core/models/github.type';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';

import { darkModeSelector } from '@store/dark-mode-store/dark-mode.selectors';

@Component({
    selector: 'cv-project-navigation',
    templateUrl: './project-navigation.component.html',
    styleUrls: [
        './project-navigation.component.scss',
        './project-navigation-dm/project-navigation-dm.component.scss',
        './project-navigation-mobile/project-navigation-mobile.component.scss',
    ],
    imports: [NgClass],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNavigationComponent {
    @Output() repoTypeChanged = new EventEmitter<
        'public' | 'private' | 'all'
    >();

    public currentTypes: InputSignal<any[] | null> = input<any[] | null>([]);
    public publicRepositories$!: Observable<TGitHub[]>;
    public privateRepositories$!: Observable<TGitHub[]>;
    public currentRepoType: string = 'public';
    public theme = input<boolean | null>(false);
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );
    public currentRepositories$!: Observable<TGitHub[]>;

    constructor(private _store$: Store) {}

    public setRepoType(type: 'public' | 'private' | 'all'): void {
        console.log(type);
        this.currentRepoType = type;
        this.repoTypeChanged.emit(type);
    }
}
