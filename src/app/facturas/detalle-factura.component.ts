import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Factura } from './models/factura';
import { FacturasService } from './services/facturas.service';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit {
  factura: Factura;
  titulo: string = 'Detalle factura';

  constructor(private facturaService: FacturasService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id= +params.get('id');
      this.facturaService.getFactura(id).subscribe(factura => {
        this.factura =  factura;
      })
    });
  }

}
