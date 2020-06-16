import { Injectable } from '@angular/core';
import { User } from '../Models/user.model'
import { EmailValidator } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginResponseData} from '../Models/authentication.model';
import { Authentication } from '../Models/authentication.model'
import { BehaviorSubject, from, Subject, throwError } from 'rxjs';
import { tap , take , exhaustMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

      updateUserRecords:any;
      isAllowed = false
      users: User[] = [];
      deactivateAccount:any;
      apiUrl="https://employee-manager-app-e42a3.firebaseio.com/";
      apiKey="AIzaSyBYMBNI0O07KEuNpRULJMs09k0fX5gnbP0";
      userAuthentication = new BehaviorSubject<Authentication>(null);
      private tokenExpirationTimer : any;
      usersChanged = new Subject<any>();
      userDetails : User;
    
      constructor(private http: HttpClient ,private router: Router) { }
      
      setUsers(users: User[]) {
        this.users = users;
      }
    
      onCreateUser(newUser : User){
        return this.http
        .post<LoginResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+this.apiKey,
          {
            email : newUser.email,
            password : newUser.password,
            returnSecureToken: true
          }
          )
          .pipe(catchError((errorRes) => this.handleErrorMessage(errorRes)),
            tap(responseData =>{
            this.handleAuthentication(
              responseData.email,
              responseData.localId,
              responseData.idToken,
              +responseData.expiresIn
            );
          } ),
            take(1), exhaustMap((responseData) => {
            this.users.push(newUser);
            // console.log(this.users);
            return this.http.
            post
            (this.apiUrl + '/users.json', newUser);
            // console.log(newUser);
            // console.log("the array od users : " +this.users);
          })
          );    
      }
    
    
      private handleAuthentication(email: string, userId: string, token: string, expirationIn: number) {
        const expiredDate = new Date(new Date().getTime() + expirationIn * 1000);
        const user = new Authentication(
          email, 
          userId, 
          token, 
          expiredDate
          );
        this.userAuthentication.next(user);
        this.autoLogout(expirationIn * 1000);      
        localStorage.setItem('localId', user.id);
      }
    
    
      private handleErrorMessage(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
          
          case 'EMAIL_EXISTS':
            errorMessage = `The provided Email is Already in use by an Existing User. Each user must have a Unique Email.`;
            break;
    
          case 'WEAK_PASSWORD':
            errorMessage = 'The password must be 6 characters long or more.'
            break;
      
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
            break;
    
          default:
            errorMessage = 'Please Fill all the fields Carefully.'
            break;
        }
    
        return throwError(errorMessage);
      }
  
    
       onLogout(){
        localStorage.removeItem('Data');
        this.router.navigate(['login'])
        this.userAuthentication.next(null);
        if(this.tokenExpirationTimer){
          clearTimeout(this.tokenExpirationTimer);
        } 
        this.tokenExpirationTimer = null; 
      }
    
       autoLogout(expirationDuration : number){
        // console.log("Tokken Expires in : " +expirationDuration);
        this.tokenExpirationTimer =  setTimeout(()=>{
           this.onLogout();
         },expirationDuration
         );
       }
       
    
      textSearch(text){
       
      }
    
    
      deleteUserRecord(id){
        // console.log("Delete function");
        return this.http.
        delete
        (this.apiUrl + '/users/'+id+'.json');
      }

      getchangeStatus() {
          return this.deactivateAccount;
      }
      
      getUserDetail(){
        return this.http.get<User[]>(
            this.apiUrl + 'users.json'
          )
          .pipe(
            map(users =>  {
              this.users = [];
              let loginUserData = JSON.parse(localStorage.getItem('Data'));
              for (const key in users) {
                if (users.hasOwnProperty(key)) {
                  const user = users[key];
                  user.loginStatus = (user.email == loginUserData.email);    
                  this.users.push(user);
                }
              }
              return this.users;
            })
          ).subscribe((users) => {
            this.setUsers(users)
          });
      }

          
    getDetail(){
        return this.http.get<User[]>(
            this.apiUrl + 'users.json'
          )
          .subscribe((users) => {
            // console.log(users);
            this.setUsers(users)
          });
      }

      getCurrentLoggedInUserInfo(){
        return this.users.find(data => data.loginStatus == true);
       }

       
    updateUser(updatedInfo) {
      for(const user in this.users){ 
        if(this.users[user].email === updatedInfo.email){
          this.users[user].name = updatedInfo.name;
          this.users[user].email = updatedInfo.email;
          this.users[user].disabled = updatedInfo.disabled;
          this.users[user].role = updatedInfo.role;
          this.users[user].password = updatedInfo.password;
          this.users[user].date = updatedInfo.date;
          this.users[user].gender = updatedInfo.gender;
        }
      }
      return this.http.put(
        this.apiUrl + '/users.json',
        this.users
      );
    }
    
    deactiveUser(users) {
      this.http.put(
        this.apiUrl + '/users.json',
        users
      ).subscribe(data => {
        alert("Task Completed")
      });
    }
      
    updateRecord(id){
        this.updateUserRecords = null;
        var user = this.http.
        get
        (this.apiUrl + '/users/'+id+'.json').pipe(tap(
          Response=> {
          //  console.log(Response);
          this.updateUserRecords = Response;
          }));
        return user;
      }

      getUpdateRecord(){
        // console.log(this.updateUserRecords);
        return this.updateUserRecords;        
      }


}
