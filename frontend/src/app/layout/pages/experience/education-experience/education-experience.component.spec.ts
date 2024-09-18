import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationExperienceComponent } from './education-experience.component';

describe('EducationExperienceComponent', () => {
    let component: EducationExperienceComponent;
    let fixture: ComponentFixture<EducationExperienceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EducationExperienceComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EducationExperienceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
