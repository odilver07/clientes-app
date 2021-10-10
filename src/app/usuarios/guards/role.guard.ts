import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  role?: string;
  constructor(private authServie: AuthService,
    private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if(!this.authServie.isAuthenticated()){
        this.router.navigate(['/login']);
        return false;        
      }
      
      this.role = next.data['role'] as string;
      console.log(this.role);
      
      if(this.authServie.hasRole(this.role)){
        return true
      }
      Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
      });
      this.router.navigate(['/clientes'])
      return false;
  }
  
}
