import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideNavigationSubtechnologiesComponent } from './aside-navigation-subtechnologies.component';

describe('AsideNavigationSubtechnologiesComponent', () => {
  let component: AsideNavigationSubtechnologiesComponent;
  let fixture: ComponentFixture<AsideNavigationSubtechnologiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideNavigationSubtechnologiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideNavigationSubtechnologiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
