import { Component } from '@angular/core';
import { BookingService } from 'src/app/booking.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-booking',
  templateUrl: './show-booking.component.html',
  styleUrls: ['./show-booking.component.css']
})
export class ShowBookingComponent {

  bookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getUserBookings().subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
        
      }
    });
  }
  deleteBooking(bookingId: string): void {
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        Swal.fire("Success", "Booking has been cancelled", "success")
        // On success, remove the deleted booking from the bookings array
        this.bookings = this.bookings.filter(booking => booking._id !== bookingId);
      },
      error: (error) => {
        console.error('Error deleting the booking:', error);
        
      }
    });
}                                                   
}
