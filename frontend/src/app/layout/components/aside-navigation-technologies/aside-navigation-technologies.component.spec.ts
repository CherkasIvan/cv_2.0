import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideNavigationTechnologiesComponent } from './aside-navigation-technologies.component';

describe('AsideNavigationTechnologiesComponent', () => {
    let component: AsideNavigationTechnologiesComponent;
    let fixture: ComponentFixture<AsideNavigationTechnologiesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AsideNavigationTechnologiesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AsideNavigationTechnologiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
