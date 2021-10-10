import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService:AuthService,
    protected router: Router) { }

  ngOnInit(): void { 
  }

  logout():void{
    Swal.fire(
      'Sesion cerrada',
      `Adios ${this.authService.usuario.username}`,
      'success'
    )
    this.authService.logout();
      this.router.navigate(['/login']);
  }

}
