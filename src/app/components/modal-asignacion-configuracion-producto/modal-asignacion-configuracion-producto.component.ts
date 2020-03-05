import { Component, OnInit, Inject } from '@angular/core';
import { InventarioService } from 'src/app/services/inventario.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-asignacion-configuracion-producto',
  templateUrl: './modal-asignacion-configuracion-producto.component.html',
  styleUrls: ['./modal-asignacion-configuracion-producto.component.css']
})
export class ModalAsignacionConfiguracionProductoComponent implements OnInit {

  constructor(
    private inventarioService: InventarioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  filterDetalle = '';
  areaTablaConfiguracionProducto: boolean;
  areaTablaStock: boolean;
  producto = {
    IdRelacionLogica: '',
    PerteneceKit: '',
    IdKit: '',
    Kit: '',
    Producto: '',
    Presentacion: '',
    ContenidoNeto: '',
    Medida: '',
    IdAsignarProductoLote: '',
    IdLote: '',
    Lote: '',
    Codigo: '',
    FechaExpiracion: '',
    Porcentaje : '',
    Disponible: '',
  };

  configuracionProductos: any[] = [];

  consultarConfiguracionProducto() {
    this.inventarioService.consultarConfiguracionProductoTodos(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {          
          this.configuracionProductos = [];
          ok['respuesta'].map(
            item => {
              //if (item.ConfigurarProductosUtilizado == '0') {
                var producto = {
                  IdRelacionLogica: item.IdConfigurarProducto,
                  PerteneceKit: 'False',
                  IdKit: '',
                  Kit: '',
                  Nombre: item.Producto.Nombre,
                  Presentacion: item.Presentacion.Descripcion,
                  ContenidoNeto: item.CantidadMedida,
                  Medida: item.Medida.Descripcion
                }
                this.configuracionProductos.push(producto);
              //}
            }
          )
          console.log(this.configuracionProductos);
          
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
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

  listaProductosEnStock: any[] = [];

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
          //console.log(ok['respuesta']);
          var perteneceKit: any;
          var perteneceLote: any;
          var detalle: any;
          var datosKit: any;
          var estructuraFinal: any;
          this.listaProductosEnStock = [];
          ok['respuesta'].map(
            producto => {
              perteneceLote = this.estructurarSiPerteneceALote(producto);
              perteneceKit = this.estructurarSiPerteneceAKit(producto);
              if (perteneceLote != null) {
                detalle = {
                  IdAsignarProductoLote: producto.AsignarProductoLote.IdAsignarProductoLote,
                  Cantidad: producto.Cantidad,
                  IdLote: perteneceLote.IdLote,
                  Lote: perteneceLote.Lote,
                  FechaExpiracion: perteneceLote.FechaExpiracion,
                  Porcentaje : '',
                }
              } else {
                detalle = {
                  IdAsignarProductoLote: producto.AsignarProductoLote.IdAsignarProductoLote,
                  Cantidad: producto.Cantidad,
                  IdLote: '',
                  Lote: '',
                  FechaExpiracion: producto.AsignarProductoLote.FechaExpiracion,
                  Porcentaje : '',
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
                  Porcentaje : producto.AsignarProductoLote.AsignarProductoKits.ListaAsignarProductoKit[0].Kit.AsignarDescuentoKit.Descuento.Porcentaje + '%',
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
                  Porcentaje : '',
                }
              }
              estructuraFinal = Object.assign(detalle, datosKit);
              this.listaProductosEnStock.push(estructuraFinal);
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
    if(this.data != null) {
      this.areaTablaStock = true;
      if (this.data.listaProductosDeUnKit.length == 0) {        
        this.consultarConfiguracionProducto();
      } else {
        this.data.listaProductosDeUnKit.map(
          item => {
            var producto = {
              IdRelacionLogica: item.IdAsignarProductoKit,
              PerteneceKit: 'True',
              IdKit: item.Kit.IdKit,
              Kit: item.Kit.Descripcion,
              Nombre: item.ListaProductos.Producto.Nombre,
              Presentacion: item.ListaProductos.Presentacion.Descripcion,
              ContenidoNeto: item.ListaProductos.CantidadMedida,
              Medida: item.ListaProductos.Medida.Descripcion
            }
            this.configuracionProductos.push(producto);
          }
        )
      }      
    } else {
      this.consultarStock();
      this.areaTablaConfiguracionProducto = true;
    }
  }

  tablaConfiguracionProducto = ['descripcion', 'presentacion', 'contenidoNeto', 'medida', 'acciones'];
  tablaStock = ['codigo', 'kit', 'descripcion', 'presentacion', 'lote', 'fechaExpiracion','Disponible', 'acciones'];

}
