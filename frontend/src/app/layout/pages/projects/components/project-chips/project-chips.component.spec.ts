import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectChipsComponent } from './project-chips.component';

describe('ProjectChipsComponent', () => {
  let component: ProjectChipsComponent;
  let fixture: ComponentFixture<ProjectChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectChipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
