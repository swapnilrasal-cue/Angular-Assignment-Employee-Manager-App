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
export class AuthenticationService {
  
    updateUserRecords:any;

    isAllowed = false
    users: User[] = [];
    apiUrl="https://employee-manager-app-e42a3.firebaseio.com/";
    apiKey="AIzaSyBYMBNI0O07KEuNpRULJMs09k0fX5gnbP0";
    userAuthentication = new BehaviorSubject<Authentication>(null);
    private tokenExpirationTimer : any;
    usersChangedState = new Subject<any>();
    userDetails : User;
  
    constructor(private http: HttpClient ,private router: Router) { }
  
    onLogin(email : string, password : string ){
      localStorage.clear();
      this.userDetails = null;
      return this.http.post<LoginResponseData>
      ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+this.apiKey,
        {
          email : email,
          password : password,
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
        } ));;    
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
      localStorage.setItem('Data', JSON.stringify(user));
    }
  
  
    autoLogin(){
      const userData : {
        email :string,
        id : string,
        _token :string,
        _tokenExpirationDate : string
      } = JSON.parse(localStorage.getItem('Data'));
      if(!userData){
        return;
      }
  
      const loadedUser = new Authentication(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );
  
      if(loadedUser.token){
        this.userAuthentication.next(loadedUser);
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime()-new Date().getTime();
        this.autoLogout(expirationDuration); 
      }
    }
  
     onLogout(){
      localStorage.removeItem('Data');
      this.router.navigate(['/login'])
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
     
     getUserDetail() {
      return this.http.get<User[]>(
          this.apiUrl + 'users.json'
        )
        .subscribe(users =>  {
            this.users = [];
            let loginUserData = JSON.parse(localStorage.getItem('Data'));
            for (const key in users) {
              if (users.hasOwnProperty(key)) {
                const user = users[key];
                if(user.email == loginUserData.email){
                  user.loginStatus = true;
                }
                   
                this.users.push(user);
              }
            }
            return this.users;
          })
        
    }

    getDeactiveUsers() {
      return this.http.get<User[]>(
        this.apiUrl + 'users.json'
      )
    }
  
    private handleErrorMessage(errorRes: HttpErrorResponse) {
      let errorMessage = 'An unknown error occurred!';
      if (!errorRes.error || !errorRes.error.error) {
        return throwError(errorMessage);
      }
      switch (errorRes.error.error.message) {
        
        case 'EMAIL_NOT_FOUND':
          errorMessage = `There is No Existing User Record Corresponding 
          to the Provided Identifier.`;
          break;
  
        case 'INVALID_PASSWORD':
          errorMessage = 'The Password that you have Entered is Incorrect.'
          break;
    
        case 'USER_DISABLED':
          errorMessage = 'The User Account has been Disabled by an dministrator.';
          break;
  
        default:
          errorMessage = 'Try Again Later.'
          break;
      }
  
      return throwError(errorMessage);
    }

     getCurrentLoggedInUserInfo(){
      return this.users.find(x => x.loginStatus == true);
     }
  
     
    updateUser(updatedInfo) {
      let index = this.users.findIndex((user) => user.loginStatus == true);
      this.users[index].name = updatedInfo.name;
      this.users[index].email = updatedInfo.email;
      // this.users[index].status = updatedInfo.status;
      this.users[index].role = updatedInfo.role;
      this.users[index].password = updatedInfo.password;
      this.users[index].date = updatedInfo.date;
      this.users[index].gender = updatedInfo.gender;
  
      return this.http.put(
        this.apiUrl + 'users.json',
        this.users
      );
    }
  
    
    updateRecord(id){
      // console.log("updateUserRecord function");
      this.updateUserRecords = null;
      var user = this.http.
      get
      (this.apiUrl + '/users/'+id+'.json').pipe(tap(
        Response=> {
        //  console.log(Response);
        this.updateUserRecords = Response;
        //  this.updateUserRecords.push(Response);
        }));
      return user;
    }

    getUpdateRecord(){
      // console.log(this.updateUserRecords);
      return this.updateUserRecords;      
    }

      
  }
  

