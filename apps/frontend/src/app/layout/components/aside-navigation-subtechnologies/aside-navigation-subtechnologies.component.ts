import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
    computed,
    inject,
    output,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLinkActive } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { THardSkillsNav } from '@core/models/hard-skills-nav.type';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';

import { selectHardSkillsNav } from '@layout/store/firebase-store/firebase.selectors';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cv-aside-navigation-subtechnologies',
    standalone: true,
    imports: [NgClass, RouterLinkActive, AsyncPipe, TranslateModule],
    templateUrl: './aside-navigation-subtechnologies.component.html',
    styleUrls: [
        './aside-navigation-subtechnologies.component.scss',
        './aside-navigation-subtechnologies-dm/aside-navigation-subtechnologies-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideNavigationSubtechnologiesComponent implements OnInit {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _cdr = inject(ChangeDetectorRef);
    private readonly _store = inject(Store);
    private readonly _cacheStorageService = inject(CacheStorageService);

    public readonly hardSkillsNavigation$ = this._store.pipe(
        select(selectHardSkillsNav),
        takeUntilDestroyed(this._destroyRef),
    );

    public readonly emittedTab = output<'frontend' | 'backend'>();

    public readonly currentSkills = signal<string>('');
    public readonly selectedTab = signal<'frontend' | 'backend'>('frontend');

    protected readonly _isActiveLink = computed(() => (link: string) => {
        return this.currentSkills() === link;
    });

    public ngOnInit(): void {
        this._cacheStorageService
            .getSelectedMainTechnologiesTab()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((techTab: 'technologies' | 'other') => {
                if (techTab === 'technologies') {
                    this._cacheStorageService
                        .getSelectedSubTechnologiesTab()
                        .pipe(takeUntilDestroyed(this._destroyRef))
                        .subscribe((savedTab: 'frontend' | 'backend') => {
                            this.selectedTab.set(savedTab);
                            this.currentSkills.set(savedTab);

                            if (this.currentSkills() !== savedTab) {
                                this.emittedTab.emit(savedTab);
                            }
                        });
                }
            });
    }

    public changeSkillsList(tab: 'frontend' | 'backend'): void {
        console.log('Changing skills to:', tab);

        this.currentSkills.set(tab);

        this._cacheStorageService
            .setSelectedSubTechnologiesTab(tab)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                console.log('Sub technology tab saved successfully');

                if (this.selectedTab() !== tab) {
                    this.selectedTab.set(tab);
                    this.emittedTab.emit(tab);
                }

                this._cdr.detectChanges();
            });
    }
}
