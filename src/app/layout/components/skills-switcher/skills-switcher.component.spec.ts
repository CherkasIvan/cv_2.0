import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsSwitcherComponent } from './skills-switcher.component';

describe('SkillsSwitcherComponent', () => {
  let component: SkillsSwitcherComponent;
  let fixture: ComponentFixture<SkillsSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsSwitcherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkillsSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
