import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Observable } from "rxjs";
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
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";

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
    private modalLotes: MatDialog,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      _idCabecera: new FormControl(""),
      _cabecera: new FormControl(""),
      _idRelacionLogica: new FormControl(""),
      _perteneceKit: new FormControl(""),
      _kit: new FormControl(""),
      _producto: new FormControl("", [Validators.required]),
      _cantidad: new FormControl("", [Validators.required]),
      _fechaExpiracion: new FormControl(""),
      _precio: new FormControl("", [Validators.required]),
      _lote: new FormControl(""),
      _idAsignarProductoLote: new FormControl(""),
      _fechaFactura: new FormControl(""),
    });
  }

  myForm: FormGroup;
  selected = "Producto";
  idLote = "";
  selectedTab = 0;
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

  openDialog(mensaje): void {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: "250px",
      data: { mensaje: mensaje },
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Cerrar", {
      duration: 2000,
      horizontalPosition: "right",
    });
  }

  async consultarTipoTransaccion() {
    var respuesta = await this.facturaService.consultarTipoTransaccion();
    if (respuesta["codigo"] == "200") {
      if (this.router.url === "/compras") {
        respuesta["respuesta"].map((item) => {
          if (item.Descripcion == "COMPRA") {
            localStorage.setItem("miCuenta.compras", item.IdTipoTransaccion);
          }
        });
      }
    }
  }

  async crearCabeceraFactura() {
    var respuesta = await this.facturaService.crearCabeceraFactura(
      localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
      localStorage.getItem("miCuenta.compras")
    );
    if (respuesta["codigo"] == "200") {
      this.consultarFacturas();
      this.limpiarCampos();
      this.detalleCompra.data = [];
      this.myForm
        .get("_idCabecera")
        .setValue(respuesta["respuesta"].IdCabeceraFactura);
      this.myForm.get("_cabecera").setValue(respuesta["respuesta"].Codigo);
      var fechaFactura = new Date(respuesta["respuesta"].FechaGeneracion)
        .toJSON()
        .split("T")[0];
      this.myForm.get("_fechaFactura").setValue(fechaFactura);
      this.myForm.enable();
      this.myForm.get("_lote").disable();
      this.myForm.get("_fechaExpiracion").disable();
      this.selectTipoCompra = false;
      this.buttonSeleccionarProducto = false;
      this.buttonGenerarFactura = true;
    } else {
      this.openDialog("Problemas con el servidor");
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
      this.buttonSeleccionarProducto = false;
    }
  }

  async consultarKits() {
    var respuesta = await this.inventarioService.consultarKits();
    if (respuesta["codigo"] == "200") {
      this.kits = [];
      respuesta["respuesta"].map((kit) => {
        if (kit.KitUtilizado == "1") {
          this.kits.push(kit);
        }
      });
      this.seccionKit = false;
      this.buttonSeleccionarProducto = true;
    }
  }

  async consultarKitsYSusProductos(idKit) {
    const respuesta = await this.inventarioService.consultarKitsYSusProductos(
      idKit,
      "Inventario/ListaAsignarProductoKit"
    );
    if (respuesta["codigo"] == "200") {
      this.listaProductosDeUnKit = [];
      this.listaProductosDeUnKit =
        respuesta["respuesta"][0]["ListaAsignarProductoKit"];
      this.buttonSeleccionarProducto = false;
    }
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
        this.myForm.get("_fechaExpiracion").reset();
        this.myForm.get("_fechaExpiracion").enable();
        this.myForm.get("_lote").reset();
        this.myForm.get("_cantidad").reset();
        this.myForm.get("_precio").reset();
        this.myForm.get("_precio").enable();
        this.buttonSeleccionarLote = false;
        this.buscarFechaYPrecio();
      }
    });
  }

  async buscarFechaYPrecio() {
    var respuesta = await this.compraService.buscarFechaYPrecio(
      this.myForm.get("_idCabecera").value,
      this.myForm.get("_idRelacionLogica").value,
      this.myForm.get("_perteneceKit").value,
      this.validarFecha()
    );
    if (respuesta["codigo"] == "200") {
      this.myForm
        .get("_idAsignarProductoLote")
        .setValue(respuesta["respuesta"].IdAsignarProductoLote);
      this.myForm.get("_precio").disable();
      this.myForm.get("_precio").setValue(respuesta["respuesta"].ValorUnitario);
    }
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
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (result.idLote != "") {
          this.idLote = result.idLote;
          this.myForm.get("_precio").setValue(result.precio);
          this.myForm.get("_precio").disable();
        } else {
          this.myForm.get("_precio").setValue("");
          this.myForm.get("_precio").enable();
        }
        this.myForm.get("_fechaExpiracion").setValue(result.fechaExpiracion);
        this.myForm.get("_fechaExpiracion").disable();
        this.myForm.get("_lote").setValue(result.nombreLote);
        this.clearFieldFecha = false;
        this.clearFieldLote = false;
      }
    });
  }

  limpiarFechaYLote() {
    this.buscarFechaYPrecio();
    this.clearFieldFecha = true;
    this.clearFieldLote = true;
    this.myForm.get("_fechaExpiracion").setValue("");
    this.myForm.get("_fechaExpiracion").enable();
    this.myForm.get("_lote").setValue("");
    this.myForm.get("_lote").disable();
    this.myForm.get("_precio").setValue("");
    this.myForm.get("_precio").enable();
    this.idLote = "";
  }

  validarFecha() {
    var fechaExpiracion: any = new Date(
      this.myForm.get("_fechaExpiracion").value
    );
    var fechaActual = new Date();
    if (fechaExpiracion.getFullYear() < fechaActual.getFullYear()) {
      return (fechaExpiracion = "");
    } else {
      fechaExpiracion = fechaExpiracion.toJSON().split("T")[0];
      return fechaExpiracion;
    }
  }

  async validarSiPerteneceALote() {
    var fechaExpiracion = this.validarFecha();
    if (this.myForm.valid) {
      if (this.idLote != "") {
        this.asignarProductoLote(this.idLote, fechaExpiracion);
      } else if (this.myForm.get("_lote").value != null) {
        this.crearLote(fechaExpiracion);
      } else {
        this.asignarProductoLote("", fechaExpiracion);
      }
    }
  }

  async crearLote(fechaExpiracion) {
    var lote = await this.inventarioService.crearLote(
      this.myForm.get("_lote").value,
      this.myForm.get("_cantidad").value,
      fechaExpiracion
    );
    if (lote["codigo"] == "200") {
      this.asignarProductoLote(lote["respuesta"].IdLote, fechaExpiracion);
    } else if (lote["codigo"] == "500") {
      this.openDialog(lote["mensaje"]);
    }
  }

  async asignarProductoLote(idLote?: string, fechaExpiracion?: string) {
    var asignacionProductoLote = await this.inventarioService.asignarProductoLote(
      this.myForm.get("_idCabecera").value,
      this.myForm.get("_cantidad").value,
      this.myForm.get("_idRelacionLogica").value,
      this.myForm.get("_perteneceKit").value,
      this.myForm.get("_precio").value,
      idLote ? idLote : "",
      fechaExpiracion ? fechaExpiracion : ""
    );
    if (asignacionProductoLote["codigo"] == "200") {
      this.crearDetalleFactura(
        asignacionProductoLote["respuesta"].IdAsignarProductoLote
      );
    }
  }

  async crearDetalleFactura(idAsignarProductoLote) {
    var respuesta = await this.compraService.crearDetalleFactura(
      this.myForm.get("_idCabecera").value,
      idAsignarProductoLote,
      this.myForm.get("_cantidad").value,
      "0"
    );
    if (respuesta["codigo"] == "200") {
      this.openSnackBar("Se ingresó correctamente");
      this.limpiarCampos();
      this.consultarDetalleFactura();
      this.realizarCompraButton = false;
      this.myForm.get("_precio").enable();
      this.myForm.get("_fechaExpiracion").clearValidators();
      if (!this.seccionKit) {
        this.buttonSeleccionarProducto = true;
        this.seccionKit = true;
        this.selected = "Producto";
      }
      this.buttonGenerarFactura = false;
      this.buttonSeleccionarLote = true;
      this.clearFieldFecha = true;
      this.clearFieldLote = true;
    }
  }

  async consultarDetalleFactura() {
    var respuesta = await this.compraService.consultarDetalleFactura(
      this.myForm.get("_idCabecera").value
    );
    var detalleCompra: any = [];
    this.detalleCompra.data = [];
    if (respuesta["codigo"] == "200") {
      respuesta["respuesta"][0].DetalleFactura.map((item) => {
        var lote = "N/A";
        var idLote = "";
        var kit = "N/A";
        var idKit = "";
        var fechaExpiracion = "";
        var nombreProducto = "";
        var presentacion = "";
        var contenidoNeto = "";
        var medida = "";
        var codigo = "";
        var total = item.Cantidad * item.AsignarProductoLote[0].ValorUnitario;
        if (item.AsignarProductoLote[0].Lote) {
          lote = item.AsignarProductoLote[0].Lote.Codigo;
          idLote = item.AsignarProductoLote[0].Lote.IdLote;
          fechaExpiracion = item.AsignarProductoLote[0].Lote.FechaExpiracion;
        } else if (item.AsignarProductoLote[0].FechaExpiracion) {
          fechaExpiracion = item.AsignarProductoLote[0].FechaExpiracion;
        }
        if (item.AsignarProductoLote[0].PerteneceKit != "False") {
          kit = item.AsignarProductoLote[0].AsignarProductoKit.Kit.Descripcion;
          idKit = item.AsignarProductoLote[0].AsignarProductoKit.Kit.IdKit;
          nombreProducto =
            item.AsignarProductoLote[0].AsignarProductoKit.ListaProductos
              .Producto.Nombre;
          contenidoNeto =
            item.AsignarProductoLote[0].AsignarProductoKit.ListaProductos
              .CantidadMedida;
          medida =
            item.AsignarProductoLote[0].AsignarProductoKit.ListaProductos.Medida
              .Descripcion;
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
            item.AsignarProductoLote[0].ConfigurarProductos.Medida.Descripcion;
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
          Total: total,
        };
        detalleCompra.push(producto);
      });
      this.detalleCompra.data = detalleCompra;
      this.detalleCompra.paginator = this.paginator;
    }
  }

  async quitarDetalleFactura(idDetalleFactura) {
    var respuesta = await this.compraService.quitarDetalleFactura(
      idDetalleFactura,
      this.myForm.get("_idCabecera").value
    );
    if (respuesta["codigo"] == "200") {
      this.openSnackBar("Se eliminó correctamente");
      this.consultarDetalleFactura();
    } else if (respuesta["codigo"] == "201") {
      this.openSnackBar("Factura eliminada");
      this.consultarFacturas();
      this.myForm.reset();
      this.detalleCompra.data = [];
    }
  }

  async modificarCantidadDeProductoEnDetalle(
    event,
    idDetalleFactura,
    cantidad
  ) {
    if (event.key == "Enter") {
      if (event.target.value <= 0) {
        event.target.value = cantidad;
      } else {
        var respuesta = await this.compraService.modificarCantidadDeProductoEnDetalle(
          idDetalleFactura,
          event.target.value
        );
        if(respuesta["codigo"] == "200") {
          this.consultarDetalleFactura();
        }
      }
    }
  }

  async realizarCompra() {
    var respuesta = await this.facturaService.finalizarFactura(
      this.myForm.get("_idCabecera").value,
      "Factura/FinalizarCabeceraFactura"
    );
    if (respuesta["codigo"] == "200") {
      this.openDialog("Compra realizada con éxito");
      this.consultarFacturas();
      this.selectTipoCompra = true;
      if (!this.seccionKit) {
        this.buttonSeleccionarProducto = true;
        this.seccionKit = true;
        this.selected = "Producto";
      }
      this.myForm.reset();
      this.myForm.disable();
      this.detalleCompra.data = [];
    }
  }

  mostrarDetallesFactura(factura) {
    this.selectedTab = 0;
    this.myForm.reset();
    this.myForm.enable();
    this.myForm.get("_lote").disable();
    this.myForm.get("_idCabecera").setValue(factura.IdCabeceraFactura);
    this.myForm.get("_cabecera").setValue(factura.Codigo);
    this.myForm
      .get("_fechaFactura")
      .setValue(new Date(factura.FechaGeneracion).toJSON().split("T")[0]);
    this.realizarCompraButton = false;
    this.buttonSeleccionarProducto = false;
    this.selectTipoCompra = false;
    this.buttonGenerarFactura = false;
    this.consultarDetalleFactura();
  }

  onChangeFecha() {
    this.buscarFechaYPrecio();
    this.clearFieldFecha = false;
    this.myForm.get("_precio").reset();
    this.myForm.get("_precio").enable();
  }

  loadingFnF = true;
  loadingFF = true;
  async consultarFacturas() {
    var facturasNoFinalizadas = await this.facturaService.consultarFacturas(
      "Factura/ListaFacturasNoFinalizadas"
    );
    var facturasFinalizadas = await this.facturaService.consultarFacturas(
      "Factura/ListaFacturasFinalizadas"
    );
    if (facturasNoFinalizadas["codigo"] == "200") {
      this.loadingFnF = false;
      this.facturasNoFinalizadas.data = facturasNoFinalizadas["respuesta"];
      this.facturasNoFinalizadas.paginator = this.fnf_paginator;
    }
    if (facturasFinalizadas["codigo"] == "200") {
      this.loadingFF = false;
      this.facturasFinalizadas.data = facturasFinalizadas["respuesta"];
      this.facturasFinalizadas.paginator = this.ff_paginator;
    }
  }

  limpiarCampos() {
    this.myForm.get("_idRelacionLogica").reset();
    this.myForm.get("_perteneceKit").reset();
    this.myForm.get("_producto").reset();
    this.myForm.get("_kit").reset();
    this.myForm.get("_cantidad").reset();
    this.myForm.get("_fechaExpiracion").reset();
    this.myForm.get("_precio").reset();
    this.idLote = "";
    this.myForm.get("_lote").reset();
  }

  ngOnInit() {
    this.consultarTipoTransaccion();
    this.consultarFacturas();
    this.myForm.reset();
    this.myForm.disable();
  }

  tablaDetalleCompra = [
    "codigo",
    "descripcion",
    "contenido",
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
