import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoComponent } from '../producto/producto.component';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  @ViewChild(ProductoComponent, {static: false}) tabProducto: ProductoComponent; 

  constructor() { }
  
  verificarNuevoTipoProductoCreado(event) {
    if(event){
      this.tabProducto.ngOnInit();
    }
  }

  ngOnInit() {
  }

}
