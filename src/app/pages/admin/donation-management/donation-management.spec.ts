import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationManagement } from './donation-management';

describe('DonationManagement', () => {
  let component: DonationManagement;
  let fixture: ComponentFixture<DonationManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
