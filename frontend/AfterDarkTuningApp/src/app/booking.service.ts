import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5000/api/bookings';
   
  constructor(private http: HttpClient , private authService: AuthServiceService) { }

  saveBooking(booking: any): Observable<any> {
    console.log('Booking data to be sent:', booking);
    return this.http.post('http://localhost:5000/api/bookings', booking, { withCredentials: true });
  }

        checkAvailability(date: string, time: string): Observable<any> {
          
          const apiUrl = 'http://localhost:5000/api/checkAvailability'; 
          
          const params = new HttpParams()
            .set('date', date)
            .set('time', time);
        
          return this.http.get(apiUrl, { params });
        }

        getAvailableTimes(selectedDate: Date): Observable<string[]> {
          
          const apiUrl = 'http://localhost:5000/api/getAvailableTimes'; 
        
          // Convert the selectedDate to a string in the format the API expects
          const formattedDate = selectedDate.toISOString().split('T')[0];
        
          // Make the HTTP request to the API
          return this.http.get<string[]>(apiUrl, { params: { date: formattedDate } });
        }

         
        getUserBookings(): Observable<any> {
          const httpOptions = {
            headers: new HttpHeaders({
              'Authorization': 'Bearer ' + this.authService.getToken()
            })
          };
          return this.http.get(`${this.apiUrl}/user`, httpOptions);
        }
        
        deleteBooking(bookingId: string): Observable<any> {
          return this.http.delete(`${this.apiUrl}/${bookingId}`);
        }

         
        getAllBookings(): Observable<any[]> {
        return this.http.get<any[]>('http://localhost:5000/api/bookings/all', { withCredentials: true });
        }

      }
      
    
