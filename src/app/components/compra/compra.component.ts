import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { MatPaginator, MatTableDataSource } from "@angular/material";

// Component
import { ModalAsignacionConfiguracionProductoComponent } from "../modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component";

// Services
import { InventarioService } from "src/app/services/inventario.service";
import { CompraService } from "src/app/services/compra.service";
import { FacturaService } from "src/app/services/factura.service";

// SweetAlert
import sweetalert from "sweetalert";
import { Router } from "@angular/router";
import { ModalLotesComponent } from "../modal-lotes/modal-lotes.component";

@Component({
  selector: "app-compra",
  templateUrl: "./compra.component.html",
  styleUrls: ["./compra.component.css"],
})
export class CompraComponent implements OnInit {
  myForm: FormGroup;

  constructor(
    private modalAsignacionConfiguracionProducto: MatDialog,
    private inventarioService: InventarioService,
    private compraService: CompraService,
    private facturaService: FacturaService,
    private router: Router,
    private modalLotes: MatDialog
  ) {
    this.myForm = new FormGroup({
      _idCabecera: new FormControl(""),
      _cabecera: new FormControl(""),
      _tipoTransaccion: new FormControl(""),
      _idRelacionLogica: new FormControl(""),
      _perteneceKit: new FormControl(""),
      _idKit: new FormControl(""),
      _kit: new FormControl(""),
      _producto: new FormControl("", [Validators.required]),
      _cantidad: new FormControl("", [Validators.required]),
      _fechaExpiracion: new FormControl(""),
      _precio: new FormControl("", [Validators.required]),
      _idLote: new FormControl(""),
      _lote: new FormControl(""),
      _idAsignarProductoLote: new FormControl(""),
      _fechaActual: new FormControl(""),
    });
  }

  selected = "Producto";
  seccionKit = true;
  realizarCompraButton = true;
  panelOpenState = false;
  selectTipoCompra = true;
  buttonGenerarFactura = false;
  buttonSeleccionarProducto = true;
  loteEnDetalle = true;
  buttonSeleccionarLote = true;
  clearFieldLote = true;
  clearFieldFecha = true;

  kits: any[] = [];
  lotes: any[] = [];
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
  filteredOptions: Observable<string[]>;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild('fnf_paginator', { static: false }) fnf_paginator: MatPaginator;
  @ViewChild('ff_paginator', { static: false }) ff_paginator: MatPaginator;
  detalleCompra = new MatTableDataSource<Element[]>();
  facturasNoFinalizadas = new MatTableDataSource<Element[]>();
  facturasFinalizadas = new MatTableDataSource<Element[]>();

  buscarFechaYPrecio() {
    if (this._idRelacionLogica.value != "" && this._perteneceKit.value != "") {
      this.compraService
        .buscarFechaYPrecio(
          this._idCabecera.value,
          this._idRelacionLogica.value,
          this._perteneceKit.value,
          this.validarFecha(),
          localStorage.getItem("miCuenta.getToken")
        )
        .then((ok) => {
          try {
            if (typeof ok["respuesta"] == "object") {
              this._idAsignarProductoLote.setValue(
                ok["respuesta"].IdAsignarProductoLote
              );
              this._precio.disable();
              this._precio.setValue(
                ok["respuesta"].AsignarProductoLote[0].ValorUnitario
              );
            } else if (typeof ok["respuesta"] == "string") {
              this._precio.enable();
              this._precio.setValue("");
            }
          } catch (error) {}
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  clearDate() {
    this.clearFieldFecha = true;
    this._fechaExpiracion.setValue("");
    this._fechaExpiracion.disable();
    this.clearFieldLote = true;
    this._lote.setValue("");
    this._lote.disable();
    this._precio.setValue("");
    this._precio.disable();
  }

  clearLote() {
    this.clearFieldLote = true;
    this._lote.setValue("");
    this._lote.disable();
    this.clearFieldFecha = true;
    this._fechaExpiracion.disable();
    this._fechaExpiracion.setValue("");
    this._precio.setValue("");
    this._precio.disable();
  }

  onKeyUp() {
    this._precio.reset();
    this._precio.enable();
    this._fechaExpiracion.setValidators([Validators.required]);
    this._fechaExpiracion.updateValueAndValidity();
    this._idAsignarProductoLote.setValue("");
    if (this._idRelacionLogica.value != null) {
      this.inventarioService
        .buscarLote(
          this._lote.value,
          this._idRelacionLogica.value,
          this._perteneceKit.value,
          localStorage.getItem("miCuenta.getToken")
        )
        .then((ok) => {
          try {
            this._idAsignarProductoLote.setValue(
              ok["respuesta"].IdAsignarProductoLote
            );
            this._idLote.setValue(ok["respuesta"].Lote.IdLote);
            var fecha = new Date(ok["respuesta"].Lote.FechaExpiracion);
            this._fechaExpiracion.setValue(fecha);
            this._precio.setValue(ok["respuesta"].ValorUnitario);
            this._fechaExpiracion.disable();
            this._precio.disable();
          } catch (error) {
            this._fechaExpiracion.reset();
            this._cantidad.reset();
            this._precio.reset();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  modificarCantidadDeProductoEnDetalle(event, element) {
    if (event.key == "Enter") {
      var cantidadAntigua = element.Cantidad;
      if (event.target.value <= 0) {
        event.target.value = cantidadAntigua;
      } else {
        this.compraService
          .modificarCantidadDeProductoEnDetalle(
            element.IdDetalleFactura,
            event.target.value,
            localStorage.getItem("miCuenta.putToken")
          )
          .then((ok) => {
            console.log(ok['respuesta']);
            
            if (ok["respuesta"]) {
              this.consultarDetalleFactura();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }

  selecionarTipoCompra(tipoCompra) {
    if (tipoCompra.value == "Kit") {
      this.consultarKits();
      this.limpiarCampos();
    } else {
      this.listaProductosDeUnKit = [];
      this.seccionKit = true;
      this.limpiarCampos();
    }
  }

  consultarTipoTransaccion() {
    this.facturaService
      .consultarTipoTransaccion(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        if (this.router.url === "/compras") {
          ok["respuesta"].map((item) => {
            if (item.Descripcion == "COMPRA") {
              this._tipoTransaccion.setValue(item.IdTipoTransaccion);
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
      })
      .finally(() => {
        this.seccionKit = false;
        this.buttonSeleccionarProducto = true;
      });
  }

  consultarLotesDeUnProducto() {
    this.inventarioService
      .consultarLotesDeUnProducto(
        this._idCabecera.value,
        this._idRelacionLogica.value,
        this._perteneceKit.value,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        this.lotes = ok["respuesta"];
        this.filteredOptions = this._lote.valueChanges.pipe(
          startWith(""),
          map((value) => this._filter(value))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  seleccionarLoteSiExiste(lote) {
    this._idAsignarProductoLote.setValue(
      lote.AsignarProductoLote.IdAsignarProductoLote
    );
    this._idLote.setValue(lote.IdLote);
    this._lote.setValue(lote.Codigo);
    this._fechaExpiracion.setValue(lote.FechaExpiracion);
    this._fechaExpiracion.disable();
    this._precio.setValue(lote.AsignarProductoLote.ValorUnitario);
    this._precio.disable();
  }

  seleccionarLote() {
    let dialogRef = this.modalLotes.open(ModalLotesComponent, {
      width: "500px",
      height: "auto",
      data: {
        idCabecera: this._idCabecera.value,
        idRelacionLogica: this._idRelacionLogica.value,
        perteneceKit: this._perteneceKit.value,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (result.idLote != "") {
          this._idLote.setValue(result.idLote);
          this._precio.setValue(result.precio);
          this._precio.disable();
          this._fechaExpiracion.disable();
        } else {
          this._lote.enable();
          this._fechaExpiracion.enable();
          this._precio.enable();
        }
        this._fechaExpiracion.setValue(result.fechaExpiracion);
        this._lote.setValue(result.nombreLote);
        this.clearFieldFecha = false;
        this.clearFieldLote = false;
      }
    });
  }

  consultarDetalleFactura() {
    var detalleCompra = [];
    this.detalleCompra.data = [];
    this.compraService
      .consultarDetalleFactura(
        this._idCabecera.value,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        ok["respuesta"][0].DetalleFactura.map((item) => {
          var lote = "";
          var idLote = "";
          var kit = "";
          var idKit = "";
          var fechaExpiracion = "";
          var nombreProducto = "";
          var presentacion = "";
          var contenidoNeto = "";
          var medida = "";
          var codigo = "";
          if (item.AsignarProductoLote[0].Lote) {
            lote = item.AsignarProductoLote[0].Lote.Codigo;
            idLote = item.AsignarProductoLote[0].Lote.IdLote;
            fechaExpiracion = item.AsignarProductoLote[0].Lote.FechaExpiracion;
          } else {
            lote = "";
            idLote = "";
            fechaExpiracion = item.AsignarProductoLote[0].FechaExpiracion;
          }
          if (item.AsignarProductoLote[0].PerteneceKit != "False") {
            kit =
              item.AsignarProductoLote[0].AsignarProductoKit.Kit.Descripcion;
            idKit = item.AsignarProductoLote[0].AsignarProductoKit.Kit.IdKit;
            nombreProducto =
              item.AsignarProductoLote[0].AsignarProductoKit.ListaProductos
                .Producto.Nombre;
            contenidoNeto =
              item.AsignarProductoLote[0].AsignarProductoKit.ListaProductos
                .CantidadMedida;
            medida =
              item.AsignarProductoLote[0].AsignarProductoKit.ListaProductos
                .Medida.Descripcion;
            codigo =
              item.AsignarProductoLote[0].AsignarProductoKit.ListaProductos
                .Codigo;
            presentacion =
              item.AsignarProductoLote[0].AsignarProductoKit.ListaProductos
                .Presentacion.Descripcion;
          } else {
            kit = "";
            idKit = "";
            nombreProducto =
              item.AsignarProductoLote[0].ConfigurarProductos.Producto.Nombre;
            contenidoNeto =
              item.AsignarProductoLote[0].ConfigurarProductos.CantidadMedida;
            medida =
              item.AsignarProductoLote[0].ConfigurarProductos.Medida
                .Descripcion;
            codigo = item.AsignarProductoLote[0].ConfigurarProductos.Codigo;
            presentacion =
              item.AsignarProductoLote[0].ConfigurarProductos.Presentacion
                .Descripcion;
          }
          var producto = {
            IdDetalleFactura: item.IdDetalleFactura,
            Codigo: codigo,
            IdAsignarProductoLote:
              item.AsignarProductoLote[0].IdAsignarProductoLote,
            IdKit: idKit,
            Kit: kit,
            IdLote: idLote,
            Lote: lote,
            FechaExpiracion: fechaExpiracion,
            Cantidad: item.Cantidad,
            Producto: nombreProducto,
            Presentacion: presentacion,
            ContenidoNeto: contenidoNeto,
            Medida: medida,
            Precio: item.AsignarProductoLote[0].ValorUnitario,
          };
          detalleCompra.push(producto);
        });
        this.detalleCompra.data = detalleCompra;
        this.detalleCompra.paginator = this.paginator;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  consultarKitsYSusProductos(idKit) {
    const url = "Inventario/ListaAsignarProductoKit";
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
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.buttonSeleccionarProducto = false;
      });
  }

  consultarFacturasNoFinalizadas() {
    const url = "Factura/ListaFacturasNoFinalizadas";
    this.facturaService
      .consultarFacturasNoFinalizadas(
        url,
        localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.facturasNoFinalizadas.data = [];
        this.facturasNoFinalizadas.data = ok["respuesta"];
        this.facturasNoFinalizadas.paginator = this.fnf_paginator;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  consultarFacturasFinalizadas() {
    const url = "Factura/ListaFacturasFinalizadas";
    this.facturaService
      .consultarFacturasNoFinalizadas(
        url,
        localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        console.log(ok['respuesta']);
        this.facturasFinalizadas.data = [];
        this.facturasFinalizadas.data = ok["respuesta"];
        this.facturasFinalizadas.paginator = this.ff_paginator;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onChangeSelectKit(idKit) {
    this.consultarKitsYSusProductos(idKit);
  }

  validarFormulario() {
    if (this.myForm.valid) {
      this.validarSiPerteneceALote();
    }
  }

  crearCabeceraFactura() {
    this.limpiarCampos();
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
        } else {
          this._idCabecera.setValue(ok["respuesta"].IdCabeceraFactura);
          this._cabecera.setValue(ok["respuesta"].Codigo);
          this.myForm.enable();
          this._lote.disable();
          this._fechaExpiracion.disable();
          this.selectTipoCompra = false;
          this.buttonSeleccionarProducto = false;
          this.buttonGenerarFactura = true;
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
      });
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
    this.compraService
      .crearDetalleFactura(
        this._idCabecera.value,
        this._idAsignarProductoLote.value,
        this._cantidad.value,
        "0",
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        this.limpiarCampos();
        this.consultarDetalleFactura();
        this.realizarCompraButton = false;
        this._precio.enable();
        this._fechaExpiracion.clearValidators();
        if (!this.seccionKit) {
          this.buttonSeleccionarProducto = true;
        }
        this.buttonGenerarFactura = false;
        this.buttonSeleccionarLote = true;
        this.clearFieldFecha = true;
        this.clearFieldLote = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  seleccionarProducto() {
    let dialogRef = this.modalAsignacionConfiguracionProducto.open(
      ModalAsignacionConfiguracionProductoComponent,
      {
        width: "600px",
        height: "auto",
        data: {
          listaProductosDeUnKit: this.listaProductosDeUnKit,
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        var producto =
          result.Producto +
          " " +
          result.Presentacion +
          " " +
          result.ContenidoNeto +
          " " +
          result.Medida;
        this._idRelacionLogica.setValue(result.IdRelacionLogica);
        this._perteneceKit.setValue(result.PerteneceKit);
        this._producto.setValue(producto);
        this.consultarLotesDeUnProducto();
        this.buscarFechaYPrecio();
        this._fechaExpiracion.reset();
        this._fechaExpiracion.enable();
        this._lote.reset();
        this._cantidad.reset();
        this._precio.reset();
        this.buttonSeleccionarLote = false;
      }
    });
  }

  quitarDetalleFactura(detalleFactura) {
    this.compraService
      .quitarDetalleFactura(
        detalleFactura.IdDetalleFactura,
        detalleFactura.IdCabeceraFactura,
        localStorage.getItem("miCuenta.deleteToken")
      )
      .then((ok) => {
        console.log(ok["respuesta"]);
        if (ok["respuesta"] == "0") {
          this._idCabecera.setValue("");
        } else {
          this.consultarDetalleFactura();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  realizarCompra() {
    const url = "Factura/FinalizarCabeceraFactura"
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
          this.limpiarCampos();
          this.detalleCompra.data = [];
          this._fechaActual.reset();
          this._cabecera.reset();
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

  mostrarDetallesFactura(factura) {
    this.myForm.reset();
    this.realizarCompraButton = false;
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

  crearLote() {
    this.inventarioService
      .crearLote(
        this._lote.value,
        this._cantidad.value,
        this.validarFecha(),
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (typeof ok["respuesta"] == "string") {
          this._idLote.setValue(ok["respuesta"]);
          this.asignarProductoLote(this._idLote.value, this.validarFecha());
        } else {
          this._idLote.setValue(ok["respuesta"].IdLote);
          this.asignarProductoLote(this._idLote.value, this.validarFecha());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  validarFecha() {
    var fechaExpiracion: any;
    fechaExpiracion = new Date(this._fechaExpiracion.value);
    var fechaActual = new Date();
    try {
      if (fechaExpiracion.getFullYear() < fechaActual.getFullYear()) {
        fechaExpiracion = null;
      } else {
        fechaExpiracion = fechaExpiracion.toJSON();
        fechaExpiracion = fechaExpiracion.split("T")[0];
        return fechaExpiracion;
      }
    } catch (error) {
      return (fechaExpiracion = null);
    }
  }

  validarSiPerteneceALote() {
    if (
      this._lote.value == "" ||
      this._lote.value == null ||
      this._lote.value == "null"
    ) {
      this.asignarProductoLote("", this.validarFecha());
    } else {
      if (
        this._idAsignarProductoLote.value == "" ||
        this._idAsignarProductoLote.value == null ||
        this._idAsignarProductoLote.value == "null"
      ) {
        if (this.loteEnDetalle) {
          this.crearLote();
        } else {
          return;
        }
      } else {
        this.crearLote();
      }
    }
  }

  asignarProductoLote(idLote?: string, fecha?: string) {
    this.inventarioService
      .asignarProductoLote(
        this._idCabecera.value,
        this._cantidad.value,
        this._idRelacionLogica.value,
        this._perteneceKit.value,
        this._precio.value,
        localStorage.getItem("miCuenta.postToken"),
        idLote,
        fecha
      )
      .then((ok) => {
        this._idAsignarProductoLote.setValue(
          ok["respuesta"].IdAsignarProductoLote
        );
        this.crearDetalleFactura();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  get _fechaActual() {
    return this.myForm.get("_fechaActual");
  }

  get _cantidad() {
    return this.myForm.get("_cantidad");
  }

  get _idRelacionLogica() {
    return this.myForm.get("_idRelacionLogica");
  }

  get _perteneceKit() {
    return this.myForm.get("_perteneceKit");
  }

  get _idKit() {
    return this.myForm.get("_idKit");
  }

  get _kit() {
    return this.myForm.get("_kit");
  }

  get _producto() {
    return this.myForm.get("_producto");
  }

  get _fechaExpiracion() {
    return this.myForm.get("_fechaExpiracion");
  }

  get _precio() {
    return this.myForm.get("_precio");
  }

  get _idCabecera() {
    return this.myForm.get("_idCabecera");
  }

  get _cabecera() {
    return this.myForm.get("_cabecera");
  }

  get _tipoTransaccion() {
    return this.myForm.get("_tipoTransaccion");
  }

  get _lote() {
    return this.myForm.get("_lote");
  }

  get _idLote() {
    return this.myForm.get("_idLote");
  }

  get _idAsignarProductoLote() {
    return this.myForm.get("_idAsignarProductoLote");
  }

  ngOnInit() {
    this.consultarTipoTransaccion();
    this.consultarFacturasNoFinalizadas();
    this.consultarFacturasFinalizadas();
    this.myForm.disable();
  }

  private _filter(value: string): string[] {
    try {
      const filterValue = value.toLowerCase();
      return this.lotes.filter((option) =>
        option.Codigo.toLowerCase().includes(filterValue)
      );
    } catch (error) {}
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
    "total",
    "acciones",
  ];
  tablaFacturasNoFinalidas = ["codigo", "usuario", "fecha", "acciones"];
  tablaFacturasFinalidas = ["codigo", "usuario", "fecha", "acciones"];
}
