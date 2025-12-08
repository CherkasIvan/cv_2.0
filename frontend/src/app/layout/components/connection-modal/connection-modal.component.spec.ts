import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionModalComponent } from './connection-modal.component';

describe('ConnectionModalComponent', () => {
    let component: ConnectionModalComponent;
    let fixture: ComponentFixture<ConnectionModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConnectionModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ConnectionModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
