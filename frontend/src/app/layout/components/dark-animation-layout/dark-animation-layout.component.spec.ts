import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkAnimationLayoutComponent } from './dark-animation-layout.component';

describe('DarkAnimationLayoutComponent', () => {
    let component: DarkAnimationLayoutComponent;
    let fixture: ComponentFixture<DarkAnimationLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DarkAnimationLayoutComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkAnimationLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
