import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceDialogComponent } from './experience-dialog.component';

describe('ExperienceDialogComponent', () => {
    let component: ExperienceDialogComponent;
    let fixture: ComponentFixture<ExperienceDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ExperienceDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ExperienceDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
