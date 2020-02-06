import { Component, OnInit } from '@angular/core';

// Components
import { ModalDetalleProductoComponent } from '../modal-detalle-producto/modal-detalle-producto.component';

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Interfaces
import { Producto } from 'src/app/interfaces/producto/producto';
import { Kit } from 'src/app/interfaces/kit/kit';

// Services
import { InventarioService } from 'src/app/services/inventario.service';

// SweetAlert
import sweetalert from 'sweetalert';

export interface DetalleProducto {
  presentacion: string,
  contenidoNeto: string,
  medida: string
}

@Component({
  selector: 'app-armar-kit',
  templateUrl: './armar-kit.component.html',
  styleUrls: ['./armar-kit.component.css']
})
export class ArmarKitComponent implements OnInit {

  constructor(
    private inventarioService: InventarioService,
    private dialog: MatDialog,
  ) { }

  idKit = '0';
  productos: any[] = [];
  kits: Kit[] = [];

  listaProductosDeUnKit: any[] = [];
  Arrayproductos: any[] = [];

  onChangeSelectKit(idKit) {
    this.idKit = idKit;
    this.consultarKitsYSusProductos(idKit);
    this.consultarProductos(idKit);
  }

  applyFilter(event) {
    this._filterTable(event,this.productos);
  }
  
  private _filterTable(value: string,arreglo: any[]) {
    const filterValue = value.toLowerCase();
    if(value == '')
    {
      this.productos = this.Arrayproductos;
    }else
    {
      this.productos = this.Arrayproductos.filter(option =>option['Producto']['Nombre'].trim().toLowerCase().includes(filterValue.trim()));
    }
  }

  consultarKitsYSusProductos(idKit) {
    this.inventarioService.consultarKitsYSusProductos(
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
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarProductos(idKit) {
    this.inventarioService.consultarProductosQueNoTieneUnKit(
      idKit,
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.productos = [];
          this.productos = ok['respuesta'];
          this.Arrayproductos = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarDetalleProducto(producto, estructura) {
    var detalleProducto: DetalleProducto;
    if(estructura == 'productoDeUnKit') {
      detalleProducto = {
        presentacion: producto.ListaProductos.Presentacion.Descripcion,
        contenidoNeto: producto.ListaProductos.CantidadMedida,
        medida: producto.ListaProductos.Medida.Descripcion
      }
      let dialogRef = this.dialog.open(ModalDetalleProductoComponent, {
        width: '325px',
        height: '275px',
        data: {
          producto: detalleProducto
        }
      });
    } else if(estructura == 'productoSinkit') {
      detalleProducto = {
        presentacion: producto.Presentacion.Descripcion,
        contenidoNeto: producto.CantidadMedida,
        medida: producto.Medida.Descripcion
      }
      let dialogRef = this.dialog.open(ModalDetalleProductoComponent, {
        width: '325px',
        height: '275px',
        data: {
          producto: detalleProducto
        }
      });
    }
  }

  agregarProductoDelKit(producto) {
    this.inventarioService.crearAsignacionProductoKit(
      producto.IdConfigurarProducto,
      this.idKit,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          if (ok['respuesta']) {
            this.consultarKitsYSusProductos(this.idKit);
            this.consultarProductos(this.idKit);
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
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
          this.inventarioService.eliminarAsignacionProductoKit(
            producto.IdAsignarProductoKit,
            localStorage.getItem('miCuenta.deleteToken')
          )
            .then(
              ok => {
                if (ok['respuesta']) {
                  this.consultarKitsYSusProductos(producto.IdKit);
                  this.consultarProductos(producto.IdKit);
                }
              }
            )
            .catch(
              error => {
                console.log(error);
              }
            )
        }
      });
  }

  ngOnInit() {
    this.consultarKits();
  }

  tablaProductos = ['codigo', 'descripcion', 'tipoProducto', 'acciones'];
  tablaProductosDeUnKit = ['codigo', 'descripcion', 'tipoProducto', 'acciones'];

}
