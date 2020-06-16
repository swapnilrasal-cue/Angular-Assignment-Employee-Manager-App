import { Component, OnInit , AfterViewInit} from '@angular/core';
import { FormGroup , FormControl, Validators} from '@angular/forms';
import { AuthenticationService } from '../Services/authentication.service';
import { User } from '../Models/user.model';
import { Router } from '@angular/router';
// import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,AfterViewInit {
    updateUser;
    users: User[] = [];
    EditUserForm : FormGroup;
    genders = ['Male' , 'Female' , 'Others'];
    userDetails:User;
  
    isLoading = false;
    
  
    constructor(private authenticationService : AuthenticationService,
                private router: Router) { }
  
    ngOnInit(): void {
      this.profileDetails();
    }
    ngAfterViewInit(): void{
      this.profileDetails();
    }
    

    profileDetails() {
      this.authenticationService.getUserDetail();
      this.authenticationService.usersChangedState.subscribe((users) => {
      this.isLoading = false;
      this.users = users;
      });
  

      const loggedInUser = this.authenticationService.getCurrentLoggedInUserInfo();
      // console.log("loggedInUser "+loggedInUser);
      
      let newname = loggedInUser.name;
      let newemail = loggedInUser.email;
      // let newstatus = loggedInUser.status;
      let newrole = loggedInUser.role;
      let newpassword = loggedInUser.password;
      let newdate = loggedInUser.date;
      let newgender = loggedInUser.gender;
      
      this.EditUserForm  = new FormGroup({
        'name': new FormControl(newname,[Validators.required ]),
        'email': new FormControl(newemail, [Validators.required, Validators.email]),
        // 'status': new FormControl(newstatus,Validators.required), 
        'role' : new FormControl(newrole,Validators.required),
        'password': new FormControl(newpassword,[Validators.required,Validators.minLength(7)]),
        'date': new FormControl(newdate,Validators.required),
        'gender': new FormControl(newgender,Validators.required),
     });
    }
    onEditUser() {
        this.isLoading = true;
        this.authenticationService.updateUser(this.EditUserForm.value)
         .subscribe((users) => {
          this.isLoading = false;
          this.router.navigate(['/home']);
  
        });
      }
    
}
  
