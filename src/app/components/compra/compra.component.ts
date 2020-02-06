import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

// Component
import { ModalAsignacionConfiguracionProductoComponent } from '../modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component';

// Interfaces
import { DetallesCompra } from 'src/app/interfaces/detalles-compra/detalles-compra';

// Services
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
      _idKit: new FormControl(''),
      _kit: new FormControl(''),
      _producto: new FormControl('', [Validators.required]),
      _cantidad: new FormControl('', [Validators.required]),
      _fechaExpiracion: new FormControl((new Date()).toJSON(), [Validators.required]),
      _precio: new FormControl('', [Validators.required]),
    })
  }

  codigo = '000';
  botonInsertar = 'ingresar';
  idCabecera: string
  tipoTransaccion: string;

  seccionProducto = false;
  seccionKit = true;
  seleccionKit = false

  detallesCompra: any[] = [];
  kits: any[] = [];
  listaProductosDeUnKit: any[] = [];
  facturasNoFinalizadas: any[] = [];

  varificarTipoCompra(tipoCompra) {
    if (tipoCompra.value == '2') {
      this.seleccionKit = true;
      this.seccionKit = false;
      this.seccionProducto = false;
    } else {
      this.listaProductosDeUnKit = [];
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

  consultarDetalleFactura() {
    this.inventarioService.consultarDetalleFactura(
      this.idCabecera,
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.detallesCompra = [];
          var detalleCompra: DetallesCompra;
          ok['respuesta'].map(
            item => {
              item.DetalleFactura.map(
                producto => {
                  if (producto.AsignarProductoKits != null) {
                    detalleCompra = {
                      IdDetalleFactura: producto.IdDetalleFactura,
                      IdCabeceraFactura: producto.IdCabeceraFactura,
                      IdProducto: producto.AsignarProductoKits.ListaAsignarProductoKit[0].IdConfigurarProducto,
                      IdKit: producto.AsignarProductoKits.IdKit,
                      Kit: producto.AsignarProductoKits.Descripcion,
                      Producto: producto.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Producto.Nombre,
                      Presentacion: producto.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Presentacion.Descripcion,
                      ContenidoNeto: producto.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.CantidadMedida,
                      Medida: producto.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Medida.Descripcion
                    }
                    this.detallesCompra.push(detalleCompra);
                  } else {
                    detalleCompra = {
                      IdDetalleFactura: producto.IdDetalleFactura,
                      IdCabeceraFactura: producto.IdCabeceraFactura,
                      IdProducto: producto.ConfigurarProductos.IdConfigurarProducto,
                      IdKit: '',
                      Kit: '',
                      Producto: producto.ConfigurarProductos.Producto.Nombre,
                      Presentacion: producto.ConfigurarProductos.Presentacion.Descripcion,
                      ContenidoNeto: producto.ConfigurarProductos.CantidadMedida,
                      Medida: producto.ConfigurarProductos.Medida.Descripcion
                    }
                    this.detallesCompra.push(detalleCompra);
                  }
                }
              )
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

  consultarFacturasNoFinalizadas() {
    this.inventarioService.consultarFacturasNoFinalizadas(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.facturasNoFinalizadas = ok['respuesta'];
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
      if (this.testButton.nativeElement.value == 'ingresar') {
        this.crearCabeceraFactura();
      } else if (this.testButton.nativeElement.value == 'agregarDetalles') {
        this.crearDetalleFactura();
      } else if (this.testButton.nativeElement.value == 'actualizarFactura') {
        this.crearDetalleFactura();
      }
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
            this.testButton.nativeElement.value = 'agregarDetalles';
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
    var fecha = new Date(this._fechaExpiracion.value).toJSON();
    if (this._idAsignarProductoKit.value == '') {
      this.inventarioService.crearDetalleFactura(
        this.idCabecera,
        this._idConfigurarProducto.value,
        'false',
        this._cantidad.value,
        fecha.split('T')[0],
        this._precio.value,
        '0',
        localStorage.getItem('miCuenta.postToken')
      )
        .then(
          ok => {
            if (ok['respuesta']) {
              this.consultarDetalleFactura();
              this.codigo = this._codigo.value;
              this.myForm.reset();
              this._fechaExpiracion.setValue((new Date()).toJSON());
              this._codigo.setValue(this.codigo);
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
        'true',
        this._cantidad.value,
        fecha.split('T')[0],
        this._precio.value,
        '0',
        localStorage.getItem('miCuenta.postToken')
      )
        .then(
          ok => {
            if (ok['respuesta']) {
              this.consultarDetalleFactura();
              this.codigo = this._codigo.value;
              this.myForm.reset();
              this._fechaExpiracion.setValue((new Date()).toJSON());
              this._codigo.setValue(this.codigo);
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
      width: '500px',
      height: '500px',
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
      }
    });
  }

  quitarDetalle(DetalleFactura) {
    this.inventarioService.eliminarDetalleFactura(
      DetalleFactura.IdDetalleFactura,
      DetalleFactura.IdCabeceraFactura,
      localStorage.getItem('miCuenta.deleteToken')
    )
      .then(
        ok => {
          console.log(ok['respuesta']);
          this.consultarDetalleFactura();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  realizarCompra() {
    this.inventarioService.finalizarFactura(
      this.idCabecera,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          if (ok['respuesta']) {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.consultarFacturasNoFinalizadas();
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

  mostrarDetallesFactura(factura) {
    this.detallesCompra = [];
    this._codigo.disable();
    this.testButton.nativeElement.value = 'actualizarFactura';
    var detalleCompra: DetallesCompra;
    this.idCabecera = factura.IdCabeceraFactura;
    this._codigo.setValue(factura.Codigo);
    factura.DetalleFactura.map(
      item => {
        if (item.AsignarProductoKits != null) {
          detalleCompra = {
            IdDetalleFactura: item.IdDetalleFactura,
            IdCabeceraFactura: item.IdCabeceraFactura,
            IdProducto: item.AsignarProductoKits.ListaAsignarProductoKit[0].IdConfigurarProducto,
            IdKit: item.AsignarProductoKits.IdKit,
            Kit: item.AsignarProductoKits.Descripcion,
            Producto: item.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Producto.Nombre,
            Presentacion: item.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Presentacion.Descripcion,
            ContenidoNeto: item.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.CantidadMedida,
            Medida: item.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Medida.Descripcion
          }
          this.detallesCompra.push(detalleCompra);
        } else {
          detalleCompra = {
            IdDetalleFactura: item.IdDetalleFactura,
            IdCabeceraFactura: item.IdCabeceraFactura,
            IdProducto: item.ConfigurarProductos.IdConfigurarProducto,
            IdKit: '',
            Kit: '',
            Producto: item.ConfigurarProductos.Producto.Nombre,
            Presentacion: item.ConfigurarProductos.Presentacion.Descripcion,
            ContenidoNeto: item.ConfigurarProductos.CantidadMedida,
            Medida: item.ConfigurarProductos.Medida.Descripcion
          }
          this.detallesCompra.push(detalleCompra);
        }
      }
    )
  }

  get _codigo() {
    return this.myForm.get('_codigo');
  }

  get _cantidad() {
    return this.myForm.get('_cantidad');
  }

  get _idKit() {
    return this.myForm.get('_idKit');
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
    this.consultarFacturasNoFinalizadas();
  }

  tablaDetalleCompra = ['kit', 'descripcion', 'acciones'];
  tablaFacturasNoFinalidas = ['codigo', 'usuario', 'fecha', 'acciones'];
}
