import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologiesStackComponent } from './technologies-stack.component';

describe('TechnologiesStackComponent', () => {
  let component: TechnologiesStackComponent;
  let fixture: ComponentFixture<TechnologiesStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologiesStackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnologiesStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
