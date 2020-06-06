import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { InventarioService } from "src/app/services/inventario.service";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { VentaService } from "src/app/services/venta.service";
import { MatPaginator, MatTableDataSource } from "@angular/material";

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
    private modalAsignacionConfiguracionProducto: MatDialog,
    private router: Router
  ) {}

  filterDetalle = "";
  nombreKit = "";
  idKit = "";
  cantidad = "";
  idCabeceraFactura = "";
  areaTablaConfiguracionProducto = true;
  areaTablaStock = true;
  areaTablaProductoDeUnKit = true;
  kitCompleto = true;
  buttonComprarKitCompleto = false;
  permitirAnadir: boolean;

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
  };

  // Para la paginacion
  @ViewChild("paginator1", { static: false }) paginator1: MatPaginator;
  @ViewChild("paginator2", { static: false }) paginator2: MatPaginator;
  @ViewChild("paginator3", { static: false }) paginator3: MatPaginator;
  listaProductosEnStock = new MatTableDataSource<Element[]>();
  configuracionProductos = new MatTableDataSource<Element[]>();
  listaProductosDeUnKit = new MatTableDataSource<Element[]>();

  async consultarConfiguracionProducto() {
    var respuesta = await this.inventarioService.consultarConfiguracionProductoTodos();
    if (respuesta["codigo"] == "200") {
      var configuracionProductos: any = [];
      respuesta["respuesta"].map((item) => {
        configuracionProductos.push({
          IdRelacionLogica: item.IdConfigurarProducto,
          PerteneceKit: "False",
          IdKit: "",
          Kit: "",
          Producto: item.Producto.Nombre,
          Presentacion: item.Presentacion.Descripcion,
          ContenidoNeto: item.CantidadMedida,
          Medida: item.Medida.Descripcion,
        });
      });
      this.configuracionProductos.data = configuracionProductos;
      this.configuracionProductos.paginator = this.paginator1;
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
  }

  async consultarStock() {
    var respuesta = await this.inventarioService.consultarStock();
    var listaProductosEnStock = [];
    if (respuesta["codigo"] == "200") {
      respuesta["respuesta"].map((item) => {
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
          porcentaje = "";
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
      this.listaProductosEnStock.data = listaProductosEnStock;
      this.listaProductosEnStock.paginator = this.paginator2;
    }
  }

  async cerrarModal() {
    this.buttonComprarKitCompleto = true;
    var respuesta = await this.ventaService.ingresoDetalleVentaPorKit(
      this.idCabeceraFactura,
      this.idKit,
      this.cantidad
    );
    console.log(respuesta);

    // .then((ok) => {
    //   if (ok["respuesta"] == "true") {
    //     this.modalAsignacionConfiguracionProducto.closeAll();
    //   }
    // })
    // .catch((error) => console.log(error));
  }

  siElKitVieneDeCompra(listaProductos) {
    var configuracionProductos = [];
    listaProductos.map((item) => {
      configuracionProductos.push({
        IdRelacionLogica: item.IdAsignarProductoKit,
        PerteneceKit: "True",
        IdKit: item.Kit.IdKit,
        Kit: item.Kit.Descripcion,
        Producto: item.ListaProductos.Producto.Nombre,
        Presentacion: item.ListaProductos.Presentacion.Descripcion,
        ContenidoNeto: item.ListaProductos.CantidadMedida,
        Medida: item.ListaProductos.Medida.Descripcion,
      });
    });
    this.configuracionProductos.data = configuracionProductos;
    this.configuracionProductos.paginator = this.paginator1;
  }

  siElKitVieneDeVenta(listaProductos) {
    var listaProductosDeUnKit = [];
    listaProductos.map((item) => {
      var lote = "";
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
      };
      listaProductosDeUnKit.push(producto);
    });
    this.listaProductosDeUnKit.data = listaProductosDeUnKit;
    this.listaProductosDeUnKit.paginator = this.paginator3;
  }

  estructurarProductosDeUnKit(listaProductos, ruta?) {
    if (ruta == "compra") {
      this.siElKitVieneDeCompra(listaProductos);
    } else if (ruta == "venta") {
      this.siElKitVieneDeVenta(listaProductos);
    }
  }

  ngOnInit() {
    if (this.router.url == "/ventas") {
      if (this.data.listaProductosDeUnKit.length == 0) {
        this.areaTablaConfiguracionProducto = true;
        this.areaTablaProductoDeUnKit = true;
        this.areaTablaStock = false;
        this.consultarStock();
      } else {
        this.areaTablaConfiguracionProducto = true;
        this.areaTablaStock = true;
        this.areaTablaProductoDeUnKit = false;
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
    } else if (this.router.url == "/compras") {
      this.areaTablaProductoDeUnKit = true;
      this.areaTablaStock = true;
      this.areaTablaConfiguracionProducto = false;
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

  tablaConfiguracionProducto = [
    "descripcion",
    "presentacion",
    "contenidoNeto",
    "medida",
    "acciones",
  ];
  tablaStock = [
    "codigo",
    "kit",
    "descripcion",
    "presentacion",
    "lote",
    "fechaExpiracion",
    "Disponible",
    "acciones",
  ];
  tablaProductosDeUnKit = [
    "codigo",
    "descripcion",
    "presentacion",
    "lote",
    "fechaExpiracion",
    "Disponible",
  ];
}
