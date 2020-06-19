import { Component, OnInit, ViewChild } from "@angular/core";

// Material
import { MatPaginator, MatTableDataSource } from "@angular/material";

// Services
import { InventarioService } from "src/app/services/inventario.service";

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"],
})
export class StockComponent implements OnInit {
  constructor(private inventarioService: InventarioService) {}

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  listaProductosEnStock = new MatTableDataSource<Element[]>();
  
  loading = true;

  async consultarStock() {
    var stock = await this.inventarioService.consultarStock();
    if (stock["codigo"] == "200") {
      this.loading = false;
      var listaProductosEnStock = [];
      stock["respuesta"].map((item) => {
        var lote = "N/A";
        var kit = "N/A";
        var fechaExpiracion = "";
        var nombreProducto = "";
        var presentacion = "";
        var contenidoNeto = "";
        var medida = "";
        var codigo = "";
        var tipoProducto = "";
        var iva = "";
        var descripcion = "N/A";
        var estado = "";
        if (item.Cantidad <= 6) {
          estado = "badge badge-warning";
        } else {
          estado = "badge badge-success";
        }
        if (item.AsignarProductoLote.Lote) {
          lote = item.AsignarProductoLote.Lote.Codigo;
          fechaExpiracion = item.AsignarProductoLote.Lote.FechaExpiracion;
        } else {
          fechaExpiracion = item.AsignarProductoLote.FechaExpiracion;
        }
        
        if (item.AsignarProductoLote.PerteneceKit != "False") {
          kit = item.AsignarProductoLote.AsignarProductoKit.Kit.Descripcion;
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
          presentacion =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos
              .Presentacion.Descripcion;
          tipoProducto =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Producto
              .TipoProducto.Descripcion;
          iva = item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Iva;
          descripcion =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Producto
              .Descripcion;
        } else if (item.AsignarProductoLote.PerteneceKit == "False") {
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
          tipoProducto =
            item.AsignarProductoLote.ConfigurarProductos.Producto.TipoProducto
              .Descripcion;
          iva = item.AsignarProductoLote.ConfigurarProductos.Iva;
          descripcion =
            item.AsignarProductoLote.ConfigurarProductos.Producto.Descripcion;
        }
        var producto = {
          Codigo: codigo,
          Producto: nombreProducto,
          TipoProducto: tipoProducto,
          Presentacion: presentacion,
          Contenido: contenidoNeto,
          Medida: medida,
          Descripcion: descripcion,
          Iva: iva,
          Kit: kit,
          Lote: lote,
          FechaExpiracion: fechaExpiracion, 
          Cantidad: item.Cantidad,
          Estado: estado,
        };
        listaProductosEnStock.push(producto);
      });
      this.listaProductosEnStock.data = listaProductosEnStock;
      this.listaProductosEnStock.paginator = this.paginator;
    }
  }

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase(); 
    this.listaProductosEnStock.filter = term;
  }

  ngOnInit() {
    this.consultarStock();
  }

  tablaStock = [
    "codigo",
    "producto",
    "tipo",
    "presentacion",
    "contenido",
    "medida",
    "descripcion",
    "iva",
    "kit",
    "lote",
    "fechaExpiracion",
    "cantidad",
  ];
}
