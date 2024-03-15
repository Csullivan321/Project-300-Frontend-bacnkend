import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceService } from 'src/app/auth-service.service'; 
 

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  userProfileForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthServiceService) {
    this.userProfileForm = this.formBuilder.group({
      name: [''],
      email: [''],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.prefillForm();
  }

  prefillForm(): void {
    this.authService.getUserDetails().subscribe(user => {
      this.userProfileForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    }, error => {
      console.error('Error fetching user details:', error);
    });
  }
}
 
