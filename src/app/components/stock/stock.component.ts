import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
// Services
import { InventarioService } from 'src/app/services/inventario.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  constructor(
    private inventarioService: InventarioService,
  ) { }

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  // listaProductosEnStock = new MatTableDataSource<Element[]>();

  listaProductosEnStock: any[] = [];

  consultarStock() {
    this.inventarioService
      .consultarStock(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.listaProductosEnStock = [];
        ok['respuesta'].map(item => {
          var lote = "";
          var kit = "";
          var fechaExpiracion = "";
          var nombreProducto = "";
          var presentacion = "";
          var contenidoNeto = "";
          var medida = "";
          var codigo = "";
          if (item.AsignarProductoLote.Lote) {  
            lote = item.AsignarProductoLote.Lote.Codigo;
            fechaExpiracion = item.AsignarProductoLote.Lote.FechaExpiracion;
          } else {
            lote = "";
            fechaExpiracion = item.AsignarProductoLote.FechaExpiracion;
          }
          if (item.AsignarProductoLote.PerteneceKit != "False") {     
            kit = item.AsignarProductoLote.AsignarProductoKit.Kit.Descripcion;
            nombreProducto = item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Producto.Nombre;
            contenidoNeto = item.AsignarProductoLote.AsignarProductoKit.ListaProductos.CantidadMedida;
            medida = item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Medida.Descripcion;
            codigo = item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Codigo;
            presentacion = item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Presentacion.Descripcion;
          } else {
            kit = "";
            nombreProducto = item.AsignarProductoLote.ConfigurarProductos.Producto.Nombre;
            contenidoNeto = item.AsignarProductoLote.ConfigurarProductos.CantidadMedida;
            medida = item.AsignarProductoLote.ConfigurarProductos.Medida.Descripcion;
            codigo = item.AsignarProductoLote.ConfigurarProductos.Codigo;
            presentacion = item.AsignarProductoLote.ConfigurarProductos.Presentacion.Descripcion;
          }
          var producto = {
            Codigo: codigo,
            IdAsignarProductoLote: item.AsignarProductoLote.IdAsignarProductoLote,
            Kit: kit,
            Lote: lote,
            FechaExpiracion: fechaExpiracion,
            Cantidad: item.Cantidad,
            Producto: nombreProducto,
            Presentacion: presentacion,
            ContenidoNeto: contenidoNeto,
            Medida: medida,
          }
          this.listaProductosEnStock.push(producto)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ngOnInit() {
    this.consultarStock();
  }

  tablaStock = ['codigo', 'kit', 'descripcion', 'presentacion', 'lote', 'fechaExpiracion', 'cantidad'];
}
