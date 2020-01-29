import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DetallesCompra } from 'src/app/interfaces/detalles-compra/detalles-compra';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ModalAsignacionConfiguracionProductoComponent } from '../modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component';
import { InventarioService } from 'src/app/services/inventario.service';

// SweetAlert
import sweetalert from "sweetalert"
import { Router } from '@angular/router';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(
    private modalAsignacionConfiguracionProducto: MatDialog,
    private inventarioService: InventarioService,
    private router: Router
  ) {
    this.myForm = new FormGroup({
      _codigo: new FormControl('', [Validators.required]),
      _idConfigurarProducto: new FormControl(''),
      _idAsignarProductoKit: new FormControl(''),
      _producto: new FormControl('', [Validators.required]),
      _cantidad: new FormControl('', [Validators.required]),
      _fechaExpiracion: new FormControl((new Date()).toJSON(), [Validators.required]),
      _precio: new FormControl('', [Validators.required]),
      _kit: new FormControl(''),
    })
  }

  botonInsertar = 'ingresar';
  idCabecera: string
  tipoTransaccion: string;

  seccionProducto = false;
  seccionKit = true;
  seleccionKit = false

  detallesCompra: DetallesCompra[] = [
    {
      IdProducto: '1',
      IdKit: '1',
      Kit: 'Colas',
      Producto: 'Coca Cola',
      Presentacion: 'Botella',
      ContenidoNeto: '1',
      Medida: 'Litros'
    },
    {
      IdProducto: '1',
      IdKit: '',
      Kit: '',
      Producto: 'Agua',
      Presentacion: 'Botella',
      ContenidoNeto: '1',
      Medida: 'Litros'
    },
  ];
  kits: any[] = [];
  listaProductosDeUnKit: any[] = [];

  varificarTipoCompra(tipoCompra) {
    if (tipoCompra.value == '2') {
      this.seleccionKit = true;
      this.seccionKit = false;
      this.seccionProducto = false;
    } else {
      this.seccionProducto = false;
      this.seccionKit = true;
    }
  }

  consultarTipoTransaccion() {
    this.inventarioService.consultarTipoTransaccion(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          if (this.router.url === '/inicio/compras') {
            ok['respuesta'].map(
              item => {
                if (item.Descripcion == 'COMPRA') {
                  this.tipoTransaccion = item.IdTipoTransaccion;
                }
              }
            )
          }
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
          ok['respuesta'].map(
            item => {
              if (item.KitUtilizado == '1') {
                this.kits.push(item);
              }
            }
          )
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
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

  onChangeSelectKit(idKit) {
    this.seleccionKit = false;
    this.consultarKitsYSusProductos(idKit);
  }

  validarFormulario() {
    if (this.myForm.valid) {
      this.crearCabeceraFactura();
    }
  }

  crearCabeceraFactura() {
    this.inventarioService.crearCabeceraFactura(
      this._codigo.value,
      localStorage.getItem('miCuenta.idAsignacionTipoUsuario'),
      this.tipoTransaccion,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            this.idCabecera = ok['respuesta'];
            this.crearDetalleFactura();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  crearDetalleFactura() {
    if (this._idAsignarProductoKit.value == '') {
      this.inventarioService.crearDetalleFactura(
        this.idCabecera,
        this._idConfigurarProducto.value,
        '0',
        this._cantidad.value,
        this._fechaExpiracion.value.split('T')[0],
        this._precio.value,
        '0',
        localStorage.getItem('miCuenta.postToken')
      )
        .then(
          ok => {

            if (ok['respuesta']) {
              sweetAlert("Todo bien!", {
                icon: "success",
              });
            } else {
              sweetAlert("Ha ocurrido un error!", {
                icon: "error",
              });
            }
          }
        )
        .catch(
          error => {
            console.log(error);
          }
        )
    } else {
      this.inventarioService.crearDetalleFactura(
        this.idCabecera,
        this._idAsignarProductoKit.value,
        '1',
        this._cantidad.value,
        this._fechaExpiracion.value.split('T')[0],
        this._precio.value,
        '0',
        localStorage.getItem('miCuenta.postToken')
      )
        .then(
          ok => {

            if (ok['respuesta']) {
              sweetAlert("Todo bien!", {
                icon: "success",
              });
            } else {
              sweetAlert("Ha ocurrido un error!", {
                icon: "error",
              });
            }
          }
        )
        .catch(
          error => {
            console.log(error);
          }
        )
    }
  }

  seleccionarProducto(kit) {
    let dialogRef = this.modalAsignacionConfiguracionProducto.open(ModalAsignacionConfiguracionProductoComponent, {
      width: '50rem',
      height: '50rem',
      data: {
        listaProductosDeUnKit: this.listaProductosDeUnKit,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        var producto = result.nombre + ' ' + result.presentacion + ' ' + result.contenidoNeto
          + ' ' + result.medida;
        this._idConfigurarProducto.setValue(result.idConfigurarProducto);
        this._producto.setValue(producto);
        this._idAsignarProductoKit.setValue(result.idAsignarProductoKit);
        console.log(this._idAsignarProductoKit.value);
      }
    });
  }

  quitarDetalle(producto) {
    console.log(producto);
  }

  get _codigo() {
    return this.myForm.get('_codigo');
  }

  get _cantidad() {
    return this.myForm.get('_cantidad');
  }

  get _kit() {
    return this.myForm.get('_kit');
  }

  get _idConfigurarProducto() {
    return this.myForm.get('_idConfigurarProducto');
  }

  get _idAsignarProductoKit() {
    return this.myForm.get('_idAsignarProductoKit');
  }

  get _producto() {
    return this.myForm.get('_producto');
  }

  get _fechaExpiracion() {
    return this.myForm.get('_fechaExpiracion');
  }

  get _precio() {
    return this.myForm.get('_precio');
  }

  ngOnInit() {
    this.consultarKits();
    this.consultarTipoTransaccion();
    console.log(localStorage.getItem('miCuenta.idAsignacionTipoUsuario'));
    console.log(localStorage.getItem('miCuenta.getToken'));
  }

  tablaDetalleCompra = ['kit', 'descripcion', 'acciones'];

}
