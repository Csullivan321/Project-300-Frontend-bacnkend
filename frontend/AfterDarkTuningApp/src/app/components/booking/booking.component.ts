import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { BookingService } from 'src/app/booking.service';
import { AuthServiceService } from 'src/app/auth-service.service'; 
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  name: string = '';
  email:string = '';
  carMake: string = '';
  carModel: string = '';
  registeration: string = '';
  service: string = '';
  phone: string = '';

  selectedDate: Date | null = null;
  availableTimes: string[] = [ "Check"];
  selectedTime: string | null = null; 
  form:FormGroup;
  errorMessage: string | null = null
   
  

  constructor(private bookingService: BookingService, private formBuilder:FormBuilder, private authService: AuthServiceService, private http:HttpClient) {

 
    
  }
 
  ngOnInit(): void {
    this.http.get('http://localhost:5000/api/user',{
        withCredentials:true
      })
    
    

    this.form = this.formBuilder.group({
      name:'',
      email:'',
      phone:'',
      carMake:'',
      carModel:'',
      registeration:'',
      service:'',
      selectedDate: null,
      selectedTime:''
      
    });
    console.log('Form initialized:', this.form);

     this.prefillFormData();
  }
  timeSlotAvailability: { [key: string]: boolean } = {};


   prefillFormData(): void {
     this.authService.getUserDetails().subscribe({
      next: (user) => {
         this.form.patchValue({
           name: user.name,
           email: user.email,
           phone: user.phone,
         });
      },
       error: (error) => {
         console.error('Failed to retrieve user details', error);
            
       }
      });
    }
   

dateSelected(date: Date): void {
  this.selectedDate = date;
  console.log("Selected Date ", date)

    this.selectedDate = date;
      this.form.patchValue({ selectedDate: date.toISOString().split('T')[0] }); //'YYYY-MM-DD' format
    this.availableTimes.forEach(timeSlot => {
      this.checkAvailabilityForTimeSlot(timeSlot);
   })
  
   
}


  

  selectTime(time: string): void {
    this.selectedTime = time;
    this.form.patchValue({ selectedTime: time });
    console.log(`Selected time slot: ${this.selectedDate} ${this.selectedTime}`);
  
    // Check availability when time is selected
    this.checkAvailability();
  }
  
  
  submitBooking(): void {
    if (this.form.valid  ) {
      const booking = {
        ...this.form.value,
         
        date: this.selectedDate,
        time: this.selectedTime
      };

      this.bookingService.saveBooking(booking).subscribe(
        (response) => {
          Swal.fire("Success", "Booking Successfull", "success")
          console.log('Booking saved successfully:', response);
         
        },
        (error) => {
          console.error('Error saving booking:', error);
         

          if (error.status === 400 && error.error && error.error.error === 'Selected date and time slot are not available.') {
            
            Swal.fire("Error", "That time slot is unavailable", "error")
          } else {
            
            this.errorMessage = 'An error occurred while saving the booking.';
          }
        }
        
      );
    } else {
      Swal.fire("Error", "Incomplete Form Data", "error")
      console.error('Incomplete form data');
      
    }
  }
  
      

  checkAvailabilityForTimeSlot(timeSlot: string): void {
    if (this.selectedDate) {
      const date = this.selectedDate.toISOString().split('T')[0];
      this.bookingService.checkAvailability(date, timeSlot)
        .subscribe(
          (response) => {
            console.log(`Availability for ${timeSlot}:`, response.isAvailable);
            console.log(response);
         
          this.timeSlotAvailability[timeSlot] = response.isAvailable;
            
          },
          (error) => {
            console.error('Error checking availability:', error);
            
          }
        );
    }
  }
  

  checkAvailability(): void {
    if (this.selectedDate && this.selectedTime) {
      const date = this.selectedDate.toISOString().split('T')[0];
      
      // Include selected time in the availability check
      const selectedTime = ' ';

  this.bookingService.checkAvailability(date, selectedTime).subscribe(
    (response) => {
      this.availableTimes = response.availableTimeSlots;
      this.errorMessage = ''; // Clear any previous error message
    },
    (error) => {
      this.errorMessage = 'Error checking availability. Please try again.'; 
      console.error('Error checking availability:', error);
    }
  );

    }

    
  }
 
}
