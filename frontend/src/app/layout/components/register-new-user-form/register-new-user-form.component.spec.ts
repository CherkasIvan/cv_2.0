import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterNewUserFormComponent } from './register-new-user-form.component';

describe('RegisterNewUserFormComponent', () => {
  let component: RegisterNewUserFormComponent;
  let fixture: ComponentFixture<RegisterNewUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterNewUserFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterNewUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
