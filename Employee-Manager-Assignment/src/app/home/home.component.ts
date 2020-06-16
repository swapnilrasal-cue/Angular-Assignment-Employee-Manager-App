import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';
import { User } from '../Models/user.model';
// import { strict } from 'assert';
// import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private authenticationService : AuthenticationService) { }

isAllowed = false;
users: User[];

ngOnInit(): void {
this.authenticationService.getUserDetail();
this.authenticationService.usersChangedState.subscribe((users) => {
// this.isLoading = false;
this.users = users;
});
const test = this.authenticationService.getCurrentLoggedInUserInfo();
// console.log("loggedInUsersfsf "+test.role);
let role : string = test.role;
// console.log("loggedInUsersfsf "+role);
// let test = this.userService.getCurrentLoggedInUserInfo();

if( role === 'Admin'){
this.isAllowed = true;
// console.log(this.isAllowed);
}
else{
this.isAllowed = false;
}


}

}
