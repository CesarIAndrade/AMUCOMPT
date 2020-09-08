import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { openDialog } from "../../functions/global";
// Material
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatPaginator, MatTableDataSource } from "@angular/material";

// Services
import { VentaService } from "src/app/services/venta.service";
import { InventarioService } from "src/app/services/inventario.service";

@Component({
  selector: "app-modal-asignacion-configuracion-producto",
  templateUrl: "./modal-asignacion-configuracion-producto.component.html",
  styleUrls: ["./modal-asignacion-configuracion-producto.component.css"],
})
export class ModalAsignacionConfiguracionProductoComponent implements OnInit {
  constructor(
    private inventarioService: InventarioService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ventaService: VentaService,
    private modalAsignacionConfiguracionProducto: MatDialogRef<
      ModalAsignacionConfiguracionProductoComponent
    >,
    private router: Router,
    private dialog: MatDialog
  ) {}

  filterDetalle = "";
  nombreKit = "";
  idKit = "";
  cantidad = "";
  idCabeceraFactura = "";
  kitCompleto = true;
  buttonComprarKitCompleto = false;
  permitirAnadir = true;

  producto = {
    IdRelacionLogica: "",
    PerteneceKit: "",
    IdKit: "",
    Kit: "",
    Producto: "",
    Presentacion: "",
    ContenidoNeto: "",
    Medida: "",
    IdAsignarProductoLote: "",
    IdLote: "",
    Lote: "",
    Codigo: "",
    FechaExpiracion: "",
    Porcentaje: "",
    Disponible: "",
    flag: false,
  };

  loading = true;

  // Para la paginacion
  @ViewChild("paginator", { static: true }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<Element[]>();

  agregarDetalle(producto) {
    if (this.router.url == "/dash/compras") {
      this.agregarDetalleParaCompra(producto);
    } else if (this.router.url == "/dash/ventas") {
      this.agregarDetalleParaVenta(producto);
    }
  }

  agregarDetalleParaCompra(producto) {
    this.producto.IdRelacionLogica = producto.IdRelacionLogica;
    this.producto.PerteneceKit = producto.PerteneceKit;
    this.producto.IdKit = producto.IdKit;
    this.producto.Kit = producto.Kit;
    this.producto.Producto = producto.Producto;
    this.producto.Presentacion = producto.Presentacion;
    this.producto.ContenidoNeto = producto.ContenidoNeto;
    this.producto.Medida = producto.Medida;
    this.modalAsignacionConfiguracionProducto.close(this.producto);
  }

  agregarDetalleParaVenta(producto) {
    this.producto.IdAsignarProductoLote = producto.IdAsignarProductoLote;
    this.producto.Kit = producto.Kit;
    this.producto.Producto = producto.Producto;
    this.producto.Presentacion = producto.Presentacion;
    this.producto.ContenidoNeto = producto.ContenidoNeto;
    this.producto.Medida = producto.Medida;
    this.producto.Porcentaje = producto.Porcentaje;
    this.producto.Disponible = producto.Disponible;
    this.modalAsignacionConfiguracionProducto.close(this.producto);
  }

  async consultarConfiguracionProducto() {
    this.tabla = [
      "codigo",
      "descripcion",
      "contenidoNeto",
      "medida",
      "acciones",
    ]
    var respuesta = await this.inventarioService.consultarConfiguracionProductoTodos();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var configuracionProductos: any = [];
      respuesta["respuesta"].map((item) => {
        configuracionProductos.push({
          Codigo: item.Codigo,
          IdRelacionLogica: item.IdConfigurarProducto,
          PerteneceKit: "False",
          IdKit: "",
          Kit: "",
          Producto: item.Producto.Nombre,
          Presentacion: item.Presentacion.Descripcion,
          ContenidoNeto: item.CantidadMedida,
          Medida: item.Medida.Descripcion
        });
      });
      this.dataSource.data = configuracionProductos;
      this.dataSource.paginator = this.paginator;
    }
  }

  async consultarStock() {
    this.tabla = [
      "codigo",
      "kit",
      "descripcion",
      "contenidoNeto",
      "medida",
      "lote",
      "fechaExpiracion",
      "disponible",
      "acciones",
    ];
    var respuesta = await this.inventarioService.consultarStock();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var listaProductosEnStock = [];
      respuesta["respuesta"].map((item) => {
        var lote = "N/A";
        var idLote = "";
        var kit = "N/A";
        var idKit = "";
        var fechaExpiracion: any = "";
        var nombreProducto = "";
        var presentacion = "";
        var contenidoNeto = "";
        var medida = "";
        var codigo = "";
        var porcentaje = "";
        if (item.AsignarProductoLote.Lote) {
          lote = item.AsignarProductoLote.Lote.Codigo;
          idLote = item.AsignarProductoLote.Lote.IdLote;
          fechaExpiracion = item.AsignarProductoLote.Lote.FechaExpiracion;
        } else {
          fechaExpiracion = item.AsignarProductoLote.FechaExpiracion;
        }
        if (item.AsignarProductoLote.PerteneceKit != "False") {
          kit = item.AsignarProductoLote.AsignarProductoKit.Kit.Descripcion;
          idKit = item.AsignarProductoLote.AsignarProductoKit.Kit.IdKit;
          nombreProducto =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Producto
              .Nombre;
          contenidoNeto =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos
              .CantidadMedida;
          medida =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Medida
              .Descripcion;
          codigo =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Codigo;
          porcentaje =
            item.AsignarProductoLote.AsignarProductoKit.Kit.AsignarDescuentoKit
              .Descuento.Porcentaje;
          presentacion =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos
              .Presentacion.Descripcion;
        } else {
          nombreProducto =
            item.AsignarProductoLote.ConfigurarProductos.Producto.Nombre;
          contenidoNeto =
            item.AsignarProductoLote.ConfigurarProductos.CantidadMedida;
          medida =
            item.AsignarProductoLote.ConfigurarProductos.Medida.Descripcion;
          codigo = item.AsignarProductoLote.ConfigurarProductos.Codigo;
          presentacion =
            item.AsignarProductoLote.ConfigurarProductos.Presentacion
              .Descripcion;
        }
        var producto = {
          Codigo: codigo,
          IdAsignarProductoLote: item.AsignarProductoLote.IdAsignarProductoLote,
          IdKit: idKit,
          Kit: kit,
          IdLote: idLote,
          Lote: lote,
          FechaExpiracion: fechaExpiracion,
          Disponible: item.Cantidad,
          Producto: nombreProducto,
          Presentacion: presentacion,
          ContenidoNeto: contenidoNeto,
          Medida: medida,
          Porcentaje: porcentaje,
          Precio: item.AsignarProductoLote.ValorUnitario,
        };
        if (producto.Disponible != 0) {
          listaProductosEnStock.push(producto);
        }
      });
      this.dataSource.data = listaProductosEnStock;
      this.dataSource.paginator = this.paginator;
    }
  }

  async cerrarModal() {
    var respuesta = await this.ventaService.ingresoDetalleVentaPorKit(
      this.idCabeceraFactura,
      this.idKit,
      this.cantidad
    );
    if (respuesta["codigo"] == "200") {
      this.modalAsignacionConfiguracionProducto.close({ flag: true });
      this.buttonComprarKitCompleto = true;
    } else if (respuesta["codigo"] == "500") {
      openDialog(respuesta["mensaje"], "advertencia", this.dialog);
    }
  }

  siElKitVieneDeCompra(listaProductos) {
    this.tabla = [
      "codigo",
      "descripcion",
      "contenidoNeto",
      "medida",
      "acciones",
    ]
    this.loading = false;
    var configuracionProductos = [];
    listaProductos.map((item) => {
      configuracionProductos.push({
        Codigo: item.ListaProductos.Codigo,
        IdRelacionLogica: item.IdAsignarProductoKit,
        PerteneceKit: "True",
        IdKit: item.Kit.IdKit,
        Kit: item.Kit.Descripcion,
        Producto: item.ListaProductos.Producto.Nombre,
        Presentacion: item.ListaProductos.Presentacion.Descripcion,
        ContenidoNeto: item.ListaProductos.CantidadMedida,
        Medida: item.ListaProductos.Medida.Descripcion
      });
    });
    this.dataSource.data = configuracionProductos;
    this.dataSource.paginator = this.paginator;
  }

  siElKitVieneDeVenta(listaProductos) {
    this.tabla = [
      "codigo",
      "descripcion",
      "contenidoNeto",
      "medida",
      "cantidad",
      "disponible",
    ]
    this.loading = false;
    var listaProductosDeUnKit = [];
    listaProductos.map((item) => {
      var lote = "N/A";
      var idLote = "";
      var fechaExpiracion = "";
      var cantidad = "0";
      if (item.Stock) {
        if (item.Stock.AsignarProductoLote.Lote) {
          lote = item.Stock.AsignarProductoLote.Lote.Codigo;
          idLote = item.Stock.AsignarProductoLote.Lote.IdLote;
          fechaExpiracion = item.Stock.AsignarProductoLote.Lote.FechaExpiracion;
        } else {
          fechaExpiracion = item.Stock.AsignarProductoLote.FechaExpiracion;
        }
        cantidad = item.Stock.Cantidad;
      }      
      var producto = {
        IdKit: item.Kit.IdKit,
        Kit: item.Kit.Descripcion,
        Codigo: item.ListaProductos.Codigo,
        Producto: item.ListaProductos.Producto.Nombre,
        ContenidoNeto: item.ListaProductos.CantidadMedida,
        Medida: item.ListaProductos.Medida.Descripcion,
        IdLote: idLote,
        Lote: lote,
        FechaExpiracion: fechaExpiracion,
        Disponible: cantidad,
        Cantidad: item.Cantidad
      };
      listaProductosDeUnKit.push(producto);
    });
    this.dataSource.data = listaProductosDeUnKit;
    this.dataSource.paginator = this.paginator;
  }

  estructurarProductosDeUnKit(listaProductos, ruta?) {
    if (ruta == "compra") {
      this.siElKitVieneDeCompra(listaProductos);
    } else if (ruta == "venta") {
      this.siElKitVieneDeVenta(listaProductos);
    }
  }

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase();
    this.dataSource.filter = term;
  }

  ngOnInit() {
    if (this.router.url == "/dash/ventas") {
      if (this.data.listaProductosDeUnKit.length == 0) {
        this.consultarStock();
      } else {
        this.idCabeceraFactura = this.data.idCabeceraFactura;
        try {
          this.nombreKit = this.data.listaProductosDeUnKit[0].Kit.Descripcion;
          this.idKit = this.data.listaProductosDeUnKit[0].Kit.IdKit;
        } catch (error) {}
        if (this.data.permitirAnadir) {
          this.permitirAnadir = false;
        } else {
          this.permitirAnadir = true;
        }
        this.estructurarProductosDeUnKit(
          this.data.listaProductosDeUnKit,
          "venta"
        );
      }
    } else if (this.router.url == "/dash/compras") {
      try {
        this.nombreKit = this.data.listaProductosDeUnKit[0].Kit.Descripcion;
        this.idKit = this.data.listaProductosDeUnKit[0].Kit.IdKit;
      } catch (error) {}
      if (this.data.listaProductosDeUnKit.length != 0) {
        this.estructurarProductosDeUnKit(
          this.data.listaProductosDeUnKit,
          "compra"
        );
      } else {
        this.consultarConfiguracionProducto();
      }
    }
  }

  tabla = [];
}
