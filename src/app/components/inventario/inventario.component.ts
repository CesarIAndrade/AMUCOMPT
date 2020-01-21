import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoProductoComponent } from '../tipo-producto/tipo-producto.component';
import { ProductoComponent } from '../producto/producto.component';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  @ViewChild(ProductoComponent, {static: false}) tabProducto: ProductoComponent; 

  constructor() { }
  
  nuevoProductoCreado = false;

  verificarNuevoTipoProductoCreado(event) {
    console.log(event);
    if(event){
      this.tabProducto.ngOnInit();
    }
  }

  ngOnInit() {
  }

}
