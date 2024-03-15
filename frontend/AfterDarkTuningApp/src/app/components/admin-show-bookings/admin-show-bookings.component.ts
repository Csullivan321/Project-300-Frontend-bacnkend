import { Component } from '@angular/core';
import { BookingService } from 'src/app/booking.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-show-bookings',
  templateUrl: './admin-show-bookings.component.html',
  styleUrls: ['./admin-show-bookings.component.css']
})
export class AdminShowBookingsComponent {
  currentDate: Date = new Date();
  bookings: any[] = [];
  dailyBookings: any[] = [];

  constructor(private bookingService: BookingService) {
    this.currentDate.setHours(0, 0, 0, 0); 
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.bookingService.getAllBookings().subscribe(bookings => {
      this.bookings = bookings;
      this.filterDailyBookings();
    });
  }

  filterDailyBookings(): void {
    this.dailyBookings = this.bookings
      .filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate.toDateString() === this.currentDate.toDateString();
      })
      .sort((a, b) => {
        
        const timeToMinutes = (time: string) => {
          const [hoursMinutes, modifier] = time.split(' ');
          let [hours, minutes] = hoursMinutes.split(':').map(Number);
          if (modifier === 'PM' && hours < 12) hours += 12;
          if (modifier === 'AM' && hours === 12) hours = 0;
          return hours * 60 + minutes;
        };
  
        return timeToMinutes(a.time) - timeToMinutes(b.time);
      });
  }
  
  

  goToNextDay(): void {
    // Create a new Date object based on the current date and add one day
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + 1);
    
    // Assign the new Date object to currentDate
    this.currentDate = newDate;
    
    this.filterDailyBookings();
  }
  
  goToPreviousDay(): void {
    // Create a new Date object based on the current date and subtract one day
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() - 1);
    
    // Assign the new Date object to currentDate
    this.currentDate = newDate;
    
    this.filterDailyBookings();
  }

  deleteBooking(bookingId: string): void {
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        Swal.fire("Success", "Booking has been cancelled", "success")
        this.bookings = this.bookings.filter(booking => booking._id !== bookingId);
        this.fetchBookings();
      },
      error: (error) => {
        console.error('Error deleting the booking:', error);
        Swal.fire("Error", "There was an issue cancelling the booking", "error");
      }
    });
  }
  
}
 