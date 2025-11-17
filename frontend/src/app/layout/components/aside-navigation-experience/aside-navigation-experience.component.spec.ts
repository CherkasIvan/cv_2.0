import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideNavigationExperienceComponent } from './aside-navigation-experience.component';

describe('AsideNavigationExperienceComponent', () => {
    let component: AsideNavigationExperienceComponent;
    let fixture: ComponentFixture<AsideNavigationExperienceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AsideNavigationExperienceComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AsideNavigationExperienceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
