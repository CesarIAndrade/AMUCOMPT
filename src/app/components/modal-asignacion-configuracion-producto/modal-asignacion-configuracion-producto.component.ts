import { Component, OnInit, Inject } from "@angular/core";
import { InventarioService } from "src/app/services/inventario.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { VentaService } from 'src/app/services/venta.service';

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
    private router: Router
  ) {}

  filterDetalle = "";
  areaTablaConfiguracionProducto: boolean;
  areaTablaStock: boolean;
  areaTablaProductoDeUnKit: boolean;
  nombreKit = "";
  idKit = "";
  cantidad = "";
  idCabeceraFactura = "";

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

  listaProductosEnStock: any[] = [];
  configuracionProductos: any[] = [];
  listaProductosDeUnKit: any[] = [];

  consultarConfiguracionProducto() {
    this.inventarioService
      .consultarConfiguracionProductoTodos(
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        this.configuracionProductos = [];
        ok["respuesta"].map((item) => {
          var producto = {
            IdRelacionLogica: item.IdConfigurarProducto,
            PerteneceKit: "False",
            IdKit: "",
            Kit: "",
            Producto: item.Producto.Nombre,
            Presentacion: item.Presentacion.Descripcion,
            ContenidoNeto: item.CantidadMedida,
            Medida: item.Medida.Descripcion,
          };
          this.configuracionProductos.push(producto);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  agregarDetalleParaCompra(producto) {
    this.producto.IdRelacionLogica = producto.IdRelacionLogica;
    this.producto.PerteneceKit = producto.PerteneceKit;
    this.producto.IdKit = producto.IdKit;
    this.producto.Kit = producto.Kit;
    this.producto.Producto = producto.Nombre;
    this.producto.Presentacion = producto.Presentacion;
    this.producto.ContenidoNeto = producto.ContenidoNeto;
    this.producto.Medida = producto.Medida;
  }

  agregarDetalleParaVenta(producto) {
    this.producto.IdAsignarProductoLote = producto.IdAsignarProductoLote;
    this.producto.IdKit = producto.IdKit;
    this.producto.Kit = producto.Kit;
    this.producto.IdLote = producto.IdLote;
    this.producto.Lote = producto.Lote;
    this.producto.Codigo = producto.Codigo;
    this.producto.Producto = producto.Producto;
    this.producto.FechaExpiracion = producto.FechaExpiracion;
    this.producto.Presentacion = producto.Presentacion;
    this.producto.ContenidoNeto = producto.ContenidoNeto;
    this.producto.Medida = producto.Medida;
    this.producto.Porcentaje = producto.Porcentaje;
    this.producto.Disponible = producto.Cantidad;
  }

  validarSiPerteneceALote(producto) {
    var datosLote: any;
    try {
      datosLote = {
        IdLote: producto.AsignarProductoLote.IdLote,
        Lote: producto.AsignarProductoLote.Lote.Codigo,
        FechaExpiracion: producto.AsignarProductoLote.Lote.FechaExpiracion,
      };
    } catch (error) {
      datosLote = null;
    }
    return datosLote;
  }

  validarSiPerteneceAKit(producto) {
    var datosKit: any;
    try {
      datosKit = {
        IdKit: producto.AsignarProductoLote.AsignarProductoKits.IdKit,
        Kit: producto.AsignarProductoLote.AsignarProductoKits.Descripcion,
        IdProducto:
          producto.AsignarProductoLote.AsignarProductoKits
            .ListaAsignarProductoKit[0].ListaProductos.IdConfigurarProducto,
        Codigo:
          producto.AsignarProductoLote.AsignarProductoKits
            .ListaAsignarProductoKit[0].ListaProductos.Codigo,
        Producto:
          producto.AsignarProductoLote.AsignarProductoKits
            .ListaAsignarProductoKit[0].ListaProductos.Producto.Nombre,
        Presentacion:
          producto.AsignarProductoLote.AsignarProductoKits
            .ListaAsignarProductoKit[0].ListaProductos.Presentacion.Descripcion,
        ContenidoNeto:
          producto.AsignarProductoLote.AsignarProductoKits
            .ListaAsignarProductoKit[0].ListaProductos.CantidadMedida,
        Medida:
          producto.AsignarProductoLote.AsignarProductoKits
            .ListaAsignarProductoKit[0].ListaProductos.Medida.Descripcion,
      };
    } catch (error) {
      datosKit = null;
    }
    return datosKit;
  }

  estructurarSiPerteneceKit(producto) {
    var perteneceKit: any;
    var datosKit: any;
    perteneceKit = this.validarSiPerteneceAKit(producto);
    if (perteneceKit != null) {
      datosKit = {
        IdKit: perteneceKit.IdKit,
        Kit: perteneceKit.Kit,
        IdProducto: perteneceKit.IdProducto,
        Codigo: perteneceKit.Codigo,
        Producto: perteneceKit.Producto,
        Presentacion: perteneceKit.Presentacion,
        ContenidoNeto: perteneceKit.ContenidoNeto,
        Medida: perteneceKit.Medida,
        Porcentaje:
          producto.AsignarProductoLote.AsignarProductoKits
            .ListaAsignarProductoKit[0].Kit.AsignarDescuentoKit.Descuento
            .Porcentaje + "%",
      };
    } else {
      datosKit = {
        Codigo: producto.AsignarProductoLote.ConfigurarProductos.Codigo,
        IdKit: producto.AsignarProductoLote.AsignarProductoKits.IdKit,
        Kit: producto.AsignarProductoLote.AsignarProductoKits.Descripcion,
        IdProducto:
          producto.AsignarProductoLote.ConfigurarProductos.IdConfigurarProducto,
        Producto:
          producto.AsignarProductoLote.ConfigurarProductos.Producto.Nombre,
        Presentacion:
          producto.AsignarProductoLote.ConfigurarProductos.Presentacion
            .Descripcion,
        ContenidoNeto:
          producto.AsignarProductoLote.ConfigurarProductos.CantidadMedida,
        Medida:
          producto.AsignarProductoLote.ConfigurarProductos.Medida.Descripcion,
        Porcentaje: "",
      };
    }
    return datosKit;
  }

  estructurarSiPerteneceLote(producto) {
    var perteneceLote: any;
    var datosLote: any;
    perteneceLote = this.validarSiPerteneceALote(producto);
    if (perteneceLote != null) {
      datosLote = {
        IdAsignarProductoLote:
          producto.AsignarProductoLote.IdAsignarProductoLote,
        Cantidad: producto.Cantidad,
        IdLote: perteneceLote.IdLote,
        Lote: perteneceLote.Lote,
        FechaExpiracion: perteneceLote.FechaExpiracion,
        Porcentaje: "",
      };
    } else {
      datosLote = {
        IdAsignarProductoLote:
          producto.AsignarProductoLote.IdAsignarProductoLote,
        Cantidad: producto.Cantidad,
        IdLote: "",
        Lote: "",
        FechaExpiracion: producto.AsignarProductoLote.FechaExpiracion,
        Porcentaje: "",
      };
    }
    return datosLote;
  }

  estructurarData(listaProductos, deUnKit?) {
    var estructuraFinal: any;
    var listaProductosFinal: any[] = [];
    var datosKit: any;
    var datosLote: any;
    listaProductos.map((producto) => {
      if (deUnKit){
        datosKit = {
          Codigo: producto.ListaProductos.Codigo,
          Producto: producto.ListaProductos.Producto.Nombre,
          ContenidoNeto: producto.ListaProductos.CantidadMedida,
          Medida: producto.ListaProductos.Medida.Descripcion
        };
        datosLote = {
          Lote: producto.Stock.AsignarProductoLote.Lote.Codigo,
          FechaExpiracion: producto.Stock.AsignarProductoLote.Lote.FechaExpiracion,
          Disponible: producto.Stock.Cantidad
        };
      } else {
        datosKit = this.estructurarSiPerteneceKit(producto);
        datosLote = this.estructurarSiPerteneceLote(producto);
      }
      estructuraFinal = Object.assign(datosKit, datosLote);
      listaProductosFinal.push(estructuraFinal);
    });
    return listaProductosFinal;
  }

  consultarStock() {
    this.inventarioService
      .consultarStock(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.listaProductosEnStock = this.estructurarData(ok["respuesta"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  cerrarModal() {
    this.ventaService.ingresoDetalleVentaPorKit(
      this.idCabeceraFactura,
      this.idKit,
      this.cantidad,
      localStorage.getItem('miCuenta.postToken')
    )
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
        var temp_lista = [];
        try {
          this.nombreKit = this.data.listaProductosDeUnKit[0].Kit.Descripcion;
          this.idKit = this.data.listaProductosDeUnKit[0].Kit.IdKit;
        } catch (error) {
          this.nombreKit = "";
          this.idKit = "";
        }
        this.data.listaProductosDeUnKit.map((producto) => {
          try {
            if (producto.Stock) {
              temp_lista.push(producto);
            }
          } catch (error) {}
        });
        this.listaProductosDeUnKit = this.estructurarData(temp_lista, true);
      }
    } else if (this.router.url == "/compras") {
      console.log(this.data.listaProductosDeUnKit);
      this.areaTablaProductoDeUnKit = true;
      this.areaTablaStock = true;
      this.areaTablaConfiguracionProducto = false;
      if (this.data.listaProductosDeUnKit.length == 0) {
        this.consultarConfiguracionProducto();
      } else {
        this.configuracionProductos = [];
        this.data.listaProductosDeUnKit.map(item => {
          var producto = {
            IdRelacionLogica: item.IdAsignarProductoKit,
            PerteneceKit: "True",
            IdKit: item.Kit.IdKit,
            Kit: item.Kit.Descripcion,
            Producto: item.ListaProductos.Producto.Nombre,
            Presentacion: item.ListaProductos.Presentacion.Descripcion,
            ContenidoNeto: item.ListaProductos.CantidadMedida,
            Medida: item.ListaProductos.Medida.Descripcion,
          } 
          this.configuracionProductos.push(producto);
        })
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
