import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningExperienceComponent } from './learning-experience.component';

describe('LearningExperienceComponent', () => {
  let component: LearningExperienceComponent;
  let fixture: ComponentFixture<LearningExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningExperienceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LearningExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
