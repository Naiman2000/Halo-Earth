import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageManagement } from './message-management';

describe('MessageManagement', () => {
  let component: MessageManagement;
  let fixture: ComponentFixture<MessageManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
