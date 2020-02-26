import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

// Component
import { ModalAsignacionConfiguracionProductoComponent } from '../modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component';

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

  constructor(
    private modalAsignacionConfiguracionProducto: MatDialog,
    private inventarioService: InventarioService,
    private router: Router
  ) {
    this.myForm = new FormGroup({
      _idCabecera: new FormControl(''),
      _cabecera: new FormControl(''),
      _tipoTransaccion: new FormControl(''),
      _idRelacionLogica: new FormControl(''),
      _perteneceKit: new FormControl(''),
      _idKit: new FormControl(''),
      _kit: new FormControl(''),
      _producto: new FormControl('', [Validators.required]),
      _cantidad: new FormControl('', [Validators.required]),
      _fechaExpiracion: new FormControl(''),
      _precio: new FormControl('', [Validators.required]),
      _idLote: new FormControl(''),
      _lote: new FormControl(''),
      _idAsignarProductoLote: new FormControl(''),
    })
  }

  selected = 'Producto';
  seccionProducto = false;
  seccionKit = true;
  seleccionKit = false;
  realizarCompraButton = true;
  panelOpenState = false;
  dateIcon = true;
  selectTipoCompra = true;
  buttonGenerarFactura = false;
  buttonSeleccionarProducto = true;

  detalleCompra: any[] = [];
  kits: any[] = [];
  lotes: any[] = [];
  listaProductosDeUnKit: any[] = [];
  facturasNoFinalizadas: any[] = [];
  tipoCompra: any[] = [
    { tipo: 'Producto' },
    { tipo: 'Kit' }
  ]

  filteredOptions: Observable<string[]>;

  buscarFechaYPrecio() {
    var fechaExpiracion: any;
    fechaExpiracion = new Date(this._fechaExpiracion.value).toJSON();
    try {
      fechaExpiracion = fechaExpiracion.split('T')[0];
    } catch (error) { 
      fechaExpiracion = null
    }

    console.log(fechaExpiracion);
    
    if (this._idRelacionLogica.value != '' && this._perteneceKit.value != '') {
      this.inventarioService.buscarFechaYPrecio(
        this._idCabecera.value,
        this._idRelacionLogica.value,
        this._perteneceKit.value,
        fechaExpiracion,
        localStorage.getItem('miCuenta.getToken')
      )
        .then(
          ok => {
            console.log(ok['respuesta']);
            try {
              if (ok['respuesta'].IdDetalleFactura != null) {
                this._precio.disable();
                this._precio.setValue(ok['respuesta'].AsignarProductoLote[0].ValorUnitario);
              } else {
                this._precio.enable();
                this._precio.setValue('');
              }
            } catch (error) { }
          }
        )
        .catch(
          error => {
            console.log(error);
          }
        )
    }
  }

  addEvent() {
    this.dateIcon = false;
    this.buscarFechaYPrecio();
  }

  clearDate() {
    this.dateIcon = true;
    this._fechaExpiracion.setValue('');
  }

  onKeyUp() {
    this._precio.reset();
    this._precio.enable();
    this._fechaExpiracion.setValidators([Validators.required]);
    this._fechaExpiracion.updateValueAndValidity();
  }

  modificarCantidadDeProductoEnDetalle(event, element) {
    if (event.key == "Enter") {
      var cantidadAntigua = element.Cantidad;
      if (event.target.value <= 0) {
        event.target.value = cantidadAntigua;
      } else {
        this.inventarioService.modificarCantidadDeProductoEnDetalle(
          element.IdDetalleFactura,
          event.target.value,
          localStorage.getItem('miCuenta.putToken')
        )
          .then(
            ok => {
              if (ok['respuesta']) {
                this.consultarDetalleFactura();
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
  }

  selecionarTipoCompra(tipoCompra) {
    if (tipoCompra.value == 'Kit') {
      this.seleccionKit = true;
      this.seccionKit = false;
      this.seccionProducto = false;
      this.limpiarCampos();
    } else {
      this.listaProductosDeUnKit = [];
      this.seccionProducto = false;
      this.seccionKit = true;
      this.seleccionKit = false;
      this.limpiarCampos();
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
                  this._tipoTransaccion.setValue(item.IdTipoTransaccion);
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

  consultarLotesDeUnProducto() {
    this.inventarioService.consultarLotesDeUnProducto(
      this._idCabecera.value,
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.lotes = ok['respuesta'];
          this.filteredOptions = this._lote.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  seleccionarLoteSiExiste(lote) {
    this._idLote.setValue(lote.IdLote);
    this._lote.setValue(lote.Codigo);
    this._fechaExpiracion.setValue(lote.FechaExpiracion);
    this._fechaExpiracion.disable();
  }

  estructurarSiPerteneceALote(detalleFactura) {
    var datosLote: any;
    if (detalleFactura.AsignarProductoLote[0].IdLote != '') {
      datosLote = {
        IdLote: detalleFactura.AsignarProductoLote[0].IdLote,
        Lote: detalleFactura.AsignarProductoLote[0].Lote.Codigo,
        FechaExpiracion: detalleFactura.AsignarProductoLote[0].Lote.FechaExpiracion
      }
    }
    return datosLote;
  }

  estructurarSiPerteneceAKit(detalleFactura) {
    var datosKit: any;
    if (detalleFactura.AsignarProductoLote[0].AsignarProductoKits.IdKit != null) {
      datosKit = {
        IdKit: detalleFactura.AsignarProductoLote[0].AsignarProductoKits.IdKit,
        Kit: detalleFactura.AsignarProductoLote[0].AsignarProductoKits.Descripcion,
        IdProducto: detalleFactura.AsignarProductoLote[0].AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.IdConfigurarProducto,
        Codigo: detalleFactura.AsignarProductoLote[0].AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Codigo,
        Producto: detalleFactura.AsignarProductoLote[0].AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Producto.Nombre,
        Presentacion: detalleFactura.AsignarProductoLote[0].AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Presentacion.Descripcion,
        ContenidoNeto: detalleFactura.AsignarProductoLote[0].AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.CantidadMedida,
        Medida: detalleFactura.AsignarProductoLote[0].AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Medida.Descripcion,
      }
    }
    return datosKit;
  }

  consultarDetalleFactura() {
    this.inventarioService.consultarDetalleFactura(
      this._idCabecera.value,
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          ok['respuesta'].map(
            item => {
              var perteneceKit: any;
              var perteneceLote: any;
              var detalle: any;
              var datosKit: any;
              var estructuraFinal: any;
              this.detalleCompra = [];
              item.DetalleFactura.map(
                producto => {
                  perteneceLote = this.estructurarSiPerteneceALote(producto);
                  perteneceKit = this.estructurarSiPerteneceAKit(producto);
                  if (perteneceLote != null) {
                    detalle = {
                      IdDetalleFactura: producto.IdDetalleFactura,
                      Cantidad: producto.Cantidad,
                      ValorUnitario: producto.AsignarProductoLote[0].ValorUnitario,
                      IdCabeceraFactura: producto.IdCabeceraFactura,
                      IdLote: perteneceLote.IdLote,
                      Lote: perteneceLote.Lote,
                      FechaExpiracion: perteneceLote.FechaExpiracion,
                      Total: parseInt(producto.Cantidad) * parseInt(producto.AsignarProductoLote[0].ValorUnitario)
                    }
                  } else {
                    detalle = {
                      IdDetalleFactura: producto.IdDetalleFactura,
                      Cantidad: producto.Cantidad,
                      ValorUnitario: producto.AsignarProductoLote[0].ValorUnitario,
                      IdCabeceraFactura: producto.IdCabeceraFactura,
                      IdLote: '',
                      Lote: '',
                      FechaExpiracion: producto.AsignarProductoLote[0].FechaExpiracion,
                      Total: parseInt(producto.Cantidad) * parseInt(producto.AsignarProductoLote[0].ValorUnitario)
                    }
                  }
                  if (perteneceKit != null) {
                    datosKit = {
                      IdKit: perteneceKit.IdKit,
                      Kit: perteneceKit.Kit,
                      IdProducto: perteneceKit.IdProducto,
                      Codigo: perteneceKit.Codigo,
                      Producto: perteneceKit.Producto,
                      Presentacion: perteneceKit.Presentacion,
                      ContenidoNeto: perteneceKit.ContenidoNeto,
                      Medida: perteneceKit.Medida,
                    }
                  } else {
                    datosKit = {
                      Codigo: producto.AsignarProductoLote[0].ConfigurarProductos.Codigo,
                      IdKit: producto.AsignarProductoLote[0].AsignarProductoKits.IdKit,
                      Kit: producto.AsignarProductoLote[0].AsignarProductoKits.Descripcion,
                      IdProducto: producto.AsignarProductoLote[0].ConfigurarProductos.IdConfigurarProducto,
                      Producto: producto.AsignarProductoLote[0].ConfigurarProductos.Producto.Nombre,
                      Presentacion: producto.AsignarProductoLote[0].ConfigurarProductos.Presentacion.Descripcion,
                      ContenidoNeto: producto.AsignarProductoLote[0].ConfigurarProductos.CantidadMedida,
                      Medida: producto.AsignarProductoLote[0].ConfigurarProductos.Medida.Descripcion,
                    }
                  }
                  estructuraFinal = Object.assign(detalle, datosKit);
                  this.detalleCompra.push(estructuraFinal);
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
      this.validarSiPerteneceALote();
    }
  }

  crearCabeceraFactura() {
    this.inventarioService.crearCabeceraFactura(
      localStorage.getItem('miCuenta.idAsignacionTipoUsuario'),
      this._tipoTransaccion.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            this._idCabecera.setValue(ok['respuesta'].IdCabeceraFactura);
            this._cabecera.setValue(ok['respuesta'].Codigo);
            this.myForm.enable();
            this.selectTipoCompra = false;
            this.buttonSeleccionarProducto = false;
            this.buttonGenerarFactura = true;
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  limpiarCampos() {
    this._idRelacionLogica.reset();
    this._perteneceKit.reset();
    this._idKit.reset();
    this._kit.reset();
    this._producto.reset();
    this._cantidad.reset();
    this._fechaExpiracion.reset();
    this._precio.reset();
    this._idLote.reset();
    this._lote.reset();
    this._idAsignarProductoLote.reset();
  }

  crearDetalleFactura() {
    this.inventarioService.crearDetalleFactura(
      this._idCabecera.value,
      this._idAsignarProductoLote.value,
      this._cantidad.value,
      '0',
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          this.limpiarCampos();
          this.consultarDetalleFactura();
          this.dateIcon = true;
          this.realizarCompraButton = false;
          this._precio.enable();
          this._fechaExpiracion.clearValidators();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  seleccionarProducto(kit) {
    let dialogRef = this.modalAsignacionConfiguracionProducto.open(ModalAsignacionConfiguracionProductoComponent, {
      width: '600px',
      height: 'auto',
      data: {
        listaProductosDeUnKit: this.listaProductosDeUnKit,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        var producto = result.nombre + ' ' + result.presentacion + ' ' + result.contenidoNeto
          + ' ' + result.medida;
        this._idRelacionLogica.setValue(result.idRelacionLogica);
        this._perteneceKit.setValue(result.perteneceKit);
        this._producto.setValue(producto);
        this.consultarLotesDeUnProducto();
        this.buscarFechaYPrecio();
      }
    });
  }

  quitarDetalleFactura(DetalleFactura) {
    this.inventarioService.quitarDetalleFactura(
      DetalleFactura.IdDetalleFactura,
      DetalleFactura.IdCabeceraFactura,
      localStorage.getItem('miCuenta.deleteToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == '0') {
            this.detalleCompra = [];
            this._idCabecera.setValue('');
            this.consultarFacturasNoFinalizadas();
          } else {
            this.consultarDetalleFactura();
          }
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
      this._idCabecera.value,
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
    this.realizarCompraButton = false;
    this._idCabecera.setValue(factura.IdCabeceraFactura);
    this.consultarDetalleFactura();
    this._cabecera.setValue(factura.Codigo);
    this.myForm.enable();
    this.buttonSeleccionarProducto = false;
    this.selectTipoCompra = false;
  }

  crearLote() {
    var fecha = new Date(this._fechaExpiracion.value).toJSON();
    this.inventarioService.crearLote(
      this._lote.value,
      this._cantidad.value,
      fecha.split('T')[0],
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          if (typeof (ok['respuesta']) == 'string') {
            this._idLote.setValue(ok['respuesta']);
            this.asignarProductoLote(this._idLote.value, fecha);
          } else {
            this._idLote.setValue(ok['respuesta'].IdLote);
            this.asignarProductoLote(this._idLote.value, fecha);
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  validarSiPerteneceALote() {
    var fechaExpiracion: any
    fechaExpiracion = new Date(this._fechaExpiracion.value);
    var fechaActual = new Date();
    try {
      if (fechaExpiracion.getFullYear() < fechaActual.getFullYear()) {
        fechaExpiracion = null;
      } else {
        fechaExpiracion = fechaExpiracion.toJSON();
        fechaExpiracion = fechaExpiracion.split('T')[0];
      }
    } catch (error) {
      fechaExpiracion = null;
    }
    if (this._lote.value == '' || this._lote.value == null) {
      this.asignarProductoLote('', fechaExpiracion);
    } else {
      this.crearLote();
    }
  }

  asignarProductoLote(
    idLote?: string,
    fecha?: string
  ) {
    this.inventarioService.asignarProductoLote(
      this._idCabecera.value,
      this._cantidad.value,
      this._idRelacionLogica.value,
      this._perteneceKit.value,
      this._precio.value,
      localStorage.getItem('miCuenta.postToken'),
      idLote,
      fecha,
    )
      .then(
        ok => {
          this._idAsignarProductoLote.setValue(ok['respuesta']);
          this.crearDetalleFactura();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  get _cantidad() {
    return this.myForm.get('_cantidad');
  }

  get _idRelacionLogica() {
    return this.myForm.get('_idRelacionLogica');
  }

  get _perteneceKit() {
    return this.myForm.get('_perteneceKit');
  }

  get _idKit() {
    return this.myForm.get('_idKit');
  }

  get _kit() {
    return this.myForm.get('_kit');
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

  get _idCabecera() {
    return this.myForm.get('_idCabecera')
  }

  get _cabecera() {
    return this.myForm.get('_cabecera')
  }

  get _tipoTransaccion() {
    return this.myForm.get('_tipoTransaccion')
  }

  get _lote() {
    return this.myForm.get('_lote')
  }

  get _idLote() {
    return this.myForm.get('_idLote')
  }

  get _idAsignarProductoLote() {
    return this.myForm.get('_idAsignarProductoLote')
  }

  ngOnInit() {
    this.consultarKits();
    this.consultarTipoTransaccion();
    this.consultarFacturasNoFinalizadas();
    this.myForm.disable();
  }

  private _filter(value: string): string[] {
    try {
      const filterValue = value.toLowerCase();
      return this.lotes.filter(option => option.Codigo.toLowerCase().includes(filterValue));
    } catch (error) {
    }
  }

  tablaDetalleCompra = ['codigo', 'kit', 'descripcion', 'presentacion', 'lote', 'fechaExpiracion', 'valorUnitario', 'cantidad', 'total', 'acciones'];
  tablaFacturasNoFinalidas = ['codigo', 'usuario', 'fecha', 'acciones'];
}
