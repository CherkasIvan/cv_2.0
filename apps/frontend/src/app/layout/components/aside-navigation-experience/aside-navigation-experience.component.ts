import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Store, select } from '@ngrx/store';

import { TExperienceAside } from '@core/models/experience-aside.type';
import { THardSkillsNav } from '@core/models/hard-skills-nav.type';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';

import { selectHardSkillsNav } from '@layout/store/firebase-store/firebase.selectors';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cv-aside-navigation-experience',
    standalone: true,
    imports: [NgClass, TranslateModule],
    templateUrl: './aside-navigation-experience.component.html',
    styleUrls: [
        './aside-navigation-experience.component.scss',
        './aside-navigation-experience-dm/aside-navigation-experience-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideNavigationExperienceComponent implements OnInit {
    public readonly emittedTab = output<string>();

    private readonly _destroyRef = inject(DestroyRef);
    private readonly _cdr = inject(ChangeDetectorRef);
    private readonly _store = inject(Store);
    private readonly _cacheStorageService = inject(CacheStorageService);

    public readonly hardSkillsNavigation$ = this._store.pipe(
        select(selectHardSkillsNav),
        takeUntilDestroyed(this._destroyRef),
    );

    public readonly theme = input<boolean | null>(false);
    public readonly navigationList = input<TExperienceAside[]>([]);

    public readonly currentSkills = signal<string>('');
    public readonly selectedTab = signal<'work' | 'education'>('work');

    public changeTab(tab: 'education' | 'work'): void {
        this.selectedTab.set(tab);

        this._cacheStorageService
            .setSelectedExperienceTab(tab)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                console.log('Experience tab saved successfully');
            });

        this.emittedTab.emit(tab);
        this._cdr.detectChanges();
    }

    public changeSkillsList(tab: string): void {
        this.currentSkills.set(tab);
        this.emittedTab.emit(tab);
        this._cdr.detectChanges();
    }

    public ngOnInit(): void {
        this._cacheStorageService
            .getSelectedExperienceTab()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((tab: 'work' | 'education') => {
                this.selectedTab.set(tab);
                this.emittedTab.emit(tab);
                this._cdr.detectChanges();
            });

        this.hardSkillsNavigation$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((skills: THardSkillsNav[]) => {
                const skill = skills.find((skill) => skill.id === 1);
                if (skill) {
                    this.currentSkills.set(skill.link);
                    this._cdr.detectChanges();
                }
            });
    }
}
