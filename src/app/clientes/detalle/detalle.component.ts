import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Factura } from 'src/app/facturas/models/factura';
import { FacturasService } from 'src/app/facturas/services/facturas.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  fotoSeleccionada: File;
  @Input() cliente: Cliente;
  
  progreso: number =0;
  constructor(private clienteService: ClienteService,
    private modalService: ModalService,
    public authService: AuthService,
    public facturaService: FacturasService
   ) { }

  ngOnInit(): void {
    // this.activatedRoute.paramMap.subscribe(params => {
    //   let id = +params.get('id');
    //   if(id){
    //     this.clienteService.getCliente(id).subscribe(cliente => {
    //       this.cliente = cliente;
    //     });
    //   }
    // })
  }

  

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe seleccionar una foto'
      });
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No ha seleccionado una foto'
      });
    }else {
      this.clienteService.subirfoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        event => {
          if(event.type === HttpEventType.UploadProgress){
            this.progreso =  Math.round((event.loaded/event.total)*100);
          }else if(event.type === HttpEventType.Response){
            let response: any = event.body;
            this.cliente  = response.cliente as Cliente;
            this.modalService.notificarUpload.emit(this.cliente);
            Swal.fire(
              'Actualizado!',
              response.mensaje,
              'success'
            )
          }
          // this.cliente = cliente;
        }
      );
      this.fotoSeleccionada = null;
    }
  }

  cerrarModal(){
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura): void{
    Swal.fire({
      title: 'Estas seguro?',
      text: `Estas apunto de eliminar la factura`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(
          () => {
            this.cliente.facturas =  this.cliente.facturas.filter(c => c !== factura)
            Swal.fire(
              'Factura eliminada',
              'Se elimino la factura correctamente',
              'success'
            )
          })
      }
    })
  }
}
