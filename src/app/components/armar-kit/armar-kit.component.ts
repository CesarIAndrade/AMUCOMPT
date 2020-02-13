import { Component, OnInit } from '@angular/core';

// Components
import { ModalDetalleProductoComponent } from '../modal-detalle-producto/modal-detalle-producto.component';

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Services
import { InventarioService } from 'src/app/services/inventario.service';

// SweetAlert
import sweetalert from 'sweetalert';
import { FormGroup, FormControl } from '@angular/forms';

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

  myForm: FormGroup;
  constructor(
    private inventarioService: InventarioService,
    private dialog: MatDialog,
  ) {
    this.myForm = new FormGroup({
      _idKit: new FormControl(''),
      _idAsignarDescuentoKit: new FormControl('')
    })
   }

   get _idKit() {
     return this.myForm.get('_idKit');
   }

   get _idAsignarDescuentoKit() {
    return this.myForm.get('_idAsignarDescuentoKit');
  }
  
  productos: any[] = [];
  kits: any[] = [];

  listaProductosDeUnKit: any[] = [];
  Arrayproductos: any[] = [];

  onChangeSelectKit() {
    var kit = this.kits.find(kit => kit.IdKit == this._idKit.value);
    this._idAsignarDescuentoKit.setValue(kit.AsignarDescuentoKit.IdAsignarDescuentoKit);
    this.consultarKitsYSusProductos(this._idKit.value);
    this.consultarProductos(this._idKit.value);
  }

  applyFilter(event) {
    this._filterTable(event,this.productos);
  }
  
  private _filterTable(value: string,arreglo: any[]) {
    const filterValue = value.toLowerCase();
    if(value == '') {
      this.productos = this.Arrayproductos;
    } else {
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
        width: '300px',
        height: 'auto',
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
        width: '300px',
        height: 'auto',
        data: {
          producto: detalleProducto
        }
      });
    }
  }

  asignarProductoKit(producto) {
    this.inventarioService.asignarProductoKit(
      producto.IdConfigurarProducto,
      this._idAsignarDescuentoKit.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          if (ok['respuesta']) {
            this.consultarKitsYSusProductos(this._idKit.value);
            this.consultarProductos(this._idKit.value);
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarAsignacionProductoKit(producto) {
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
                  this.consultarKitsYSusProductos(this._idKit.value);
                  this.consultarProductos(this._idKit.value);
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
