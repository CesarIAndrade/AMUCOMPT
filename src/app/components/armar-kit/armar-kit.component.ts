import { Component, OnInit,ViewChild } from '@angular/core';

// Components
import { ModalDetalleProductoComponent } from '../modal-detalle-producto/modal-detalle-producto.component';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
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

  // Para la paginacion
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  productos = new MatTableDataSource<Element[]>();
  listaProductosDeUnKit = new MatTableDataSource<Element[]>();

  kits: any[] = [];
  Arrayproductos: any[] = [];

  onChangeSelectKit() {
    var kit = this.kits.find(kit => kit.IdKit == this._idKit.value);
    this._idAsignarDescuentoKit.setValue(kit.AsignarDescuentoKit.IdAsignarDescuentoKit);
    this.consultarKitsYSusProductos(this._idKit.value);
    this.consultarProductos(this._idKit.value);
  }

  applyFilter(event) {
    this._filterTable(event,this.productos.data);
  }

  private _filterTable(value: string,arreglo: any[]) {
    const filterValue = value.toLowerCase();
    if(value == '') {
      this.productos.data = this.Arrayproductos;
    } else {
      this.productos.data = this.Arrayproductos.filter(option =>option['Producto']['Nombre'].trim().toLowerCase().includes(filterValue.trim()));
    }
  }

  consultarKitsYSusProductos(idKit) {
    const url = "Inventario/ListaAsignarProductoKit";
    this.inventarioService.consultarKitsYSusProductos(
      idKit,
      localStorage.getItem('miCuenta.getToken'),
      url
    )
      .then(
        ok => {
          this.listaProductosDeUnKit.data = [];
          this.listaProductosDeUnKit.data = ok['respuesta'][0]['ListaAsignarProductoKit'];
          this.listaProductosDeUnKit.paginator = this.paginator;
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
          this.productos.data = [];
          this.productos.data = ok['respuesta'];
          this.productos.paginator = this.paginator;
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
        width: '400px',
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
        width: '400px',
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
