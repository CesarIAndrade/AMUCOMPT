import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalAsignacionUsuarioPersonaComponent } from '../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component';
import { MatDialog } from "@angular/material/dialog";
import { ModalAsignacionConfiguracionProductoComponent } from '../modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { InventarioService } from 'src/app/services/inventario.service';

// SweetAlert
import sweetalert from "sweetalert"
import { Router } from '@angular/router';
import { ok } from 'assert';
import { error } from 'util';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  myForm: FormGroup;

  constructor(
    private modalAsignacionUsuarioPersona: MatDialog,
    private modalAsignacionConfiguracionProducto: MatDialog,
    private inventarioService: InventarioService,
    private router: Router,
  ) {
    this.myForm = new FormGroup({
      _idCabecera: new FormControl(''),
      _cabecera: new FormControl(''),
      _tipoTransaccion: new FormControl(''),
      _fechaActual: new FormControl(''),
      /*
      _producto: new FormControl('', [Validators.required]),
      _cantidad: new FormControl('', [Validators.required]),
      _precio: new FormControl('', [Validators.required]),
      _persona: new FormControl('', [Validators.required]),
      _cedula: new FormControl('', [Validators.required]),
      _idPersona: new FormControl('', [Validators.required]),
      _nombres: new FormControl('', [Validators.required]),
      _sembrio: new FormControl('', [Validators.required]),*/
      _producto: new FormControl(''),
      _cantidad: new FormControl(''),
      _precio: new FormControl(''),
      _persona: new FormControl(''),
      _cedula: new FormControl(''),
      _idPersona: new FormControl(''),
      _nombres: new FormControl(''),
      _sembrio: new FormControl(''),
      _idAsignarProductoLote: new FormControl(''),
      _kit: new FormControl(''),
      _checkedDescuento: new FormControl(''),
    })
  }
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  sembrios: any[] = [];
  detalleVenta: any[] = [];
  detalleVenta1: any[] = [];
  seccionKit = true;
  filteredOptions: Observable<string[]>;
  seleccionarPersona() {
    let dialogRef = this.modalAsignacionUsuarioPersona.open(ModalAsignacionUsuarioPersonaComponent, {
      width: '700px',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this._cedula.setValue(result.cedula);
        this._idPersona.setValue(result.idPersona);
        var nombres = result.nombres +' '+ result.apellidos
        this._nombres.setValue(nombres);
      }
    });
  }
  seleccionarProducto() {
    let dialogRef = this.modalAsignacionConfiguracionProducto.open(ModalAsignacionConfiguracionProductoComponent, {
      width: '800px',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe(result => {
      this._idAsignarProductoLote 
      if (result != null) {
        if(result.Kit != null)
        {
          this.seccionKit = false;
          this._kit.setValue(result.Kit+' ('+result.Porcentaje+')');
        }else
        {
          this.seccionKit = true;
          this._kit.setValue('');
          this._checkedDescuento.setValue(false);
        }
        this._idAsignarProductoLote.setValue(result.IdAsignarProductoLote);
        var producto = result.Producto + ' ' + result.Presentacion + ' ' + result.ContenidoNeto
          + ' ' + result.Medida;
        // this._idRelacionLogica.setValue(result.idRelacionLogica);
        // this._perteneceKit.setValue(result.perteneceKit);
        this._producto.setValue(producto);
        // this.consultarLotesDeUnProducto();
        // this.buscarFechaYPrecio();
        // this._fechaExpiracion.reset();
        // this.dateIcon = true;
        // this._lote.reset();
        this._cantidad.reset();
        this._precio.reset();
      }
    });
  }
  consultarSembios() {
    this.inventarioService.consultarSembios(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.sembrios = ok['respuesta'];
          this.filteredOptions = this._sembrio.valueChanges
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
  seleccionarSembrioSiExiste(sembrio) {
    console.log(sembrio);
  }
  get _producto() {
    return this.myForm.get('_producto');
  }
  get _cantidad() {
    return this.myForm.get('_cantidad');
  }
  get _precio() {
    return this.myForm.get('_precio');
  }
  get _cedula() {
    return this.myForm.get('_cedula');
  }
  get _nombres() {
    return this.myForm.get('_nombres');
  }
  get _idPersona() {
    return this.myForm.get('_idPersona');
  }
  get _sembrio() {
    return this.myForm.get('_sembrio');
  }
  get _tipoTransaccion() {
    return this.myForm.get('_tipoTransaccion')
  }
  get _idCabecera() {
    return this.myForm.get('_idCabecera')
  }
  get _idAsignarProductoLote() {
    return this.myForm.get('_idAsignarProductoLote')
  }
  get _cabecera() {
    return this.myForm.get('_cabecera')
  }
  get _fechaActual() {
    return this.myForm.get('_fechaActual');
  }
  get _kit() {
    return this.myForm.get('_kit');
  }
  get _checkedDescuento() {
    return this.myForm.get('_checkedDescuento');
  }
  consultarTipoTransaccion() {
    this.inventarioService.consultarTipoTransaccion(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          if (this.router.url === '/inicio/ventas') {
            ok['respuesta'].map(
              item => {
                if (item.Descripcion == 'VENTA') {
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
  validarFormulario() {
    this.crearDetalleVenta();
    /*if (this.myForm.valid) {
      console.log(this._idCabecera.value);
      console.log(this._idAsignarProductoLote.value);
      console.log(this._cantidad);
    }*/
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
            //this.selectTipoCompra = false;
            //this.buttonSeleccionarProducto = false;
            //this.buttonGenerarFactura = true;
            var fecha = new Date();
            var dia = this.dias[fecha.getDay()];;
            var mes = this.meses[fecha.getMonth()];
            this._fechaActual.setValue(dia + ', ' + fecha.getDate() + ' ' + mes + ' ' + fecha.getFullYear());
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  crearDetalleVenta()
  {
    console.log(this._checkedDescuento.value);
    var EstadoCheck :string;
    
    if(this._checkedDescuento.value == true)
    {
      EstadoCheck= '1';
    }else
    {
      EstadoCheck= '0';
    }
    this.inventarioService.crearDetalleVenta(
      this._idCabecera.value,
      this._idAsignarProductoLote.value,
      EstadoCheck,
      '0',
      this._cantidad.value,
      localStorage.getItem('miCuenta.postToken')
    )
    .then(
      ok => {
        console.log(ok['respuesta']);
        this.consultarDetalleDeUnaFactura();
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
  }
  consultarFacturasVentaFinalizadas() {
    this.inventarioService.consultarFacturasVentasFinalizadas(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          console.log(ok['respuesta']);
          //this.facturasNoFinalizadas = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarDetalleDeUnaFactura() {
    //console.log(this._idCabecera.value);
    
    this.inventarioService.consultarDetalleDeUnaFacturasVenta(
      this._idCabecera.value,
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          var detalle: any;
          var lote :string;
          var FechaExp : string;
          var Descuento : string;
          this.detalleVenta = [];
          ok['respuesta'][0].DetalleVenta.map(
            DetalleVenta=>{
              //console.log(DetalleVenta.IdAsignarProductoLote);
              if(DetalleVenta.AsignarProductoLote.IdLote != "")
              {
                lote = DetalleVenta.AsignarProductoLote.Lote.Codigo;
                FechaExp = DetalleVenta.AsignarProductoLote.Lote.FechaExpiracion
              }else
              {
                lote = '';
                FechaExp = DetalleVenta.AsignarProductoLote.FechaExpiracion;
              }

              if(DetalleVenta.AplicaDescuento == "True")
              {
                Descuento = DetalleVenta.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].Kit.AsignarDescuentoKit.Descuento.Porcentaje+'%' ;
              }
              else
              {
                Descuento = '';
              }
              if(DetalleVenta.AsignarProductoLote.PerteneceKit == "False")
              { 
                detalle = {
                  Codigo : DetalleVenta.AsignarProductoLote.ConfigurarProductos.Codigo,
                  IdDetalleVenta: DetalleVenta.IdDetalleVenta,
                  Cantidad: DetalleVenta.Cantidad,
                  Producto : DetalleVenta.AsignarProductoLote.ConfigurarProductos.Producto.Nombre,
                  Presentacion : DetalleVenta.AsignarProductoLote.ConfigurarProductos.Presentacion.Descripcion+' '+DetalleVenta.AsignarProductoLote.ConfigurarProductos.CantidadMedida +' '+DetalleVenta.AsignarProductoLote.ConfigurarProductos.Medida.Descripcion,
                  Lote : lote,
                  FechaExpiracion : FechaExp,
                  Kit : '',
                  AplicaDescuento : Descuento,
                }
              }else
              {
                detalle = {
                  Codigo : DetalleVenta.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Codigo,
                  IdDetalleVenta: DetalleVenta.IdDetalleVenta,
                  Cantidad: DetalleVenta.Cantidad,
                  Producto : DetalleVenta.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Producto.Nombre,
                  Presentacion: DetalleVenta.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Presentacion.Descripcion+' '+ DetalleVenta.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.CantidadMedida+' '+DetalleVenta.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Medida.Descripcion,
                  Lote : lote,
                  FechaExpiracion : FechaExp,
                  Kit : DetalleVenta.AsignarProductoLote.AsignarProductoKits.Descripcion,
                  AplicaDescuento : Descuento,
                }
              }
              this.detalleVenta.push(detalle);
            }
          )
          this.detalleVenta1 = this.detalleVenta;
          console.log(ok['respuesta'][0].DetalleVenta);
          console.log(this.detalleVenta);
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }


  ngOnInit() {
    console.log(this._checkedDescuento.value);

    //this._checkedDescuento.setValue('false');
    this.consultarSembios();
    this.consultarTipoTransaccion();
  }

  private _filter(value: string): string[] {
    try {
      const filterValue = value.toLowerCase();
      return this.sembrios.filter(option => option.Descripcion.toLowerCase().includes(filterValue));
    } catch (error) {
    }
  }

  tablaDetalleCompra = ['codigo', 'kit', 'descripcion', 'presentacion', 'lote', 'fechaExpiracion', 'valorUnitario', 'cantidad','Descuento', 'total', 'acciones'];

}
