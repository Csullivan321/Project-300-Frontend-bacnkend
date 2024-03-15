import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AuthServiceService } from 'src/app/auth-service.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
form: FormGroup;
  apiUrl: "http://localhost:5000/api/login";

constructor(
  private formBuilder:FormBuilder,
  private http:HttpClient,
  private router:Router,
  private authService: AuthServiceService
){}
ngOnInit(): void {
  this.form = this.formBuilder.group({
    email: '',
    password: '',
  });
}

ValidateEmail = (email: any) => {

  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9]+)*$/;
  
  if (email.match(validRegex)){

    return true;

  } else{
    return false;
  }
}

submit(){
  let user = this.form.getRawValue()
  

  if(user.email == "" || user.password == "" ){
    Swal.fire("Error", "Please enter all of the fields", "error")
  }
  else if(!this.ValidateEmail(user.email)){
    Swal.fire("Error", "Please enter a valid email", "error")
  }else{
    this.http.post("http://localhost:5000/api/login",user,{
      withCredentials: true
    })
    .subscribe(
      (res) => this.router.navigate(['/']),
      (err) => {
        Swal.fire("Error", err.error.message, 'error')
      }
    )
  }
}
}
