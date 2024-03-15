import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BookingComponent } from './components/booking/booking.component';
import { ShowBookingComponent } from './components/show-booking/show-booking.component';
import { AdminShowBookingsComponent } from './components/admin-show-bookings/admin-show-bookings.component';
const routes: Routes = [
  {
    path:'',component:HomeComponent
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'register',component:RegisterComponent
  },
  {
    path:'booking',component:BookingComponent
  }
,
  {
    path:'show-booking',component:ShowBookingComponent
  },
  {
    path:'Admin-show-booking',component:AdminShowBookingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
