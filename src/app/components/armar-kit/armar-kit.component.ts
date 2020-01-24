import { Component, OnInit } from '@angular/core';
import { InventarioService } from 'src/app/services/inventario.service';
import { Producto } from 'src/app/interfaces/producto/producto';
import { Kit } from 'src/app/interfaces/kit/kit';

@Component({
  selector: 'app-armar-kit',
  templateUrl: './armar-kit.component.html',
  styleUrls: ['./armar-kit.component.css']
})
export class ArmarKitComponent implements OnInit {

  constructor(private inventarioService: InventarioService) { }

  productos: Producto[] = [];
  kits: Kit[] = [];

  consultarKits() {
    this.inventarioService.consultarKits(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.kits = [];
          this.kits = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarProductos() {
    this.inventarioService.consultarProductos(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.productos = [];
          this.productos = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  ngOnInit() {
  }

  tablaProductos = ['nombre', 'codigo', 'acciones'];

}
