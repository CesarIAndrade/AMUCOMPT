import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { MatDialog } from "@angular/material/dialog";

// Components
import { ModalAsignacionUsuarioPersonaComponent } from "../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component";
import { ModalAsignacionConfiguracionProductoComponent } from "../modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component";
import { ModalLocalidadSuperiorComponent } from "../modal-localidad-superior/modal-localidad-superior.component";

// Services
import { InventarioService } from "src/app/services/inventario.service";
import { FacturaService } from "src/app/services/factura.service";
import { VentaService } from "src/app/services/venta.service";

@Component({
  selector: "app-venta",
  templateUrl: "./venta.component.html",
  styleUrls: ["./venta.component.css"],
})
export class VentaComponent implements OnInit {
  myForm: FormGroup;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  comunidades: any[] = [];

  quitarAsignacionComunidadFactura(comunidad) {
    this.ventaService
      .quitarAsignacionComunidadFactura(
        comunidad._idAsignarComunidadFactura,
        localStorage.getItem("miCuenta.deleteToken")
      )
      .then((ok) => {
        if (ok["respuesta"]) {
          const index = this.comunidades.indexOf(comunidad);
          if (index >= 0) {
            this.comunidades.splice(index, 1);
          }
        } else {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "error",
          });
        }
      })
      .catch((error) => console.log(error));
  }

  constructor(
    private modalAsignacionUsuarioPersona: MatDialog,
    private modalAsignacionConfiguracionProducto: MatDialog,
    private inventarioService: InventarioService,
    private ventaService: VentaService,
    private facturaService: FacturaService,
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
      _idAsignarProductoLote: new FormControl(""),
      _kit: new FormControl(""),
      _checkedDescuento: new FormControl(false),
      _disponible: new FormControl(""),
      _descuento: new FormControl(""),
      _fechaFinalCredito: new FormControl(""),
      _aplicaSeguro: new FormControl(false),
      _valorSeguro: new FormControl(""),
      _seguroCancelado: new FormControl(false),
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
  tipoPago: any[] = [{ tipo: "Efectivo" }, { tipo: "Crédito" }];
  permitirAnadir: any;

  selected = "Producto";
  pago = "Efectivo";

  totalDescontado: string;
  subTotalFactura: string;
  totalFactura: string;
  totalIva: string;

  seccionKit = true;
  aplicaDescuento = true;
  buttonSeleccionarProducto = true;
  selectTipoCompra = true;
  selectTipoPago = true;
  buttonSeleccionarPersona = true;
  buttonSeleccionarComunidad = true;
  buttonGenerarFactura = false;
  buttonRealizarVenta = true;
  inputDescuento = true;
  siSePagaACredito = true;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild("fnf_paginator", { static: false }) fnf_paginator: MatPaginator;
  @ViewChild("ff_paginator", { static: false }) ff_paginator: MatPaginator;
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

  selecionarTipoPago(tipoPago) {
    if (tipoPago.value == "Efectivo") {
      this.siSePagaACredito = true;
      this.myForm.get("_aplicaSeguro").setValue(false);
      this.myForm.get("_aplicaSeguro").enable();
      this.myForm.get("_valorSeguro").clearValidators();
      this.myForm.get("_fechaFinalCredito").clearValidators();
      this.myForm.get("_valorSeguro").updateValueAndValidity();
      this.myForm.get("_fechaFinalCredito").updateValueAndValidity();
    } else {
      this.siSePagaACredito = false;
      this.myForm.get("_aplicaSeguro").setValue(true);
      this.myForm.get("_aplicaSeguro").disable();
      this.myForm.get("_valorSeguro").setValidators([Validators.required]);
      this.myForm
        .get("_fechaFinalCredito")
        .setValidators([Validators.required]);
      this.myForm.get("_valorSeguro").updateValueAndValidity();
      this.myForm.get("_fechaFinalCredito").updateValueAndValidity();
    }
    this.myForm.get("_fechaFinalCredito").reset();
    this.myForm.get("_valorSeguro").reset();
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
        this.permitirAnadir = ok["respuesta"][0]["PermitirAnadir"];
        this.buttonSeleccionarProducto = true;
      })
      .catch((error) => console.log(error))
      .finally(() => (this.buttonSeleccionarProducto = false));
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
        this.myForm.get("_cedula").setValue(result.cedula);
        this.myForm.get("_idPersona").setValue(result.idPersona);
        var nombres = result.nombres + " " + result.apellidos;
        this.myForm.get("_nombres").setValue(nombres);
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
          idCabeceraFactura: this.myForm.get("_idCabecera").value,
          permitirAnadir: this.permitirAnadir,
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (result.Kit != "") {
          this.aplicaDescuento = false;
          this.myForm.get("_kit").setValue(result.Kit);
          this.myForm.get("_descuento").setValue(result.Porcentaje);
        } else {
          this.aplicaDescuento = true;
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
      } else {
        this.consultarDetalleFactura();
      }
    });
  }

  aplicarDescuento(event) {
    event.checked
      ? (this.inputDescuento = false)
      : (this.inputDescuento = true);
  }

  consultarTipoTransaccion() {
    this.facturaService
      .consultarTipoTransaccion(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        if (this.router.url === "/ventas") {
          ok["respuesta"].map((item) => {
            if (item.Descripcion == "VENTA") {
              this.myForm
                .get("_tipoTransaccion")
                .setValue(item.IdTipoTransaccion);
            }
          });
        }
      })
      .catch((error) => console.log(error));
  }

  validarFormulario() {
    this.crearDetalleVenta();
  }

  crearCabeceraFactura() {
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
        } else if (ok["respuesta"]) {
          this.myForm
            .get("_idCabecera")
            .setValue(ok["respuesta"].IdCabeceraFactura);
          this.myForm.get("_cabecera").setValue(ok["respuesta"].Codigo);
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
      .catch((error) => console.log(error))
      .finally(() => {
        this.buttonGenerarFactura = true;
        this.buttonSeleccionarPersona = false;
        this.buttonSeleccionarProducto = false;
        this.buttonSeleccionarComunidad = false;
        this.selectTipoCompra = false;
        this.selectTipoPago = false;
        this.myForm.enable();
        this.myForm.get("_checkedDescuento").disable();
      });
  }

  crearDetalleVenta() {
    this.ventaService
      .crearDetalleFactura(
        this.myForm.get("_idCabecera").value,
        this.myForm.get("_idAsignarProductoLote").value,
        this.myForm.get("_checkedDescuento").value ? "1" : "0",
        "0",
        this.myForm.get("_cantidad").value,
        this.myForm.get("_descuento").value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == "true") {
          this.buttonRealizarVenta = false;
          this.aplicaDescuento = true;
          this.seccionKit = true;
          this.selected = "Producto";
          this.limpiarCampos();
        }
        if (ok["respuesta"] == "false") {
          sweetAlert(ok["respuesta"], {
            icon: "error",
          });
        }
        if (ok["respuesta"] != "true" && ok["respuesta"] != "false") {
          sweetAlert(ok["respuesta"], {
            icon: "error",
          });
        }
      })
      .catch((error) => console.log(error))
      .finally(() => this.consultarDetalleFactura());
  }

  consultarPrecioDeUnProducto() {
    this.inventarioService
      .buscarPrecioDeUnProducto(
        this.myForm.get("_idAsignarProductoLote").value,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => this.myForm.get("_precio").setValue(ok["respuesta"].Precio))
      .catch((error) => console.log(error));
  }

  realizarVenta() {
    const url = "Factura/FinalizarCabeceraFacturaVenta";
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
          this.myForm.disable();
          this.myForm.get("_tipoTransaccion").setValue(tipoTransaccion);
          this.comunidades = [];
          this.selectTipoPago = true;
          this.pago = "Efectivo";
          this.buttonSeleccionarComunidad = true;
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
        this.detalleVenta.data = [];
        this.buttonGenerarFactura = false;
      });
  }

  validarFecha() {
    var fechaFinalCredito: any = new Date(
      this.myForm.get("_fechaFinalCredito").value
    );
    var fechaActual = new Date();
    try {
      if (fechaFinalCredito.getFullYear() < fechaActual.getFullYear()) {
        fechaFinalCredito = null;
      } else {
        fechaFinalCredito = fechaFinalCredito.toJSON();
        fechaFinalCredito = fechaFinalCredito.split("T")[0];
        return fechaFinalCredito;
      }
    } catch {
      return (fechaFinalCredito = null);
    }
  }

  crearConfiguracionVenta() {
    var efectivo: any;
    this.siSePagaACredito ? (efectivo = "1") : (efectivo = "0");
    if (this.myForm.valid) {
      this.ventaService
        .crearConfiguracionVenta(
          this.myForm.get("_idCabecera").value,
          this.myForm.get("_idPersona").value,
          efectivo,
          this.validarFecha(),
          this.myForm.get("_aplicaSeguro").value ? "1" : "0",
          this.myForm.get("_valorSeguro").value,
          this.myForm.get("_seguroCancelado").value ? "1" : "0",
          localStorage.getItem("miCuenta.postToken")
        )
        .then((ok) => this.realizarVenta())
        .catch((error) => console.log(error));
    }
  }

  consultarDetalleFactura() {
    this.ventaService
      .consultarDetalleFactura(
        this.myForm.get("_idCabecera").value,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        var codigo = "";
        var idLote = "";
        var lote = "";
        var idKit = "";
        var kit = "";
        var nombreProducto = "";
        var presentacion = "";
        var descuento = "0";
        var porcentajeDescuento = "0";
        var perteneceKitCompleto = false;
        var detalleVenta = [];
        this.subTotalFactura = ok["respuesta"].Subtotal;
        this.totalDescontado = ok["respuesta"].TotalDescuento;
        this.totalIva = ok["respuesta"].TotalIva;
        this.totalFactura = ok["respuesta"].Total;
        ok["respuesta"].DetalleVenta.map((item) => {
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
              item.AsignarProductoLote.AsignarProductoKit.ListaProductos
                .Producto.Nombre;
            presentacion =
              item.AsignarProductoLote.AsignarProductoKit.ListaProductos
                .Presentacion.Descripcion +
              " " +
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
                .Descripcion +
              " " +
              item.AsignarProductoLote.ConfigurarProductos.CantidadMedida +
              " " +
              item.AsignarProductoLote.ConfigurarProductos.Medida.Descripcion;
          }
          if (item.PorcentajeDescuento) {
            porcentajeDescuento = item.PorcentajeDescuento;
            descuento = item.CantidadDescontada;
          }
          var producto = {
            IdCabeceraFactura: item.IdCabeceraFactura,
            IdDetalleVenta: item.IdDetalleVenta,
            Codigo: codigo,
            Cantidad: item.Cantidad,
            Producto: nombreProducto,
            Presentacion: presentacion,
            IdLote: idLote,
            Lote: lote,
            FechaExpiracion: item.AsignarProductoLote.FechaExpiracion,
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
      })
      .catch((error) => console.log(error));
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
              sweetAlert("Ha ocurrido un error!", {
                icon: "error",
              });
            }
            if (ok["respuesta"] != "true" && ok["respuesta"] != "false") {
              event.target.value = cantidadAntigua;
              sweetAlert(ok["respuesta"], {
                icon: "error",
              });
            }
          })
          .catch((error) => console.log(error));
      }
    }
  }

  quitarDetalleFactura(detalleFactura) {
    if (detalleFactura.PerteneceKitCompleto) {
      this.ventaService
        .quitarDetalleVentaPorKit(
          detalleFactura.IdCabeceraFactura,
          detalleFactura.IdKit,
          localStorage.getItem("miCuenta.deleteToken")
        )
        .then((ok) => {
          if (ok["respuesta"]) {
            this.consultarDetalleFactura();
          }
        });
    } else {
      this.ventaService
        .quitarDetalleFactura(
          detalleFactura.IdDetalleVenta,
          localStorage.getItem("miCuenta.deleteToken")
        )
        .then((ok) => {
          if (ok["respuesta"] == "0") {
            this.myForm.get("_idCabecera").setValue("");
            this.myForm.reset();
            this.detalleVenta.data = [];
          } else {
            this.consultarDetalleFactura();
          }
        })
        .catch((error) => console.log(error))
        .finally(() => this.consultarFacturasNoFinalizadas());
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
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.ventaService
          .asignarComunidadFactura(
            this.myForm.get("_idCabecera").value,
            result.idLocalidad,
            localStorage.getItem("miCuenta.postToken")
          )
          .then((ok) => {
            try {
              this.comunidades.push({
                _id: result.idLocalidad,
                _idAsignarComunidadFactura:
                  ok["respuesta"].IdAsignarComunidadFactura,
                name: result.descripcion,
              });
            } catch (error) {
              sweetAlert("Comunidad ya existe", {
                icon: "error",
              });
            }
          })
          .catch((error) => console.log(error));
      }
    });
  }

  consultarFacturasNoFinalizadas() {
    const url = "Factura/FacturasNoFinalizadasVenta";
    this.facturaService
      .consultarFacturasNoFinalizadas(
        url,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        this.facturasNoFinalizadas.data = [];
        this.facturasNoFinalizadas.data = ok["respuesta"];
        this.facturasNoFinalizadas.paginator = this.fnf_paginator;
      })
      .catch((error) => console.log(error))
      .finally(() => this.consultarFacturasFinalizadas());
  }

  mostrarDetallesFactura(factura) {
    this.myForm.reset();
    this.buttonRealizarVenta = false;
    this.myForm.get("_idCabecera").setValue(factura.IdCabeceraFactura);
    this.listarComunidadesPorFactura();
    this.consultarDetalleFactura();
    this.myForm.get("_cabecera").setValue(factura.Codigo);
    this.myForm.enable();
    this.myForm.get("_checkedDescuento").disable();
    this.buttonSeleccionarProducto = false;
    this.buttonSeleccionarComunidad = false;
    this.buttonSeleccionarPersona = false;
    this.selectTipoCompra = false;
    this.buttonGenerarFactura = false;
    this.selectTipoPago = false;
    var fecha = new Date(factura.FechaGeneracion);
    var dia = this.dias[fecha.getDay()];
    var mes = this.meses[fecha.getMonth()];
    this.myForm
      .get("_fechaActual")
      .setValue(
        dia + ", " + fecha.getDate() + " " + mes + " " + fecha.getFullYear()
      );
  }

  consultarFacturasFinalizadas() {
    const url = "Factura/ListaFacturasFinalizadasVenta";
    this.facturaService
      .consultarFacturasFinalizadas(
        url,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        this.facturasFinalizadas.data = [];
        this.facturasFinalizadas.data = ok["respuesta"];
        this.facturasFinalizadas.paginator = this.ff_paginator;
      })
      .catch((error) => console.log(error));
  }

  listarComunidadesPorFactura() {
    this.ventaService
      .listarComunidadesPorFactura(
        this.myForm.get("_idCabecera").value,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        ok["respuesta"].map((item) => {
          this.comunidades.push({
            _id: item.Comunidad.IdComunidad,
            _idAsignarComunidadFactura: item.IdAsignarComunidadFactura,
            name: item.Comunidad.Descripcion,
          });
        });
      })
      .catch((error) => console.log(error));
  }

  ngOnInit() {
    this.consultarTipoTransaccion();
    this.consultarFacturasNoFinalizadas();
    this.consultarFacturasFinalizadas();
    this.myForm.disable();
  }

  tablaDetalleCompra = [
    "codigo",
    "descripcion",
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
