import { Component, OnInit } from '@angular/core';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    public authService: AuthService) { }

  ngOnInit(){
    this.activatedRoute.paramMap.subscribe (params => {
      let page: number = +params.get('page');

      if(!page){
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe(
      response => {
        this.clientes = response.content as Cliente[];
        this.paginador = response
      });
    })
    
    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(c => {
        if(cliente.id == c.id){
          c.foto = cliente.foto; 
        }
        return c;
      })
    })

    

  }

  delete(cliente: Cliente): void{
    Swal.fire({
      title: 'Estas seguro?',
      text: `Estas apunto de eliminar a ${cliente.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes =  this.clientes.filter(c => c != cliente)
            Swal.fire(
              'Eliminado!',
              `Se elimino al usuario ${cliente.nombre}`,
              'success'
            )
          })
      }
    })
    
  }

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
  }

}
