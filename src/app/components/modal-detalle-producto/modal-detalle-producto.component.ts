import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-detalle-producto',
  templateUrl: './modal-detalle-producto.component.html',
  styleUrls: ['./modal-detalle-producto.component.css']
})
export class ModalDetalleProductoComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  presentacion: string;
  contenidoNeto: string;
  medida: string;

  ngOnInit() {
    this.presentacion = this.data.producto.presentacion;
    this.contenidoNeto = this.data.producto.contenidoNeto;
    this.medida = this.data.producto.medida;
  }

}
