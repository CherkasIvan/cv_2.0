import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectNavigationComponent } from './project-navigation.component';

describe('ProjectNavigationComponent', () => {
  let component: ProjectNavigationComponent;
  let fixture: ComponentFixture<ProjectNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
