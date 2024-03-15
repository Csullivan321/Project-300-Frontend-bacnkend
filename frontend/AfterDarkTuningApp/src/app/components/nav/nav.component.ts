import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStatus, Emitters } from 'src/app/emitters/emmiters';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent  implements OnInit{
  authenticated = false
  isAdmin = false;

  constructor(private http:HttpClient,  private router: Router){

  }
  ngOnInit(): void {
    Emitters.authEmitter.subscribe((authStatus: AuthStatus) => {
      this.authenticated = authStatus.authenticated;
      this.isAdmin = authStatus.role === 'admin';
    });
  }

  logout(): void {
    this.http.post('http://localhost:5000/api/logout', {}, {withCredentials: true})
      .subscribe(() => {
        this.authenticated = false;
        this.isAdmin = false; // Reset isAdmin on logout
        Emitters.authEmitter.emit({ authenticated: false }); // Update to match your emitter's expected payload
        this.router.navigate(['/login']); // Redirect to login after logout
      });
}
}
