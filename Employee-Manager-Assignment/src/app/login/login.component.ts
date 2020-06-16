import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    
    loginForm : FormGroup;
    isLoading = false;
    error : string = null;
    deactivateUser : any;

    constructor( private authenticationService : AuthenticationService ,
                 private router :Router,
                 private userService : UserService ) { }
  
    ngOnInit(): void {
      this.setDeactivateAccount();
      this.loginForm = new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]), 
         'password': new FormControl(null,Validators.required),
      });
    }
  
    Login(){
      this.isLoading = true;
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      var deactived;
      for(const user in this.deactivateUser){
        if(this.deactivateUser[user] != null){
          if(this.deactivateUser[user].email === email && this.deactivateUser[user].disabled === "true") {
            deactived = true;
            break;
         } else {
           deactived = false;
         }
       }
 
        }   
      if(deactived === false) {
        this.authenticationService.onLogin(email , password).subscribe(ResponseData =>{
          alert("successfully login");
          this.isLoading = false;
          this.router.navigate(['/home'])
          }, (error) => {
            this.isLoading = false;
            // this.formError = true;
            this.error = error
          }
          );
      } else {
        alert("The User Account has been Disabled by an Administrator.")
         this.isLoading = false;
         this.router.navigate(['/home'])
      }
      
      this.loginForm.reset();
    }

     setDeactivateAccount() {
      this.authenticationService.getDeactiveUsers().subscribe(Response => {
          this.deactivateUser = Response;
          // console.log("response"+this.deactivateUser)
     });
     }
  
  }
  
