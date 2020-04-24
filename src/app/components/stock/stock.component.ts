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

  constructor(private inventarioService: InventarioService) { }

  //listaProductosEnStock: any[] = [];
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  listaProductosEnStock = new MatTableDataSource<Element[]>();
  estructurarSiPerteneceALote(producto) {
    var datosLote: any;
    if (producto.AsignarProductoLote.IdLote != '') {
      datosLote = {
        IdLote: producto.AsignarProductoLote.IdLote,
        Lote: producto.AsignarProductoLote.Lote.Codigo,
        FechaExpiracion: producto.AsignarProductoLote.Lote.FechaExpiracion
      }
    }
    return datosLote;
  }

  estructurarSiPerteneceAKit(producto) {
    console.log("pertenece = ",producto)
    var datosKit: any;
    if (producto.AsignarProductoLote.AsignarProductoKits.IdKit != null) {
      datosKit = {
        IdKit: producto.AsignarProductoLote.AsignarProductoKits.IdKit,
        Kit: producto.AsignarProductoLote.AsignarProductoKits.Descripcion,
        IdProducto: producto.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.IdConfigurarProducto,
        Codigo: producto.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Codigo,
        Producto: producto.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Producto.Nombre,
        Presentacion: producto.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Presentacion.Descripcion,
        ContenidoNeto: producto.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.CantidadMedida,
        Medida: producto.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].ListaProductos.Medida.Descripcion,
      }
    }
    return datosKit;
  }

  consultarStock() {
    this.inventarioService.consultarStock(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          var perteneceKit: any;
          var perteneceLote: any;
          var detalle: any;
          var datosKit: any;
          var estructuraFinal: any;
          this.listaProductosEnStock.data = [];
          ok['respuesta'].map(
            producto => {
              perteneceLote = this.estructurarSiPerteneceALote(producto);
              perteneceKit = this.estructurarSiPerteneceAKit(producto);
              if (perteneceLote != null) {
                detalle = {
                  Cantidad: producto.Cantidad,
                  IdLote: perteneceLote.IdLote,
                  Lote: perteneceLote.Lote,
                  FechaExpiracion: perteneceLote.FechaExpiracion,
                }
              } else {
                detalle = {
                  Cantidad: producto.Cantidad,
                  IdLote: '',
                  Lote: '',
                  FechaExpiracion: producto.AsignarProductoLote.FechaExpiracion,
                }
              }
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
                }
              } else {
                datosKit = {
                  Codigo: producto.AsignarProductoLote.ConfigurarProductos.Codigo,
                  IdKit: producto.AsignarProductoLote.AsignarProductoKits.IdKit,
                  Kit: producto.AsignarProductoLote.AsignarProductoKits.Descripcion,
                  IdProducto: producto.AsignarProductoLote.ConfigurarProductos.IdConfigurarProducto,
                  Producto: producto.AsignarProductoLote.ConfigurarProductos.Producto.Nombre,
                  Presentacion: producto.AsignarProductoLote.ConfigurarProductos.Presentacion.Descripcion,
                  ContenidoNeto: producto.AsignarProductoLote.ConfigurarProductos.CantidadMedida,
                  Medida: producto.AsignarProductoLote.ConfigurarProductos.Medida.Descripcion,
                }
              }
              estructuraFinal = Object.assign(detalle, datosKit);
              this.listaProductosEnStock.data.push(estructuraFinal);
            }
          )
          this.listaProductosEnStock.paginator = this.paginator;
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  ngOnInit() {
    this.consultarStock();
  }

  tablaStock = ['codigo', 'kit', 'descripcion', 'presentacion', 'lote', 'fechaExpiracion', 'cantidad'];
}
