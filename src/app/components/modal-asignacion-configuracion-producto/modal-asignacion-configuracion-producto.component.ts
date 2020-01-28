import { Component, OnInit } from '@angular/core';
import { InventarioService } from 'src/app/services/inventario.service';

@Component({
  selector: 'app-modal-asignacion-configuracion-producto',
  templateUrl: './modal-asignacion-configuracion-producto.component.html',
  styleUrls: ['./modal-asignacion-configuracion-producto.component.css']
})
export class ModalAsignacionConfiguracionProductoComponent implements OnInit {

  constructor(
    private inventarioService: InventarioService,
  ) { }

  filterDetalle = '';

  producto = {
    idConfigurarProducto: '',
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
          console.log(ok['respuesta'])
          this.configuracionProductos = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  agregarDetalle(producto) {
    this.producto.idConfigurarProducto = producto.IdConfigurarProducto;
    this.producto.nombre = producto.Producto.Nombre;
    this.producto.presentacion = producto.Presentacion.Descripcion;
    this.producto.contenidoNeto = producto.CantidadMedida;
    this.producto.medida = producto.Medida.Descripcion;
  }

  ngOnInit() {
    this.consultarConfiguracionProducto();
  }

  tablaConfiguracionProducto = ['descripcion', 'presentacion', 'contenidoNeto', 'medida', 'acciones'];

}
