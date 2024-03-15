import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Emitters ,  } from './emitters/emmiters';
import { User } from './usermodel'; 

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private apiUrl = 'http://localhost:5000/api';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  
  
// AuthService login method
login(email: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).pipe(
    catchError(error => {
      console.error('Login error:', error);
      return throwError(() => new Error('Failed to login'));
    }),
    catchError(error => {
      console.error('Login error:', error);
      return throwError(() => new Error('Failed to login'));
    })
  );
}

  logout() {
    this.http.post(`http://localhost:5000/api/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          
          
        },
        error: error => {
          console.error('Logout error:', error);
          // Handle logout error
        }
      });
  }
  
 

  

  getUserDetails(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`, { withCredentials: true });
  }

   

 


  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
       
    });
  }

  decodeToken(token: string): any {
    try {
      const decoded = jwt_decode(token);
      return decoded; // This will contain the user data from the payload
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }
 
  getToken(): string | null {
    return localStorage.getItem('token');  
  }

  
  
}

function jwt_decode(token: string) {
  throw new Error('Function not implemented.');
}



 
   