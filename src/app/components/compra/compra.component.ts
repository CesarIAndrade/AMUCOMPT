import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
      _tipoTransaccion: new FormControl(''),
      _idRelacionLogica: new FormControl(''),
      _perteneceKit: new FormControl(''),
      _idKit: new FormControl(''),
      _kit: new FormControl(''),
      // , [Validators.required]
      _producto: new FormControl(''),
      _cantidad: new FormControl(''),
      _fechaExpiracion: new FormControl(''),
      _precio: new FormControl(''),
      _idLote: new FormControl(''),
      _lote: new FormControl(''),
      _idAsignarProductoLote: new FormControl(''),
      _tipoCompra: new FormControl('')
    })
  }

  tipoCompra: any[] = [
    {
      tipo: 'Producto'
    },
    {
      tipo: 'Kit'
    }
  ]

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

  botonInsertar = 'ingresar';
  selected = 'Producto';
  seccionProducto = false;
  seccionKit = true;
  seleccionKit = false;
  realizarCompraButton = true;
  panelOpenState = false;

  detalleCompra: any[] = [];
  kits: any[] = [];
  lotes: any[] = [];
  listaProductosDeUnKit: any[] = [];
  facturasNoFinalizadas: any[] = [];

  filteredOptions: Observable<string[]>;

  varificarTipoCompra(tipoCompra) {

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
      this._idRelacionLogica.value,
      this._perteneceKit.value,
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

  consultarDetalleFactura() {
    this.inventarioService.consultarDetalleFactura(
      this._idCabecera.value,
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          console.log(ok['respuesta']);
          ok['respuesta'].map(
            item => {
              var lote: string;
              var fechaExpiracionLote: string;
              var detalle: any;
              this.detalleCompra = [];
              item.DetalleFactura.map(
                producto => {
                  console.log();
                  
                  if (String(producto.AsignarProductoLote[0].Lote) == 'undefined' 
                  || String(producto.AsignarProductoLote[0].Lote) == 'null') {
                    lote = '';
                    fechaExpiracionLote = '';
                  } else {
                    lote = producto.AsignarProductoLote[0].Lote.Codigo;
                    fechaExpiracionLote = producto.AsignarProductoLote[0].Lote.FechaExpiracion;
                    console.log(lote);
                  }
                  if (producto.AsignarProductoLote[0].PerteneceKit == 'True') {
                    detalle = {
                      IdDetalleFactura: producto.IdDetalleFactura,
                      Cantidad: producto.Cantidad,
                      ValorUnitario: producto.ValorUnitario,
                      IdCabeceraFactura: producto.IdCabeceraFactura,
                      Codigo: producto.AsignarProductoLote[0].AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Codigo,
                      IdKit: producto.AsignarProductoLote[0].AsignarProductoKits.IdKit,
                      Kit: producto.AsignarProductoLote[0].AsignarProductoKits.Descripcion,
                      IdProducto: producto.AsignarProductoLote[0].AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.IdConfigurarProducto,
                      Producto: producto.AsignarProductoLote[0].AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Producto.Nombre,
                      Presentacion: producto.AsignarProductoLote[0].AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Presentacion.Descripcion,
                      ContenidoNeto: producto.AsignarProductoLote[0].AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.CantidadMedida,
                      Medida: producto.AsignarProductoLote[0].AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Medida.Descripcion,
                      Lote: lote,
                      FechaExpiracion: fechaExpiracionLote,
                      Total: parseInt(producto.Cantidad) * parseInt(producto.ValorUnitario)
                    }
                    this.detalleCompra.push(detalle);
                  } else {
                    detalle = {
                      IdDetalleFactura: producto.IdDetalleFactura,
                      Cantidad: producto.Cantidad,
                      ValorUnitario: producto.ValorUnitario,
                      IdCabeceraFactura: producto.IdCabeceraFactura,
                      Codigo: producto.AsignarProductoLote[0].ConfigurarProductos.Codigo,
                      IdKit: producto.AsignarProductoLote[0].AsignarProductoKits.IdKit,
                      Kit: producto.AsignarProductoLote[0].AsignarProductoKits.Descripcion,
                      IdProducto: producto.AsignarProductoLote[0].ConfigurarProductos.IdConfigurarProducto,
                      Producto: producto.AsignarProductoLote[0].ConfigurarProductos.Producto.Nombre,
                      Presentacion: producto.AsignarProductoLote[0].ConfigurarProductos.Presentacion.Descripcion,
                      ContenidoNeto: producto.AsignarProductoLote[0].ConfigurarProductos.CantidadMedida,
                      Medida: producto.AsignarProductoLote[0].ConfigurarProductos.Medida.Descripcion,
                      Lote: lote,
                      FechaExpiracion: producto.AsignarProductoLote[0].FechaExpiracion,
                      Total: parseInt(producto.Cantidad) * parseInt(producto.ValorUnitario)
                    }
                    this.detalleCompra.push(detalle);
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
          console.log(ok['respuesta']);
          
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
    console.log(this.botonInsertar);
    
    if (this.myForm.valid) {
      if (this.botonInsertar == 'ingresar') {
        this.crearCabeceraFactura();
      } else if (this.botonInsertar == 'agregarDetalles') {
        this.validarSiPerteneceALote();
      } else if (this.botonInsertar == 'actualizarFactura') {
        this.validarSiPerteneceALote();
      }
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
          console.log('idCabecera ' + ok['respuesta']);
          if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            this._idCabecera.setValue(ok['respuesta']);
            this.validarSiPerteneceALote();
            this.botonInsertar = 'agregarDetalles';
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
      this._precio.value,
      '0',
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          console.log('idDetalleFactura ' + ok['respuesta']);
          if (ok['respuesta']) {
            this.limpiarCampos();
            this.consultarDetalleFactura();
            this.realizarCompraButton = false;
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
    this.botonInsertar = 'actualizarFactura';
    this.realizarCompraButton = false;
    this._idCabecera.setValue(factura.IdCabeceraFactura);
    this.consultarDetalleFactura();
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
          console.log('idLote ' + ok['respuesta']);
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
    var fecha = new Date(this._fechaExpiracion.value).toJSON();
    if (this._lote.value == '' || this._lote.value == null) {
      console.log('el producto no tiene lote');
      this.asignarProductoLote('', fecha);
    } else {
      console.log('el producto tiene lote');
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
      localStorage.getItem('miCuenta.postToken'),
      idLote,
      fecha
    )
      .then(
        ok => {
          console.log('idAsignarProductoLote ' + ok['respuesta']);
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

  get _tipoCompra() {
    return this.myForm.get('_tipoCompra');
  }

  ngOnInit() {
    this.consultarKits();
    this.consultarTipoTransaccion();
    this.consultarFacturasNoFinalizadas();
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
