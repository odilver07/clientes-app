import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private urlEndPoint: string =  'http://localhost:8080/api/factura';
  constructor(private http: HttpClient) { }

  getFactura(id:number): Observable<Factura>{
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  filtrarProductos(term:string): Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.urlEndPoint}/filtar-productos/${term}`)
  }
  
  create(factura: Factura): Observable<Factura>{
    return this.http.post<Factura>(this.urlEndPoint, factura);
  }
}
