import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authServie: AuthService,
    private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authServie.isAuthenticated()){
        if(this.isTokenExpirado()){
          this.authServie.logout();
          this.router.navigate(['/login'])
          return false;
        }
        return true;        
      }
      this.router.navigate(['/login'])
      return false;
  }

  isTokenExpirado(): boolean{
    let token = this.authServie.token;
    let payload =  this.authServie.obtenerDatosToken(token);
    let now = new Date().getTime()/1000;
    if(payload.exp < now ){
      return true;
    }
    return false;
  }
  
}
