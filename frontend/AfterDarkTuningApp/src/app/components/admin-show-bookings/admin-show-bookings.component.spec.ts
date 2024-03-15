import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShowBookingsComponent } from './admin-show-bookings.component';

describe('AdminShowBookingsComponent', () => {
  let component: AdminShowBookingsComponent;
  let fixture: ComponentFixture<AdminShowBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminShowBookingsComponent]
    });
    fixture = TestBed.createComponent(AdminShowBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
