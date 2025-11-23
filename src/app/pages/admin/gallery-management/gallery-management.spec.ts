import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryManagement } from './gallery-management';

describe('GalleryManagement', () => {
  let component: GalleryManagement;
  let fixture: ComponentFixture<GalleryManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
