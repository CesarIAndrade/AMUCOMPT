import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

// Interfaces


// Services
import { InventarioService } from 'src/app/services/inventario.service';
import { Producto } from 'src/app/interfaces/producto/producto';
import { TipoProducto } from 'src/app/interfaces/tipo-producto/tipo-producto';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(private inventarioService: InventarioService) {
    this.myForm = new FormGroup({
      _nombre: new FormControl('', [Validators.required]),
      _descripcion: new FormControl('', [Validators.required]),
      _codigo: new FormControl('', [Validators.required])
    })
  }

  tipoProducto = '0'
  botonIngresar = 'ingresar';
  filterProducto = '';
  selectTipoProducto = true;
  idProducto = '0';

  productos: Producto[] = [];
  tipoProductos: TipoProducto[] = [];

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

  consultarProductos() {
    this.inventarioService.consultarProductos(
      localStorage.getItem('miCuenta.getToken')
    )
    .then(
      ok => {
        this.productos = [];
        this.productos = ok['respuesta'];
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

  onChangeSelectTipoProducto(value) {
    if (value != "0") {
      this.selectTipoProducto = true;
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

  ngOnInit() {
    this.consultarTipoProductos();
    this.consultarProductos();
  }

  tablaProductos = ['nombre', 'codigo', 'acciones'];

}
