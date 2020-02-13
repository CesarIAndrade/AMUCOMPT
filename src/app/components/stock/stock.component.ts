import { Component, OnInit } from '@angular/core';

// Services
import { InventarioService } from 'src/app/services/inventario.service';
//import { DetallesCompra } from 'src/app/interfaces/detalles-compra/detalles-compra';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  constructor(private inventarioService: InventarioService) { }

  listaProductosEnStock: any[] = [];

  consultarStock() {
    this.inventarioService.consultarStock(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.listaProductosEnStock = [];
          var detalleCompra: any;
          ok['respuesta'].map(
            item => {
              if (item.AsignarProductosKits != null) {
                detalleCompra = {
                  Codigo: item.AsignarProductosKits.ListaAsignarProductoKit[0].ListaProductos.Codigo,
                  Kit: item.AsignarProductosKits.Descripcion,
                  Producto: item.AsignarProductosKits.ListaAsignarProductoKit[0].ListaProductos.Producto.Nombre,
                  Presentacion: item.AsignarProductosKits.ListaAsignarProductoKit[0].ListaProductos.Presentacion.Descripcion,
                  ContenidoNeto: item.AsignarProductosKits.ListaAsignarProductoKit[0].ListaProductos.CantidadMedida,
                  Medida: item.AsignarProductosKits.ListaAsignarProductoKit[0].ListaProductos.Medida.Descripcion,
                  TipoProducto: item.AsignarProductosKits.ListaAsignarProductoKit[0].ListaProductos.Producto.TipoProducto.Descripcion,
                  Cantidad: item.Cantidad
                }
                this.listaProductosEnStock.push(detalleCompra);
              }
              else {
                detalleCompra = {
                  Codigo: item.ConfigurarProductos.Codigo,
                  Kit: '',
                  Producto: item.ConfigurarProductos.Producto.Nombre,
                  Presentacion: item.ConfigurarProductos.Presentacion.Descripcion,
                  ContenidoNeto: item.ConfigurarProductos.CantidadMedida,
                  Medida: item.ConfigurarProductos.Medida.Descripcion,
                  TipoProducto: item.ConfigurarProductos.Producto.TipoProducto.Descripcion,
                  Cantidad: item.Cantidad
                }
                this.listaProductosEnStock.push(detalleCompra);
              }
            }
          )
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

  tablaStock = ['codigo', 'kit', 'descripcion', 'tipoProducto', 'cantidad'];
}
