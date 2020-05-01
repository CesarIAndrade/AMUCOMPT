import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { ModalAsignacionUsuarioPersonaComponent } from "../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component";
import { MatDialog } from "@angular/material/dialog";
import { ModalAsignacionConfiguracionProductoComponent } from "../modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { InventarioService } from "src/app/services/inventario.service";
import { MatTableDataSource } from "@angular/material";

// SweetAlert
import sweetalert from "sweetalert";
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
      _sembrio: new FormControl(""),
      _idAsignarProductoLote: new FormControl(""),
      _kit: new FormControl(""),
      _checkedDescuento: new FormControl(""),
      _disponible: new FormControl(""),
      _pagoEfectivo: new FormControl(""),
    });
  }

  detalleVenta1 = new MatTableDataSource<Element[]>();
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

  sembrios: any[] = [];
  detalleVenta: any[] = [];
  kits: any[] = [];
  seccionKit = true;
  aplicaDescuento = true;
  filteredOptions: Observable<string[]>;
  tipoCompra: any[] = [{ tipo: "Producto" }, { tipo: "Kit" }];
  selected = "Producto";
  buttonSeleccionarProducto = true;
  buttonSeleccionarPersona = true;
  listaProductosDeUnKit: any[] = [];
  selectTipoCompra = true;

  selecionarTipoCompra(tipoCompra) {
    this.aplicaDescuento = true;
    if (tipoCompra.value == "Kit") {
      this.seccionKit = false;
      this.buttonSeleccionarProducto = true;
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
      });
  }

  permitirAnadir: any;
  consultarKitsYSusProductos(idKit) {
    const url = "Stock/ListaAsignarProductoKitEnStock";
    this.inventarioService
      .consultarKitsYSusProductos(
        idKit,
        localStorage.getItem("miCuenta.getToken"),
        url
      )
      .then((ok) => {        
        console.log(ok['respuesta']);
        
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

  consultarSembios() {
    this.panelAdministracionService.consultarSembrios(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.sembrios = ok["respuesta"];
        this.filteredOptions = this._sembrio.valueChanges.pipe(
          startWith(""),
          map((value) => this._filter(value))
        );
      })
      .catch((error) => {
        console.log(error);
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
        this.buttonSeleccionarPersona = false;
        this.buttonSeleccionarProducto = false;
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
      .crearDetalleVenta(
        this._idCabecera.value,
        this._idAsignarProductoLote.value,
        EstadoCheck,
        "0",
        this._cantidad.value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == "true") {
          this.consultarDetalleDeUnaFactura();
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

  consultarFacturasVentaFinalizadas() {
    this.ventaService
      .consultarFacturasVentasFinalizadas(
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        //console.log(ok['respuesta']);
        //this.facturasNoFinalizadas = ok['respuesta'];
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
    this.ventaService
      .finalizarCabeceraFacturaVenta(
        this._idCabecera.value,
        localStorage.getItem("miCuenta.putToken")
      )
      .then((ok) => {
        if (ok["respuesta"]) {
          sweetAlert("Se ingresó correctamente!", {
            icon: "success",
          });
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

  consultarDetalleDeUnaFactura() {
    this.ventaService
      .consultarDetalleDeUnaFacturasVenta(
        this._idCabecera.value,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        var detalle: any;
        var lote: string;
        var FechaExp: string;
        var Descuento: string;
        this.detalleVenta = [];
        ok["respuesta"].DetalleVenta.map((DetalleVenta) => {
          if (DetalleVenta.AsignarProductoLote.IdLote != "") {
            lote = DetalleVenta.AsignarProductoLote.Lote.Codigo;
            FechaExp = DetalleVenta.AsignarProductoLote.Lote.FechaExpiracion;
          } else {
            lote = "";
            FechaExp = DetalleVenta.AsignarProductoLote.FechaExpiracion;
          }
          if (DetalleVenta.AplicaDescuento == "True") {
            Descuento =
              DetalleVenta.AsignarProductoLote.AsignarProductoKits
                .ListaAsignarProductoKit[0].Kit.AsignarDescuentoKit.Descuento
                .Porcentaje + "%";
          } else {
            Descuento = "";
          }
          if (DetalleVenta.AsignarProductoLote.PerteneceKit == "False") {
            detalle = {
              Codigo:
                DetalleVenta.AsignarProductoLote.ConfigurarProductos.Codigo,
              IdDetalleVenta: DetalleVenta.IdDetalleVenta,
              Cantidad: DetalleVenta.Cantidad,
              Producto:
                DetalleVenta.AsignarProductoLote.ConfigurarProductos.Producto
                  .Nombre,
              Presentacion:
                DetalleVenta.AsignarProductoLote.ConfigurarProductos
                  .Presentacion.Descripcion +
                " " +
                DetalleVenta.AsignarProductoLote.ConfigurarProductos
                  .CantidadMedida +
                " " +
                DetalleVenta.AsignarProductoLote.ConfigurarProductos.Medida
                  .Descripcion,
              Lote: lote,
              FechaExpiracion: FechaExp,
              Kit: "",
              AplicaDescuento: Descuento,
              ValorUnidad: DetalleVenta.ValorUnitario,
              Total: DetalleVenta.Total,
              Subtotal: DetalleVenta.Subtotal,
            };
          } else {
            detalle = {
              Codigo:
                DetalleVenta.AsignarProductoLote.AsignarProductoKits
                  .ListaAsignarProductoKit[0].ListaProductos.Codigo,
              IdDetalleVenta: DetalleVenta.IdDetalleVenta,
              Cantidad: DetalleVenta.Cantidad,
              Producto:
                DetalleVenta.AsignarProductoLote.AsignarProductoKits
                  .ListaAsignarProductoKit[0].ListaProductos.Producto.Nombre,
              Presentacion:
                DetalleVenta.AsignarProductoLote.AsignarProductoKits
                  .ListaAsignarProductoKit[0].ListaProductos.Presentacion
                  .Descripcion +
                " " +
                DetalleVenta.AsignarProductoLote.AsignarProductoKits
                  .ListaAsignarProductoKit[0].ListaProductos.CantidadMedida +
                " " +
                DetalleVenta.AsignarProductoLote.AsignarProductoKits
                  .ListaAsignarProductoKit[0].ListaProductos.Medida.Descripcion,
              Lote: lote,
              FechaExpiracion: FechaExp,
              Kit:
                DetalleVenta.AsignarProductoLote.AsignarProductoKits
                  .Descripcion,
              AplicaDescuento: Descuento,
              ValorUnidad: DetalleVenta.ValorUnitario,
              Total: DetalleVenta.Total,
              Subtotal: DetalleVenta.Subtotal,
            };
          }
          this.detalleVenta.push(detalle);
        });
        this.detalleVenta1.data = this.detalleVenta;
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
              this.consultarDetalleDeUnaFactura();
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

  quitarDetalleFactura(DetalleFactura) {
    this.ventaService
      .quitarDetalleFacturaVenta(
        DetalleFactura.IdDetalleVenta,
        localStorage.getItem("miCuenta.deleteToken")
      )
      .then((ok) => {
        if (ok["respuesta"]) {
          this.consultarDetalleDeUnaFactura();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  limpiarCampos() {
    this._producto.reset();
    this._cantidad.reset();
    this._idAsignarProductoLote.reset();
    this._kit.reset();
    this._checkedDescuento.reset();
    this._precio.reset();
    // this.seccionKit = true;
  }

  seleccionarSembrioSiExiste(sembrio) {
    console.log(sembrio);
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
    this.consultarKits();
    this.consultarSembios();
    this.consultarTipoTransaccion();
    this.myForm.disable();
  }

  private _filter(value: string): string[] {
    try {
      const filterValue = value.toLowerCase();
      return this.sembrios.filter((option) =>
        option.Descripcion.toLowerCase().includes(filterValue)
      );
    } catch (error) {}
  }

  tablaDetalleCompra = [
    "codigo",
    "kit",
    "descripcion",
    "presentacion",
    "lote",
    "fechaExpiracion",
    "valorUnitario",
    "cantidad",
    "Descuento",
    "Subtotal",
    "total",
    "acciones",
  ];
}
