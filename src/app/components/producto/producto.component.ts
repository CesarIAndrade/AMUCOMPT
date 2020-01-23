import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

// Interfaces
import { Producto } from 'src/app/interfaces/producto/producto';
import { TipoProducto } from 'src/app/interfaces/tipo-producto/tipo-producto';
import { Presentacion } from 'src/app/interfaces/presentacion/presentacion';
import { Medida } from 'src/app/interfaces/medida/medida';

// Services
import { InventarioService } from 'src/app/services/inventario.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;
  
  constructor(
    private inventarioService: InventarioService,
  ) {
    this.myForm = new FormGroup({
      _nombre: new FormControl('', [Validators.required]),
      _descripcion: new FormControl(''),
      _codigo: new FormControl('', [Validators.required]),
      _contenidoNeto: new FormControl('', [Validators.required]),
    })
  }

  idProducto = '0';
  tipoProducto = '0';
  presentacion = '0';
  medida = '0';
  botonIngresar = 'ingresar';
  filterProducto = '';
  selectTipoProducto = true;
  selectPresentacion = true;
  selectMedida = true;

  productos: Producto[] = [];
  tipoProductos: TipoProducto[] = [];
  presentaciones: Presentacion[] = [];
  medidas: Medida[] = [];

  consultarTipoProductos() {
    this.inventarioService.consultarTipoProductos(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoProductos = [];
          this.tipoProductos = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarPresentaciones() {
    this.inventarioService.consultarPresentaciones(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.presentaciones = [];
          this.presentaciones = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarMedidas() {
    this.inventarioService.consultarMedidas(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.medidas = [];
          this.medidas = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarProductos() {
    this.inventarioService.consultarProductos(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.productos = [];
          this.productos = ok['respuesta'];
          console.log(this.productos);
          this.consultarTipoProductos();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.testButton.nativeElement.value == 'ingresar') {
        this.crearProducto();
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarProducto();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearProducto() {
    if (this.tipoProducto == '0') {
      this.selectTipoProducto = false;
    } else {
      this.inventarioService.crearProducto(
        this.myForm.get('_nombre').value,
        this.myForm.get('_descripcion').value,
        this.myForm.get('_codigo').value,
        this.tipoProducto,
        localStorage.getItem('miCuenta.postToken')
      )
        .then(
          ok => {
            this.idProducto = ok['respuesta'];
            this.crearConfiguracionProducto();
            this.consultarProductos();
          }
        )
        .catch(
          error => {
            console.log(error);
          }
        )
    }
  }

  mostrarProducto(producto) {
    this.idProducto = producto.IdProducto;
    this.tipoProducto = producto.TipoProducto.IdTipoProducto;
    this.myForm.setValue({
      _nombre: producto.Nombre,
      _descripcion: producto.Descripcion,
      _codigo: producto.Codigo
    })
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarProducto() {
    this.inventarioService.actualizarProducto(
      this.idProducto,
      this.myForm.get('_nombre').value,
      this.myForm.get('_descripcion').value,
      this.myForm.get('_codigo').value,
      this.tipoProducto,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          this.myForm.reset();
          this.testButton.nativeElement.value = 'ingresar';
          this.consultarProductos();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarProducto(idProducto) {
    this.inventarioService.eliminarProducto(
      idProducto,
      localStorage.getItem('miCuenta.deleteToken')
    )
      .then(
        ok => {
          this.consultarProductos();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  crearConfiguracionProducto() {
    this.inventarioService.crearConfiguracionProducto(
      localStorage.getItem('miCuenta.idAsignacionTipoUsuario'),
      this.idProducto,
      this.medida,
      this.presentacion,
      this.myForm.get('_contenidoNeto').value,
      localStorage.getItem('miCuenta.postToken')
    )
    .then(
      ok => {
        console.log(ok['respuesta']);
        this.myForm.reset();
        this.tipoProducto = '0';
        this.presentacion = '0';
        this.medida = '0';
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
  }

  onChangeSelectTipoProducto(value) {
    if (value != "0") {
      this.selectTipoProducto = true;
    }
  }

  onChangeSelectPresentacion(value) {
    if (value != "0") {
      this.selectPresentacion = true;
    }
  }

  onChangeSelectMedida(value) {
    if (value != "0") {
      this.selectMedida = true;
    }
  }

  get _nombre() {
    return this.myForm.get('_nombre');
  }

  get _descripcion() {
    return this.myForm.get('_descripcion');
  }

  get _codigo() {
    return this.myForm.get('_codigo');
  }

  get _contenidoNeto() {
    return this.myForm.get('_contenidoNeto');
  }

  ngOnInit() {
    this.consultarProductos();
    this.consultarMedidas();
    this.consultarPresentaciones();
  }

  tablaProductos = ['nombre', 'codigo', 'acciones'];

}
