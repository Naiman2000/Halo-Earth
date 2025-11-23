import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerDetail } from './partner-detail';

describe('PartnerDetail', () => {
  let component: PartnerDetail;
  let fixture: ComponentFixture<PartnerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
