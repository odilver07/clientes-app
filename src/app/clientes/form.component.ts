import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})

export class FormComponent implements OnInit {

  regiones: Region[];
  cliente: Cliente = new Cliente();
  titulo: string = "Crear cliente";

  errores: string[];

  constructor(private clienteService: ClienteService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute) { }

  ngOnInit(){
    this.cargarCliente();
    this.cargarRegiones();
  }
  
  cargarCliente(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente => this.cliente = cliente))
      }
    })
  }
  
  cargarRegiones(): void{
    this.clienteService.getRegiones().subscribe((regiones) => this.regiones =  regiones)
  }

  public create(): void{
    this.clienteService.create(this.cliente)
    .subscribe(json => {
      this.router.navigate(['/clientes'])
      Swal.fire('Nuevo Cliente','Cliente guardado con exito','success')
    },
    err => {
      this.errores = err.error.errors as string[];
    }
    )
  }

  update(){
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        Swal.fire('Guardado',`Cliente ${json.usuario.nombre} con exito`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    )
  }

  compararRegion(o1:Region,o2:Region): boolean{
    if(o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 == null || o2 == null? false : o1.id === o2.id;
  }
}
