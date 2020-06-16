import { CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot, Router, UrlTree} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { AuthenticationService } from '../Services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private authenticationService : AuthenticationService,private router : Router){}

  canActivate(route : ActivatedRouteSnapshot , router : RouterStateSnapshot)
:boolean | Promise<boolean> | Observable<boolean | UrlTree>{
return this.authenticationService.userAuthentication.pipe(
 take(1),
 map (user => {
 const isAuth = !!user;
 if(isAuth){
     return true;
 }
 return this.router.createUrlTree(['/login']);
}));
}
}