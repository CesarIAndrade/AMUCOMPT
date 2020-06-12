import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
  MatTableDataSource,
  MatPaginator,
  MatSnackBar,
} from "@angular/material";
import { MatDialog } from "@angular/material/dialog";

// Components
import { ModalAsignacionUsuarioPersonaComponent } from "../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component";
import { ModalAsignacionConfiguracionProductoComponent } from "../modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component";
import { ModalLocalidadSuperiorComponent } from "../modal-localidad-superior/modal-localidad-superior.component";

// Services
import { InventarioService } from "src/app/services/inventario.service";
import { FacturaService } from "src/app/services/factura.service";
import { VentaService } from "src/app/services/venta.service";
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";
import { ModalPersonaComponent } from "../modal-persona/modal-persona.component";
import { runInThisContext } from 'vm';

@Component({
  selector: "app-venta",
  templateUrl: "./venta.component.html",
  styleUrls: ["./venta.component.css"],
})
export class VentaComponent implements OnInit {
  constructor(
    private modalAsignacionUsuarioPersona: MatDialog,
    private modalAsignacionConfiguracionProducto: MatDialog,
    private inventarioService: InventarioService,
    private ventaService: VentaService,
    private facturaService: FacturaService,
    private modalLocalidadSuperior: MatDialog,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      _idCabecera: new FormControl(""),
      _cabecera: new FormControl(""),
      _fechaFactura: new FormControl(""),
      _producto: new FormControl(""),
      _cantidad: new FormControl(""),
      _precio: new FormControl(""),
      _persona: new FormControl(""),
      _cedula: new FormControl(""),
      _idPersona: new FormControl(""),
      _nombres: new FormControl(""),
      _idAsignarProductoLote: new FormControl(""),
      _kit: new FormControl(""),
      _checkedDescuento: new FormControl(false),
      _disponible: new FormControl(""),
      _descuento: new FormControl(""),
      _fechaFinalCredito: new FormControl(""),
      _aplicaSeguro: new FormControl(false),
    });
  }

  myForm: FormGroup;
  selected = "Producto";
  pago = "Efectivo";
  selectedTab = 0;
  permitirAnadir: any;
  totalDescontado: string;
  subTotalFactura: string;
  totalFactura: string;
  totalIva: string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  seccionKit = true;
  kit = true;
  buttonSeleccionarProducto = true;
  selectTipoCompra = true;
  selectTipoPago = true;
  buttonSeleccionarPersona = true;
  buttonSeleccionarComunidad = true;
  buttonGenerarFactura = false;
  buttonRealizarVenta = true;
  inputDescuento = true;
  siSePagaACredito = true;
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
  tipoPago: any[] = [{ tipo: "Efectivo" }, { tipo: "Crédito" }];
  comunidades: any[] = [];
  kits: any[] = [];
  listaProductosDeUnKit: any[] = [];

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild("fnf_paginator", { static: false }) fnf_paginator: MatPaginator;
  @ViewChild("ff_paginator", { static: false }) ff_paginator: MatPaginator;
  detalleVenta = new MatTableDataSource<Element[]>();
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
      if (this.router.url === "/ventas") {
        respuesta["respuesta"].map((item) => {
          if (item.Descripcion == "VENTA") {
            localStorage.setItem("miCuenta.ventas", item.IdTipoTransaccion);
          }
        });
      }
    }
  }

  async crearCabeceraFactura() {
    var respuesta = await this.facturaService.crearCabeceraFactura(
      localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
      localStorage.getItem("miCuenta.ventas")
    );
    if (respuesta["codigo"] == "200") {
      this.consultarFacturas();
      this.limpiarCampos();
      this.detalleVenta.data = [];
      this.myForm
        .get("_idCabecera")
        .setValue(respuesta["respuesta"].IdCabeceraFactura);
      this.myForm.get("_cabecera").setValue(respuesta["respuesta"].Codigo);
      var fechaFactura = new Date(respuesta["respuesta"].FechaGeneracion)
        .toJSON()
        .split("T")[0];
      this.myForm.get("_fechaFactura").setValue(fechaFactura);
      this.buttonGenerarFactura = true;
      this.buttonSeleccionarPersona = false;
      this.buttonSeleccionarProducto = false;
      this.buttonSeleccionarComunidad = false;
      this.selectTipoCompra = false;
      this.selectTipoPago = false;
      this.myForm.enable();
      this.myForm.get("_checkedDescuento").disable();
    }
  }

  selecionarTipoCompra(tipoCompra) {
    if (tipoCompra.value == "Kit") {
      this.seccionKit = false;
      this.consultarKits();
      this.limpiarCampos();
    } else {
      this.listaProductosDeUnKit = [];
      this.seccionKit = true;
      this.limpiarCampos();
    }
  }

  async consultarKits() {
    var kits = await this.inventarioService.consultarKits();
    if (kits["codigo"] == "200") {
      this.kits = [];
      kits["respuesta"].map((item) => {
        if (item.KitUtilizado == "1") {
          this.kits.push(item);
        }
      });
      this.seccionKit = false;
      this.buttonSeleccionarProducto = true;
    }
  }

  async consultarKitsYSusProductos(idKit) {
    var respuesta = await this.inventarioService.consultarKitsYSusProductos(
      idKit,
      "Stock/ListaAsignarProductoKitEnStock"
    );
    if (respuesta["codigo"] == "200") {
      this.listaProductosDeUnKit = [];
      this.listaProductosDeUnKit =
        respuesta["respuesta"][0]["ListaAsignarProductoKit"];
      this.permitirAnadir = respuesta["respuesta"][0]["PermitirAnadir"];
      this.buttonSeleccionarProducto = false;
    }
  }

  seleccionarProducto() {
    let dialogRef = this.modalAsignacionConfiguracionProducto.open(
      ModalAsignacionConfiguracionProductoComponent,
      {
        width: "800px",
        height: "auto",
        data: {
          listaProductosDeUnKit: this.listaProductosDeUnKit,
          idCabeceraFactura: this.myForm.get("_idCabecera").value,
          permitirAnadir: this.permitirAnadir,
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if(result) {
          this.consultarDetalleFactura();
        }
        if (result.Kit != "") {
          this.kit = false;
          this.myForm.get("_kit").setValue(result.Kit);
          this.myForm.get("_descuento").setValue(result.Porcentaje);
        } else {
          this.kit = true;
          this.myForm.get("_kit").setValue("");
          this.myForm.get("_checkedDescuento").setValue(false);
        }
        this.myForm
          .get("_idAsignarProductoLote")
          .setValue(result.IdAsignarProductoLote);
        this.consultarPrecioDeUnProducto();
        this.myForm.get("_disponible").setValue(result.Disponible);
        var producto =
          result.Producto +
          " " +
          result.Presentacion +
          " " +
          result.ContenidoNeto +
          " " +
          result.Medida;
        this.myForm.get("_producto").setValue(producto);
        this.myForm.get("_cantidad").reset();
        this.myForm.get("_checkedDescuento").enable();
      }
    });
  }

  aplicarDescuento(event) {
    event.checked
      ? (this.inputDescuento = false)
      : (this.inputDescuento = true);
  }

  async consultarPrecioDeUnProducto() {
    var respuesta = await this.inventarioService.buscarPrecioDeUnProducto(
      this.myForm.get("_idAsignarProductoLote").value
    );
    if (respuesta["codigo"] == "200") {
      this.myForm.get("_precio").setValue(respuesta["respuesta"].Precio);
    }
  }

  seleccionarPersona() {
    let dialogRef = this.modalAsignacionUsuarioPersona.open(
      ModalPersonaComponent,
      {
        width: "auto",
        height: "auto",
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.myForm.get("_cedula").setValue(result.cedula);
        this.myForm.get("_idPersona").setValue(result.idPersona);
        var nombres = result.nombres + " " + result.apellidos;
        this.myForm.get("_nombres").setValue(nombres);
      }
    });
  }

  selecionarTipoPago(tipoPago) {
    if (tipoPago.value == "Efectivo") {
      this.siSePagaACredito = true;
      this.myForm.get("_aplicaSeguro").setValue(false);
      this.myForm.get("_aplicaSeguro").enable();
      this.myForm.get("_fechaFinalCredito").clearValidators();
      this.myForm.get("_fechaFinalCredito").updateValueAndValidity();
    } else {
      this.siSePagaACredito = false;
      this.myForm.get("_aplicaSeguro").setValue(true);
      this.myForm.get("_aplicaSeguro").disable();
      this.myForm
        .get("_fechaFinalCredito")
        .setValidators([Validators.required]);
      this.myForm.get("_fechaFinalCredito").updateValueAndValidity();
    }
    this.myForm.get("_fechaFinalCredito").setValue("");
  }

  async crearDetalleVenta() {
    if (this.myForm.valid) {
      var respuesta = await this.ventaService.crearDetalleFactura(
        this.myForm.get("_idCabecera").value,
        this.myForm.get("_idAsignarProductoLote").value,
        this.myForm.get("_checkedDescuento").value ? "1" : "0",
        "0",
        String(this.myForm.get("_cantidad").value),
        this.myForm.get("_descuento").value == null
          ? ""
          : this.myForm.get("_descuento").value
      );
      if (respuesta["codigo"] == "200") {
        this.buttonRealizarVenta = false;
        this.kit = true;
        this.seccionKit = true;
        this.selected = "Producto";
        this.inputDescuento = true;
        this.myForm.get("_checkedDescuento").disable();
        this.limpiarCampos();
        this.consultarDetalleFactura();
      }
    }
  }

  async consultarDetalleFactura() {
    var respuesta = await this.ventaService.consultarDetalleFactura(
      this.myForm.get("_idCabecera").value
    );
    if (respuesta["codigo"] == "200") {
      var codigo = "";
      var idLote = "";
      var lote = "N/A";
      var idKit = "";
      var kit = "N/A";
      var nombreProducto = "";
      var presentacion = "";
      var contenido = "";
      var fechaExpiracion = "";
      var descuento = "0";
      var porcentajeDescuento = "0";
      var perteneceKitCompleto = false;
      var detalleVenta = [];
      this.subTotalFactura = respuesta["respuesta"].Subtotal;
      this.totalDescontado = respuesta["respuesta"].TotalDescuento;
      this.totalIva = respuesta["respuesta"].TotalIva;
      this.totalFactura = respuesta["respuesta"].Total;
      respuesta["respuesta"].DetalleVenta.map((item) => {
        if (item.AsignarProductoLote.FechaExpiracion) {
          fechaExpiracion = item.AsignarProductoLote.FechaExpiracion;
        }
        if (item.PerteneceKitCompleto) {
          perteneceKitCompleto = true;
        } else {
          perteneceKitCompleto = false;
        }
        if (item.AsignarProductoLote.Lote) {
          idLote = item.AsignarProductoLote.Lote.IdLote;
          lote = item.AsignarProductoLote.Lote.Codigo;
        }
        if (item.AsignarProductoLote.PerteneceKit == "True") {
          codigo =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Codigo;
          nombreProducto =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Producto
              .Nombre;
          presentacion =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos
              .Presentacion.Descripcion;
          contenido =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos
              .CantidadMedida +
            " " +
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Medida
              .Descripcion;
          idKit = item.AsignarProductoLote.AsignarProductoKit.Kit.IdKit;
          kit = item.AsignarProductoLote.AsignarProductoKit.Kit.Descripcion;
        } else {
          codigo = item.AsignarProductoLote.ConfigurarProductos.Codigo;
          nombreProducto =
            item.AsignarProductoLote.ConfigurarProductos.Producto.Nombre;
          presentacion =
            item.AsignarProductoLote.ConfigurarProductos.Presentacion
              .Descripcion;
          contenido =
            item.AsignarProductoLote.ConfigurarProductos.CantidadMedida +
            " " +
            item.AsignarProductoLote.ConfigurarProductos.Medida.Descripcion;
        }
        if (item.PorcentajeDescuento) {
          porcentajeDescuento = item.PorcentajeDescuento;
          descuento = item.CantidadDescontada;
        } else {
          porcentajeDescuento = "0";
          descuento = "0";
        }
        var producto = {
          IdCabeceraFactura: item.IdCabeceraFactura,
          IdDetalleVenta: item.IdDetalleVenta,
          Codigo: codigo,
          Cantidad: item.Cantidad,
          Producto: nombreProducto,
          Presentacion: presentacion,
          Contenido: contenido,
          IdLote: idLote,
          Lote: lote,
          FechaExpiracion: fechaExpiracion,
          IdKit: idKit,
          Kit: kit,
          Descuento: descuento,
          ValorUnidad: item.ValorUnitario,
          Total: item.Total,
          Subtotal: item.Subtotal,
          PerteneceKitCompleto: perteneceKitCompleto,
          PorcentajeDescuento: porcentajeDescuento,
          Iva: item.IvaAnadido,
        };
        detalleVenta.push(producto);
      });
      this.detalleVenta.data = detalleVenta;
      this.detalleVenta.paginator = this.paginator;
    }
  }

  async quitarDetalleFactura(detalleFactura) {
    var respuesta: any;
    if (detalleFactura.PerteneceKitCompleto) {
      respuesta = await this.ventaService.quitarDetalleVentaPorKit(
        detalleFactura.IdCabeceraFactura,
        detalleFactura.IdKit
      );
      console.log(respuesta);
      if (respuesta["codigo"] == "200") {
        this.consultarDetalleFactura();
      } else if (respuesta["codigo"] == "201") {
        this.openSnackBar("Factura eliminada");
        this.consultarFacturas();
        this.myForm.reset();
        this.detalleVenta.data = [];
      }
    } else {
      respuesta = await this.ventaService.quitarDetalleFactura(
        detalleFactura.IdDetalleVenta
      );
      if (respuesta["codigo"] == "200") {
        this.consultarDetalleFactura();
      } else if (respuesta["codigo"] == "201") {
        this.openSnackBar("Factura eliminada");
        this.consultarFacturas();
        this.myForm.reset();
        this.detalleVenta.data = [];
      }
    }
  }

  async modificarCantidadDeProductoEnDetalle(event, idDetalleVenta, cantidad) {
    if (event.key == "Enter") {
      if (event.target.value <= 0) {
        event.target.value = cantidad;
      } else {
        await this.ventaService.modificarCantidadDeProductoEnDetalleVenta(
          idDetalleVenta,
          event.target.value
        );
      }
    }
  }

  validarFecha() {
    if (this.myForm.get("_fechaFinalCredito").value) {
      var fechaFinalCredito: any = new Date(
        this.myForm.get("_fechaFinalCredito").value
      );
    } else {
      return (fechaFinalCredito = "");
    }
    var fechaActual = new Date();
    if (fechaFinalCredito.getFullYear() < fechaActual.getFullYear()) {
      fechaFinalCredito = "";
    } else {
      fechaFinalCredito = fechaFinalCredito.toJSON().split("T")[0];
      return fechaFinalCredito;
    }
  }

  async crearConfiguracionVenta() {
    if (this.myForm.get("_nombres").value) {
      if (this.pago == "Crédito" && this.comunidades.length == 0) {
        this.openDialog("Necesitas lugar(es) de sembrío");
      } else {
        var respuesta = await this.ventaService.crearConfiguracionVenta(
          this.myForm.get("_idCabecera").value,
          this.myForm.get("_idPersona").value,
          this.siSePagaACredito ? "1" : "0",
          this.validarFecha(),
          this.myForm.get("_aplicaSeguro").value ? "1" : "0"
        );
        if (respuesta["codigo"] == "200") {
          this.realizarVenta();
        }
      }
    } else {
      this.openDialog("Necesitas un cliente");
    }
  }

  async realizarVenta() {
    var respuesta = await this.facturaService.finalizarFactura(
      this.myForm.get("_idCabecera").value,
      "Factura/FinalizarCabeceraFacturaVenta"
    );
    if (respuesta["codigo"] == "200") {
      this.openDialog("Venta realizada con éxito");
      this.consultarFacturas();
      this.myForm.reset();
      this.myForm.disable();
      this.detalleVenta.data = [];
      this.comunidades = [];
      this.pago = "Efectivo";
      this.selectTipoPago = true;
      this.buttonSeleccionarComunidad = true;
      this.buttonGenerarFactura = false;
    }
  }

  seleccionarComunidad() {
    let dialogRef = this.modalLocalidadSuperior.open(
      ModalLocalidadSuperiorComponent,
      {
        width: "400px",
        height: "auto",
        data: {
          ruta: "ventas",
        },
      }
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result != null) {
        var respuesta = await this.ventaService.asignarComunidadFactura(
          this.myForm.get("_idCabecera").value,
          result.idLocalidad
        );
        if (respuesta["codigo"] == "200") {
          this.comunidades.push({
            _id: result.idLocalidad,
            idAsignarComunidadFactura:
              respuesta["respuesta"].IdAsignarComunidadFactura,
            name: result.descripcion,
          });
        }
      }
    });
  }

  async quitarAsignacionComunidadFactura(idAsignarComunidadFactura) {
    var respuesta = await this.ventaService.quitarAsignacionComunidadFactura(
      idAsignarComunidadFactura
    );
    if (respuesta["codigo"] == "200") {
      var comunidad = this.comunidades.find(
        (comunidad) =>
          comunidad["idAsignarComunidadFactura"] == idAsignarComunidadFactura
      );
      var index = this.comunidades.indexOf(comunidad);
      this.comunidades.splice(index, 1);
    }
  }

  mostrarDetallesFactura(factura) {
    this.selectedTab = 0;
    this.myForm.reset();
    this.myForm.enable();
    this.myForm.get("_checkedDescuento").disable();
    this.myForm.get("_idCabecera").setValue(factura.IdCabeceraFactura);
    this.myForm.get("_cabecera").setValue(factura.Codigo);
    this.myForm
      .get("_fechaFactura")
      .setValue(new Date(factura.FechaGeneracion).toJSON().split("T")[0]);
    this.buttonRealizarVenta = false;
    this.buttonSeleccionarProducto = false;
    this.buttonSeleccionarComunidad = false;
    this.buttonSeleccionarPersona = false;
    this.selectTipoCompra = false;
    this.buttonGenerarFactura = false;
    this.selectTipoPago = false;
    this.listarComunidadesPorFactura();
    this.consultarDetalleFactura();
  }

  async listarComunidadesPorFactura() {
    var respuesta = await this.ventaService.listarComunidadesPorFactura(
      this.myForm.get("_idCabecera").value
    );
    if (respuesta["codigo"] == "200") {
      respuesta["respuesta"].map((item) => {
        this.comunidades.push({
          _id: item.Comunidad.IdComunidad,
          idAsignarComunidadFactura: item.IdAsignarComunidadFactura,
          name: item.Comunidad.Descripcion,
        });
      });
    }
  }

  async consultarFacturas() {
    var facturasNoFinalizadas = await this.facturaService.consultarFacturas(
      "Factura/FacturasNoFinalizadasVenta"
    );
    var facturasFinalizadas = await this.facturaService.consultarFacturas(
      "Factura/ListaFacturasFinalizadasVenta"
    );
    if (facturasNoFinalizadas["codigo"] == "200") {
      this.facturasNoFinalizadas.data = facturasNoFinalizadas["respuesta"];
      this.facturasNoFinalizadas.paginator = this.fnf_paginator;
    }
    if (facturasFinalizadas["codigo"] == "200") {
      this.facturasFinalizadas.data = facturasFinalizadas["respuesta"];
      this.facturasFinalizadas.paginator = this.ff_paginator;
    }
  }

  limpiarCampos() {
    this.myForm.get("_producto").reset();
    this.myForm.get("_cantidad").reset();
    this.myForm.get("_idAsignarProductoLote").reset();
    this.myForm.get("_kit").reset();
    this.myForm.get("_checkedDescuento").reset();
    this.myForm.get("_precio").reset();
    this.myForm.get("_disponible").reset();
    this.myForm.get("_descuento").reset();
  }

  ngOnInit() {
    this.consultarTipoTransaccion();
    this.consultarFacturas();
    this.myForm.disable();
    this.myForm.reset();
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
    "iva",
    "porcentajeDescuento",
    "descuento",
    "Subtotal",
    "total",
    "acciones",
  ];
  tablaFacturasNoFinalidas = ["codigo", "usuario", "fecha", "acciones"];
  tablaFacturasFinalidas = ["codigo", "usuario", "fecha", "acciones"];
}
