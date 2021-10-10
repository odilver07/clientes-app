import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Observable, of, throwError} from 'rxjs';
import { Cliente } from './cliente';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';

import { Router } from '@angular/router';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';

@Injectable()
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes'
  constructor(private http: HttpClient, private router: Router,
    private authService: AuthService) { }

    private isNoAutorizado(e): boolean{
      if(e.status == 401){
        if(this.authService.isAuthenticated()){
          this.authService.logout();
        }
        Swal.fire(
          'Error',
          `Acesso denegado`,
          'success'
        )
        this.router.navigate(['/login']);
        return true;
      }

      if(e.status == 403){
        Swal.fire(
          'Error',
          `Acesso denegado`,
          'success'
        )
        this.router.navigate(['/clientes']);
        return true;
      }
      return false;
    }

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones');
  }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page ).pipe(
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre =  cliente.nombre.toUpperCase();
          return cliente;
        });
        return response;
      }),
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    )
  }

  create(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint, cliente).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        // if(e.status != 401 && e.error.mensaje){
        //   this.router.navigate(['/clientes']);
        //   console.error(e.error.mensaje);
        // }
        return throwError(e);
      })
    )
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    )
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    )
  }

  subirfoto(archivo: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload` , formData, {
      reportProgress: true,
    });

    return this.http.request(req);
  }
}
