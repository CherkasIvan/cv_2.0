import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTimeComponent } from './first-time.component';

describe('FirstTimeComponent', () => {
    let component: FirstTimeComponent;
    let fixture: ComponentFixture<FirstTimeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FirstTimeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FirstTimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
