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

  producto = {
    idAsignarProductoKit: '',
    idConfigurarProducto: '',
    idKit: '',
    kit: '',
    nombre: '',
    presentacion: '',
    contenidoNeto: '',
    medida: ''
  }

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
              var producto = {
                idAsignarProductoKit: '',
                idConfigurarProducto: item.IdConfigurarProducto,
                idKit: '',
                kit: '',
                nombre: item.Producto.Nombre,
                presentacion: item.Presentacion.Descripcion,
                contenidoNeto: item.CantidadMedida,
                medida: item.Medida.Descripcion
              }
              this.configuracionProductos.push(producto);
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

  agregarDetalle(producto) {
    this.producto.idAsignarProductoKit = producto.idAsignarProductoKit;
    this.producto.idConfigurarProducto = producto.idConfigurarProducto;
    this.producto.idKit = producto.idKit;
    this.producto.kit = producto.kit;
    this.producto.nombre = producto.nombre;
    this.producto.presentacion = producto.presentacion;
    this.producto.contenidoNeto = producto.contenidoNeto;
    this.producto.medida = producto.medida;
  }

  ngOnInit() {
    if (this.data.listaProductosDeUnKit.length == 0) {
      this.consultarConfiguracionProducto();
    } else {
      this.data.listaProductosDeUnKit.map(
        item => {
          var producto = {
            idAsignarProductoKit: item.IdAsignarProductoKit,
            idConfigurarProducto: item.ListaProductos.IdConfigurarProducto,
            idKit: item.Kit.IdKit,
            kit: item.Kit.Descripcion,
            nombre: item.ListaProductos.Producto.Nombre,
            presentacion: item.ListaProductos.Presentacion.Descripcion,
            contenidoNeto: item.ListaProductos.CantidadMedida,
            medida: item.ListaProductos.Medida.Descripcion
          }
          this.configuracionProductos.push(producto);
        }
      )
    }
  }

  tablaConfiguracionProducto = ['descripcion', 'presentacion', 'contenidoNeto', 'medida', 'acciones'];

}
