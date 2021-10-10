import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo:string = 'Por favor Sign in';
  usuario:Usuario;

  constructor(private authService: AuthService, protected router: Router) {
    this.usuario =  new Usuario();
   }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      Swal.fire(
        'Hey!',
        `Hola ${this.authService.usuario.username} ya estas autenticado`,
        'info'
      )
      this.router.navigate(['/clientes']);
    }
  }

  login(): void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'llene todos los datos del formulario'
      });
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      this.router.navigate(['/clientes']);
      Swal.fire(
        'Inicio de sesion correcto',
        `Hola ${this.authService.usuario.username}`,
        'success'
      )
    }, err => {
      if(err.status == 400){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Datos incorrectos'
        });
      }
    })
  }

}
