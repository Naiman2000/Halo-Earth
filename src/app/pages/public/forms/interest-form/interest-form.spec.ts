import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestForm } from './interest-form';

describe('InterestForm', () => {
  let component: InterestForm;
  let fixture: ComponentFixture<InterestForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
