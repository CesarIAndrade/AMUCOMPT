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
import { Router } from "@angular/router";
import { ModalLotesComponent } from "../modal-lotes/modal-lotes.component";

@Component({
  selector: "app-compra",
  templateUrl: "./compra.component.html",
  styleUrls: ["./compra.component.css"],
})
export class CompraComponent implements OnInit {
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

  myForm: FormGroup;
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
  @ViewChild("fnf_paginator", { static: false }) fnf_paginator: MatPaginator;
  @ViewChild("ff_paginator", { static: false }) ff_paginator: MatPaginator;
  detalleCompra = new MatTableDataSource<Element[]>();
  facturasNoFinalizadas = new MatTableDataSource<Element[]>();
  facturasFinalizadas = new MatTableDataSource<Element[]>();

  buscarFechaYPrecio() {
    if (
      this.myForm.get("_idRelacionLogica").value != "" &&
      this.myForm.get("_perteneceKit").value != ""
    ) {
      this.compraService
        .buscarFechaYPrecio(
          this.myForm.get("_idCabecera").value,
          this.myForm.get("_idRelacionLogica").value,
          this.myForm.get("_perteneceKit").value,
          this.validarFecha(),
          localStorage.getItem("miCuenta.getToken")
        )
        .then((ok) => {
          try {
            if (typeof ok["respuesta"] == "object") {
              this.myForm
                .get("_idAsignarProductoLote")
                .setValue(ok["respuesta"].IdAsignarProductoLote);
              this.myForm.get("_precio").disable();
              this.myForm
                .get("_precio")
                .setValue(ok["respuesta"].AsignarProductoLote[0].ValorUnitario);
            } else if (typeof ok["respuesta"] == "string") {
              this.myForm.get("_precio").enable();
              this.myForm.get("_precio").setValue("");
            }
          } catch (error) {}
        })
        .catch((error) => console.log(error));
    }
  }

  clearDate() {
    this.clearFieldFecha = true;
    this.myForm.get("_fechaExpiracion").setValue("");
    this.myForm.get("_fechaExpiracion").disable();
    this.clearFieldLote = true;
    this.myForm.get("_lote").setValue("");
    this.myForm.get("_lote").disable();
    this.myForm.get("_precio").setValue("");
    this.myForm.get("_precio").disable();
  }

  clearLote() {
    this.clearFieldLote = true;
    this.myForm.get("_lote").setValue("");
    this.myForm.get("_lote").disable();
    this.clearFieldFecha = true;
    this.myForm.get("_fechaExpiracion").disable();
    this.myForm.get("_fechaExpiracion").setValue("");
    this.myForm.get("_precio").setValue("");
    this.myForm.get("_precio").disable();
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
            if (ok["respuesta"]) {
              this.consultarDetalleFactura();
            }
          })
          .catch((error) => console.log(error));
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
              this.myForm
                .get("_tipoTransaccion")
                .setValue(item.IdTipoTransaccion);
            }
          });
        }
      })
      .catch((error) => console.log(error))
      .finally(() => this.consultarFacturasNoFinalizadas());
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
      .catch((error) => console.log(error))
      .finally(() => {
        this.seccionKit = false;
        this.buttonSeleccionarProducto = true;
      });
  }

  consultarLotesDeUnProducto() {
    this.inventarioService
      .consultarLotesDeUnProducto(
        this.myForm.get("_idCabecera").value,
        this.myForm.get("_idRelacionLogica").value,
        this.myForm.get("_perteneceKit").value,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        this.lotes = ok["respuesta"];
        this.filteredOptions = this.myForm.get("_lote").valueChanges.pipe(
          startWith(""),
          map((value) => this._filter(value))
        );
      })
      .catch((error) => console.log(error));
  }

  seleccionarLoteSiExiste(lote) {
    this.myForm
      .get("_idAsignarProductoLote")
      .setValue(lote.AsignarProductoLote.IdAsignarProductoLote);
    this.myForm.get("_idLote").setValue(lote.IdLote);
    this.myForm.get("_lote").setValue(lote.Codigo);
    this.myForm.get("_fechaExpiracion").setValue(lote.FechaExpiracion);
    this.myForm.get("_fechaExpiracion").disable();
    this.myForm.get("_precio").setValue(lote.AsignarProductoLote.ValorUnitario);
    this.myForm.get("_precio").disable();
  }

  seleccionarLote() {
    let dialogRef = this.modalLotes.open(ModalLotesComponent, {
      width: "500px",
      height: "auto",
      data: {
        idCabecera: this.myForm.get("_idCabecera").value,
        idRelacionLogica: this.myForm.get("_idRelacionLogica").value,
        perteneceKit: this.myForm.get("_perteneceKit").value,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (result.idLote != "") {
          this.myForm.get("_idLote").setValue(result.idLote);
          this.myForm.get("_precio").setValue(result.precio);
          this.myForm.get("_precio").disable();
          this.myForm.get("_fechaExpiracion").disable();
        } else {
          this.myForm.get("_lote").enable();
          this.myForm.get("_fechaExpiracion").enable();
          this.myForm.get("_precio").enable();
        }
        this.myForm.get("_fechaExpiracion").setValue(result.fechaExpiracion);
        this.myForm.get("_lote").setValue(result.nombreLote);
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
        this.myForm.get("_idCabecera").value,
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
      .catch((error) => console.log(error));
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
      .catch((error) => console.log(error))
      .finally(() => (this.buttonSeleccionarProducto = false));
  }

  consultarFacturasNoFinalizadas() {
    const url = "Factura/ListaFacturasNoFinalizadas";
    this.facturaService
      .consultarFacturasNoFinalizadas(
        url,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        try {
          this.facturasNoFinalizadas.data = [];
          this.facturasNoFinalizadas.data = ok["respuesta"];
          this.facturasNoFinalizadas.paginator = this.fnf_paginator;
        } catch (error) {
          this.consultarFacturasNoFinalizadas();
        }
      })
      .catch((error) => console.log(error))
      .finally(() => this.consultarFacturasFinalizadas());
  }

  consultarFacturasFinalizadas() {
    const url = "Factura/ListaFacturasFinalizadas";
    this.facturaService
      .consultarFacturasFinalizadas(
        url,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        try {
          this.facturasFinalizadas.data = [];
          this.facturasFinalizadas.data = ok["respuesta"];
          this.facturasFinalizadas.paginator = this.ff_paginator;
        } catch (error) {
          this.consultarFacturasFinalizadas();
        }
      })
      .catch((error) => console.log(error));
  }

  onChangeSelectKit(idKit) {
    this.consultarKitsYSusProductos(idKit);
  }

  onChangeFecha() {
    this.myForm.get("_precio").reset();
    this.myForm.get("_precio").enable();
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
        this.myForm.get("_tipoTransaccion").value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == "false") {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        } else {
          this.myForm
            .get("_idCabecera")
            .setValue(ok["respuesta"].IdCabeceraFactura);
          this.myForm.get("_cabecera").setValue(ok["respuesta"].Codigo);
          this.myForm.enable();
          this.myForm.get("_lote").disable();
          this.myForm.get("_fechaExpiracion").disable();
          this.selectTipoCompra = false;
          this.buttonSeleccionarProducto = false;
          this.buttonGenerarFactura = true;
          var fecha = new Date();
          var dia = this.dias[fecha.getDay()];
          var mes = this.meses[fecha.getMonth()];
          this.myForm
            .get("_fechaActual")
            .setValue(
              dia +
                ", " +
                fecha.getDate() +
                " " +
                mes +
                " " +
                fecha.getFullYear()
            );
        }
      })
      .catch((error) => console.log(error));
  }

  limpiarCampos() {
    this.myForm.get("_idRelacionLogica").reset();
    this.myForm.get("_perteneceKit").reset();
    this.myForm.get("_idKit").reset();
    this.myForm.get("_kit").reset();
    this.myForm.get("_producto").reset();
    this.myForm.get("_cantidad").reset();
    this.myForm.get("_fechaExpiracion").reset();
    this.myForm.get("_precio").reset();
    this.myForm.get("_idLote").reset();
    this.myForm.get("_lote").reset();
    this.myForm.get("_idAsignarProductoLote").reset();
  }

  crearDetalleFactura() {
    this.compraService
      .crearDetalleFactura(
        this.myForm.get("_idCabecera").value,
        this.myForm.get("_idAsignarProductoLote").value,
        this.myForm.get("_cantidad").value,
        "0",
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        this.limpiarCampos();
        this.consultarDetalleFactura();
        this.realizarCompraButton = false;
        this.myForm.get("_precio").enable();
        this.myForm.get("_fechaExpiracion").clearValidators();
        if (!this.seccionKit) {
          this.buttonSeleccionarProducto = true;
        }
        this.buttonGenerarFactura = false;
        this.buttonSeleccionarLote = true;
        this.clearFieldFecha = true;
        this.clearFieldLote = true;
      })
      .catch((error) => console.log(error));
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
        this.myForm.get("_idRelacionLogica").setValue(result.IdRelacionLogica);
        this.myForm.get("_perteneceKit").setValue(result.PerteneceKit);
        this.myForm.get("_producto").setValue(producto);
        this.consultarLotesDeUnProducto();
        this.buscarFechaYPrecio();
        this.myForm.get("_fechaExpiracion").reset();
        this.myForm.get("_fechaExpiracion").enable();
        this.myForm.get("_lote").reset();
        this.myForm.get("_cantidad").reset();
        this.myForm.get("_precio").reset();
        this.buttonSeleccionarLote = false;
      }
    });
  }

  quitarDetalleFactura(detalleFactura) {
    this.compraService
      .quitarDetalleFactura(
        detalleFactura.IdDetalleFactura,
        this.myForm.get("_idCabecera").value,
        localStorage.getItem("miCuenta.deleteToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == "0") {
          this.myForm.get("_idCabecera").setValue("");
          this.myForm.reset();
          this.detalleCompra.data = [];
        } else {
          this.consultarDetalleFactura();
        }
      })
      .catch((error) => console.log(error))
      .finally(() => this.consultarFacturasNoFinalizadas());
  }

  realizarCompra() {
    const url = "Factura/FinalizarCabeceraFactura";
    this.facturaService
      .finalizarFactura(
        this.myForm.get("_idCabecera").value,
        url,
        localStorage.getItem("miCuenta.putToken")
      )
      .then((ok) => {
        if (ok["respuesta"]) {
          sweetAlert("Se ingresó correctamente!", {
            icon: "success",
          });
          var tipoTransaccion = this.myForm.get("_tipoTransaccion").value;
          this.myForm.reset();
          this.myForm.get("_tipoTransaccion").setValue(tipoTransaccion);
        } else {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        this.consultarFacturasNoFinalizadas();
        this.consultarFacturasFinalizadas();
        this.detalleCompra.data = [];
      });
  }

  mostrarDetallesFactura(factura) {
    this.myForm.reset();
    this.realizarCompraButton = false;
    this.myForm.get("_idCabecera").setValue(factura.IdCabeceraFactura);
    this.consultarDetalleFactura();
    this.myForm.get("_cabecera").setValue(factura.Codigo);
    this.myForm.enable();
    this.buttonSeleccionarProducto = false;
    this.selectTipoCompra = false;
    this.buttonGenerarFactura = false;
    var fecha = new Date(factura.FechaGeneracion);
    var dia = this.dias[fecha.getDay()];
    var mes = this.meses[fecha.getMonth()];
    this.myForm
      .get("_fechaActual")
      .setValue(
        dia + ", " + fecha.getDate() + " " + mes + " " + fecha.getFullYear()
      );
  }

  crearLote() {
    this.inventarioService
      .crearLote(
        this.myForm.get("_lote").value,
        this.myForm.get("_cantidad").value,
        this.validarFecha(),
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        this.myForm.get("_idLote").setValue(ok["respuesta"].IdLote);
        if (this.myForm.get("_idLote").value) {
          this.asignarProductoLote(
            this.myForm.get("_idLote").value,
            this.validarFecha()
          );
        } else if (ok["respuesta"] == "False") {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        } else {
          sweetAlert(ok["respuesta"], {
            icon: "warning",
          });
        }
      })
      .catch((error) => console.log(error));
  }

  validarFecha() {
    var fechaExpiracion: any;
    fechaExpiracion = new Date(this.myForm.get("_fechaExpiracion").value);
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
    if (this.myForm.get("_idLote").value) {
      this.asignarProductoLote(
        this.myForm.get("_idLote").value,
        this.validarFecha()
      );
    } else if (this.myForm.get("_lote").value) {
      this.crearLote();
    } else {
      this.asignarProductoLote("", this.validarFecha());
    }
  }

  asignarProductoLote(idLote?: string, fecha?: string) {
    this.inventarioService
      .asignarProductoLote(
        this.myForm.get("_idCabecera").value,
        this.myForm.get("_cantidad").value,
        this.myForm.get("_idRelacionLogica").value,
        this.myForm.get("_perteneceKit").value,
        this.myForm.get("_precio").value,
        localStorage.getItem("miCuenta.postToken"),
        idLote,
        fecha
      )
      .then((ok) => {
        this.myForm
          .get("_idAsignarProductoLote")
          .setValue(ok["respuesta"].IdAsignarProductoLote);
        this.crearDetalleFactura();
      })
      .catch((error) => console.log(error));
  }

  ngOnInit() {
    this.consultarTipoTransaccion();
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
