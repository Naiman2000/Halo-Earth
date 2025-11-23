import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoralList } from './coral-list';

describe('CoralList', () => {
  let component: CoralList;
  let fixture: ComponentFixture<CoralList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoralList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoralList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
