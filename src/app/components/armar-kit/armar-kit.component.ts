import { Component, OnInit } from '@angular/core';

// Interfaces
import { Producto } from 'src/app/interfaces/producto/producto';
import { Kit } from 'src/app/interfaces/kit/kit';

// Services
import { InventarioService } from 'src/app/services/inventario.service';

// SweetAlert
import sweetalert from 'sweetalert';

@Component({
  selector: 'app-armar-kit',
  templateUrl: './armar-kit.component.html',
  styleUrls: ['./armar-kit.component.css']
})
export class ArmarKitComponent implements OnInit {

  constructor(private inventarioService: InventarioService) { }

  productos: Producto[] = [];
  kits: Kit[] = [];

  listaProductosDeUnKit: any[] = [];

  onChangeSelectKit(idKit) {
    this.consultarKitsYSusProductosDeUn(idKit);
  }

  consultarKitsYSusProductosDeUn(idKit) {
    this.inventarioService.consultarKitsYSusProductosDeUn(
      idKit,
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.listaProductosDeUnKit = [];
          this.listaProductosDeUnKit = ok['respuesta'][0]['ListaAsignarProductoKit'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarKits() {
    this.inventarioService.consultarKits(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.kits = [];
          this.kits = ok['respuesta'];
          this.consultarProductos();
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


  agregarProductoDelKit(producto) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea agregar al Kit?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          console.log('ok');
        }
      });
  }

  eliminarProductoDelKit(producto) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea quitar del Kit?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          console.log('ok');
        }
      });
  }

  ngOnInit() {
    this.consultarKits();
  }

  tablaProductos = ['nombre', 'codigo', 'acciones'];

  tablaProductosDeUnKit = ['nombre', 'tipoProducto', 'codigo', 'presentacion', 'contenidoNeto', 'medida', 'acciones']

}
