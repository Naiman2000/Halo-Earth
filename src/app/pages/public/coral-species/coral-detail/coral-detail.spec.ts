import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoralDetail } from './coral-detail';

describe('CoralDetail', () => {
  let component: CoralDetail;
  let fixture: ComponentFixture<CoralDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoralDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoralDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
