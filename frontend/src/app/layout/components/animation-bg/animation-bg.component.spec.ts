import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationBgComponent } from './animation-bg.component';

describe('AnimationBgComponent', () => {
    let component: AnimationBgComponent;
    let fixture: ComponentFixture<AnimationBgComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AnimationBgComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AnimationBgComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
