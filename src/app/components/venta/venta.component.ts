import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { MatDialog } from "@angular/material/dialog";

// Components
import { ModalAsignacionUsuarioPersonaComponent } from "../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component";
import { ModalAsignacionConfiguracionProductoComponent } from "../modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component";
import { ModalLocalidadSuperiorComponent } from '../modal-localidad-superior/modal-localidad-superior.component';

// Services
import { InventarioService } from "src/app/services/inventario.service";
import { FacturaService } from 'src/app/services/factura.service';
import { VentaService } from 'src/app/services/venta.service';
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';

@Component({
  selector: "app-venta",
  templateUrl: "./venta.component.html",
  styleUrls: ["./venta.component.css"],
})
export class VentaComponent implements OnInit {

  myForm: FormGroup;

  constructor(
    private modalAsignacionUsuarioPersona: MatDialog,
    private modalAsignacionConfiguracionProducto: MatDialog,
    private inventarioService: InventarioService,
    private ventaService: VentaService,
    private facturaService: FacturaService,
    private panelAdministracionService: PanelAdministracionService,
    private modalLocalidadSuperior: MatDialog,
    private router: Router
  ) {
    this.myForm = new FormGroup({
      _idCabecera: new FormControl(""),
      _cabecera: new FormControl(""),
      _tipoTransaccion: new FormControl(""),
      _fechaActual: new FormControl(""),
      _producto: new FormControl(""),
      _cantidad: new FormControl(""),
      _precio: new FormControl(""),
      _persona: new FormControl(""),
      _cedula: new FormControl(""),
      _idPersona: new FormControl(""),
      _nombres: new FormControl(""),
      _idSembrio: new FormControl(""),
      _sembrio: new FormControl(""),
      _idAsignarProductoLote: new FormControl(""),
      _kit: new FormControl(""),
      _checkedDescuento: new FormControl(""),
      _disponible: new FormControl(""),
      _pagoEfectivo: new FormControl(""),
    });
  }

  kits: any[] = [];
  listaProductosDeUnKit: any[] = [];
  meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  tipoCompra: any[] = [{ tipo: "Producto" }, { tipo: "Kit" }];
  permitirAnadir: any;

  selected = "Producto";

  seccionKit = true;
  aplicaDescuento = true;
  buttonSeleccionarProducto = true;
  selectTipoCompra = true;
  buttonSeleccionarPersona = true;
  buttonSeleccionarSembrio = true;
  buttonGenerarFactura = false;
  realizarVentaButton = true;

  // Para la paginacion
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild('fnf_paginator', { static: false }) fnf_paginator: MatPaginator;
  @ViewChild('ff_paginator', { static: false }) ff_paginator: MatPaginator;
  detalleVenta = new MatTableDataSource<Element[]>();
  facturasNoFinalizadas = new MatTableDataSource<Element[]>();
  facturasFinalizadas = new MatTableDataSource<Element[]>();

  selecionarTipoCompra(tipoCompra) {
    this.aplicaDescuento = true;
    if (tipoCompra.value == "Kit") {
      this.consultarKits();
      this.limpiarCampos();
    } else {
      this.listaProductosDeUnKit = [];
      this.seccionKit = true;
      this.limpiarCampos();
    }
  } 

  consultarKits() {
    this.inventarioService
      .consultarKits(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.kits = [];
        ok["respuesta"].map((item) => {
          if (item.KitUtilizado == "1") {
            this.kits.push(item);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      }).finally(() => {
        this.seccionKit = false;
        this.buttonSeleccionarProducto = true;
      });
  }

  consultarKitsYSusProductos(idKit) {
    const url = "Stock/ListaAsignarProductoKitEnStock";
    this.inventarioService
      .consultarKitsYSusProductos(
        idKit,
        localStorage.getItem("miCuenta.getToken"),
        url
      )
      .then((ok) => {        
        this.listaProductosDeUnKit = [];
        this.listaProductosDeUnKit =
          ok["respuesta"][0]["ListaAsignarProductoKit"];
        this.permitirAnadir = ok['respuesta'][0]["PermitirAnadir"];
        this.buttonSeleccionarProducto = true;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.buttonSeleccionarProducto = false;
      });
  }

  onChangeSelectKit(idKit) {
    this.consultarKitsYSusProductos(idKit);
  }

  seleccionarPersona() {
    let dialogRef = this.modalAsignacionUsuarioPersona.open(
      ModalAsignacionUsuarioPersonaComponent,
      {
        width: "700px",
        height: "auto",
        data: "todos",
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this._cedula.setValue(result.cedula);
        this._idPersona.setValue(result.idPersona);
        var nombres = result.nombres + " " + result.apellidos;
        this._nombres.setValue(nombres);
      }
    });
  }

  seleccionarProducto() {
    let dialogRef = this.modalAsignacionConfiguracionProducto.open(
      ModalAsignacionConfiguracionProductoComponent,
      {
        width: "800px",
        height: "auto",
        data: {
          listaProductosDeUnKit: this.listaProductosDeUnKit,
          idCabeceraFactura: this._idCabecera.value,
          permitirAnadir: this.permitirAnadir
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result != null) {
        if (result.Kit != "") {
          this.aplicaDescuento = false;
          this._kit.setValue(result.Kit + " (" + result.Porcentaje + ")");
        } else {
          this.aplicaDescuento = true;
          this._kit.setValue("");
          this._checkedDescuento.setValue(false);
        }
        this._idAsignarProductoLote.setValue(result.IdAsignarProductoLote);
        this.consultarPrecioDeUnProducto();
        this._disponible.setValue(result.Disponible);
        var producto =
          result.Producto +
          " " +
          result.Presentacion +
          " " +
          result.ContenidoNeto +
          " " +
          result.Medida;
        this._producto.setValue(producto);
        this._cantidad.reset();
      } 
    });
  }

  consultarTipoTransaccion() {
    this.facturaService
      .consultarTipoTransaccion(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        if (this.router.url === "/ventas") {
          ok["respuesta"].map((item) => {
            if (item.Descripcion == "VENTA") {
              this._tipoTransaccion.setValue(item.IdTipoTransaccion);
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      }).finally(() => {
        this.consultarFacturasNoFinalizadas();
      });
  }

  validarFormulario() {
    this.crearDetalleVenta();
  }

  crearCabeceraFactura() {
    this.facturaService
      .crearCabeceraFactura(
        localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
        this._tipoTransaccion.value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == "false") {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        } else if(ok['respuesta']) {
          this._idCabecera.setValue(ok["respuesta"].IdCabeceraFactura);
          this._cabecera.setValue(ok["respuesta"].Codigo);
          var fecha = new Date();
          var dia = this.dias[fecha.getDay()];
          var mes = this.meses[fecha.getMonth()];
          this._fechaActual.setValue(
            dia + ", " + fecha.getDate() + " " + mes + " " + fecha.getFullYear()
          );
        }
      })
      .catch((error) => {
        console.log(error);
      }).finally(() => { 
        this.buttonGenerarFactura = true;
        this.buttonSeleccionarPersona = false;
        this.buttonSeleccionarProducto = false;
        this.buttonSeleccionarSembrio = false;
        this.selectTipoCompra = false;
        this.myForm.enable();
      });
  }

  crearDetalleVenta() {
    var EstadoCheck: string;
    if (this._checkedDescuento.value == true) {
      EstadoCheck = "1";
    } else {
      EstadoCheck = "0";
    }
    this.ventaService
      .crearDetalleFactura(
        this._idCabecera.value,
        this._idAsignarProductoLote.value,
        EstadoCheck,
        "0",
        this._cantidad.value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == "true") {
          this.consultarDetalleFactura();
          this.realizarVentaButton = false;
          this.limpiarCampos();
        }
        if (ok["respuesta"] == "false") {
          console.log("error en el servidor");
        }
        if (ok["respuesta"] != "true" && ok["respuesta"] != "false") {
          sweetAlert(ok["respuesta"], {
            icon: "error",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  consultarPrecioDeUnProducto() {
    this.inventarioService
      .buscarPrecioDeUnProducto(
        this._idAsignarProductoLote.value,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        this._precio.setValue(ok["respuesta"].Precio);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  realizarVenta() {
    const url = "Factura/FinalizarCabeceraFacturaVenta"
    this.facturaService
      .finalizarFactura(
        this._idCabecera.value,
        url,
        localStorage.getItem("miCuenta.putToken")
      )
      .then((ok) => {
        if (ok["respuesta"]) {
          sweetAlert("Se ingresó correctamente!", {
            icon: "success",
          });
          this.consultarFacturasNoFinalizadas();
          this.consultarFacturasFinalizadas();
          this.myForm.reset();
          this.detalleVenta.data = [];
        } else {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  consultarDetalleFactura() {
    this.ventaService
      .consultarDetalleFactura(
        this._idCabecera.value,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        var detalle: any;
        var lote: string;
        var FechaExp: string;
        var Descuento: string;
        var detalleVenta = [];
        ok["respuesta"].DetalleVenta.map((item) => {
          if (item.AsignarProductoLote.IdLote != "") {
            lote = item.AsignarProductoLote.Lote.Codigo;
            FechaExp = item.AsignarProductoLote.Lote.FechaExpiracion;
          } else {
            lote = "";
            FechaExp = item.AsignarProductoLote.FechaExpiracion;
          }
          if (item.AplicaDescuento == "True") {
            Descuento =
            item.AsignarProductoLote.AsignarProductoKits
                .ListaAsignarProductoKit[0].Kit.AsignarDescuentoKit.Descuento
                .Porcentaje + "%";
          } else {
            Descuento = "";
          }
          if (item.AsignarProductoLote.PerteneceKit == "False") {
            detalle = {
              Codigo:
              item.AsignarProductoLote.ConfigurarProductos.Codigo,
              IdDetalleVenta: item.IdDetalleVenta,
              Cantidad: item.Cantidad,
              Producto:
              item.AsignarProductoLote.ConfigurarProductos.Producto
                  .Nombre,
              Presentacion:
              item.AsignarProductoLote.ConfigurarProductos
                  .Presentacion.Descripcion +
                " " +
                item.AsignarProductoLote.ConfigurarProductos
                  .CantidadMedida +
                " " +
                item.AsignarProductoLote.ConfigurarProductos.Medida
                  .Descripcion,
              Lote: lote,
              FechaExpiracion: FechaExp,
              Kit: "",
              AplicaDescuento: Descuento,
              ValorUnidad: item.ValorUnitario,
              Total: item.Total,
              Subtotal: item.Subtotal,
            };
          } else {
            detalle = {
              Codigo:
              item.AsignarProductoLote.AsignarProductoKits
                  .ListaAsignarProductoKit[0].ListaProductos.Codigo,
              IdDetalleVenta: item.IdDetalleVenta,
              Cantidad: item.Cantidad,
              Producto:
                item.AsignarProductoLote.AsignarProductoKits
                  .ListaAsignarProductoKit[0].ListaProductos.Producto.Nombre,
              Presentacion:
              item.AsignarProductoLote.AsignarProductoKits
                  .ListaAsignarProductoKit[0].ListaProductos.Presentacion
                  .Descripcion +
                " " +
                item.AsignarProductoLote.AsignarProductoKits
                  .ListaAsignarProductoKit[0].ListaProductos.CantidadMedida +
                " " +
                item.AsignarProductoLote.AsignarProductoKits
                  .ListaAsignarProductoKit[0].ListaProductos.Medida.Descripcion,
              Lote: lote,
              FechaExpiracion: FechaExp,
              Kit:
              item.AsignarProductoLote.AsignarProductoKits
                  .Descripcion,
              AplicaDescuento: Descuento,
              ValorUnidad: item.ValorUnitario,
              Total: item.Total,
              Subtotal: item.Subtotal,
            };
          }
          detalleVenta.push(detalle);
        });
        this.detalleVenta.data = detalleVenta;
        this.detalleVenta.paginator = this.paginator;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  modificarCantidadDeProductoEnDetalle(event, element) {
    if (event.key == "Enter") {
      var cantidadAntigua = element.Cantidad;
      if (event.target.value <= 0) {
        event.target.value = cantidadAntigua;
      } else {
        this.ventaService
          .modificarCantidadDeProductoEnDetalleVenta(
            element.IdDetalleVenta,
            event.target.value,
            localStorage.getItem("miCuenta.putToken")
          )
          .then((ok) => {
            if (ok["respuesta"] == "true") {
              this.consultarDetalleFactura();
            }
            if (ok["respuesta"] == "false") {
              console.log("error en el servidor");
            }
            if (ok["respuesta"] != "true" && ok["respuesta"] != "false") {
              event.target.value = cantidadAntigua;
              sweetAlert(ok["respuesta"], {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }

  quitarDetalleFactura(detalleFactura) {
    this.ventaService
      .quitarDetalleFactura(
        detalleFactura.IdDetalleVenta,
        localStorage.getItem("miCuenta.deleteToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == "0") {
          this._idCabecera.setValue("");
          this.myForm.reset();
          this.detalleVenta.data = [];
        } else {
          this.consultarDetalleFactura();
        }
      })
      .catch((error) => {
        console.log(error);
      }).finally(() => {
        this.consultarFacturasNoFinalizadas();
      });
  }

  limpiarCampos() {
    this._producto.reset();
    this._cantidad.reset();
    this._idAsignarProductoLote.reset();
    this._kit.reset();
    this._checkedDescuento.reset();
    this._precio.reset();
  }

  seleccionarSembrio() {
    let dialogRef = this.modalLocalidadSuperior.open(ModalLocalidadSuperiorComponent, {
      width: '400px',
      height: 'auto',
      data: {
        ruta: 'ventas'
      }
    }); 
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this._idSembrio.setValue(result.idLocalidad);
        this._sembrio.setValue(result.descripcion);
      }
    });
  }  

  consultarFacturasNoFinalizadas() {
    const url = "Factura/FacturasNoFinalizadasVenta";
    this.facturaService
      .consultarFacturasNoFinalizadas(
        url,
        localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        try {
          this.facturasNoFinalizadas.data = [];
          this.facturasNoFinalizadas.data = ok["respuesta"];
          this.facturasNoFinalizadas.paginator = this.fnf_paginator;
        } catch (error) {
          this.consultarFacturasNoFinalizadas();
        }
      })
      .catch((error) => {
        console.log(error);
      }).finally(() => {
        this.consultarFacturasFinalizadas();
      });
  }

  mostrarDetallesFactura(factura) {
    this.myForm.reset();
    this.realizarVentaButton = false;
    this._idCabecera.setValue(factura.IdCabeceraFactura);
    this.consultarDetalleFactura();
    this._cabecera.setValue(factura.Codigo);
    this.myForm.enable();
    this.buttonSeleccionarProducto = false;
    this.selectTipoCompra = false;
    this.buttonGenerarFactura = false;
    var fecha = new Date(factura.FechaGeneracion);
    var dia = this.dias[fecha.getDay()];
    var mes = this.meses[fecha.getMonth()];
    this._fechaActual.setValue(
      dia + ", " + fecha.getDate() + " " + mes + " " + fecha.getFullYear()
    );
  }

  consultarFacturasFinalizadas() {
    const url = "Factura/ListaFacturasFinalizadasVenta";
    this.facturaService
      .consultarFacturasFinalizadas(
        url,
        localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.facturasFinalizadas.data = [];
        this.facturasFinalizadas.data = ok["respuesta"];
        this.facturasFinalizadas.paginator = this.ff_paginator;
      })
      .catch((error) => {
        this.consultarFacturasFinalizadas();
      });
  }

  get _producto() {
    return this.myForm.get("_producto");
  }

  get _cantidad() {
    return this.myForm.get("_cantidad");
  }

  get _precio() {
    return this.myForm.get("_precio");
  }

  get _pagoEfectivo() {
    return this.myForm.get("_pagoEfectivo");
  }

  get _cedula() {
    return this.myForm.get("_cedula");
  }

  get _nombres() {
    return this.myForm.get("_nombres");
  }

  get _idPersona() {
    return this.myForm.get("_idPersona");
  }

  get _idSembrio() {
    return this.myForm.get("_idSembrio");
  }

  get _sembrio() {
    return this.myForm.get("_sembrio");
  }

  get _tipoTransaccion() {
    return this.myForm.get("_tipoTransaccion");
  }

  get _idCabecera() {
    return this.myForm.get("_idCabecera");
  }

  get _disponible() {
    return this.myForm.get("_disponible");
  }

  get _idAsignarProductoLote() {
    return this.myForm.get("_idAsignarProductoLote");
  }

  get _cabecera() {
    return this.myForm.get("_cabecera");
  }

  get _fechaActual() {
    return this.myForm.get("_fechaActual");
  }

  get _kit() {
    return this.myForm.get("_kit");
  }

  get _checkedDescuento() {
    return this.myForm.get("_checkedDescuento");
  }

  ngOnInit() {
    this.consultarTipoTransaccion();
    this.myForm.disable();
  }

  tablaDetalleCompra = [
    "codigo",
    "descripcion",
    "presentacion",
    "kit",
    "lote",
    "fechaExpiracion",
    "valorUnitario",
    "cantidad",
    "Descuento",
    "Subtotal",
    "total",
    "acciones",
  ];
  tablaFacturasNoFinalidas = ["codigo", "usuario", "fecha", "acciones"];
  tablaFacturasFinalidas = ["codigo", "usuario", "fecha", "acciones"];

}
 