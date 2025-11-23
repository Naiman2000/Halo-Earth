import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoralManagement } from './coral-management';

describe('CoralManagement', () => {
  let component: CoralManagement;
  let fixture: ComponentFixture<CoralManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoralManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoralManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
