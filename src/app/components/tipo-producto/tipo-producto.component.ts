import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

// Interfaces
import { TipoProducto } from 'src/app/interfaces/tipo-producto/tipo-producto';

// Services
import { InventarioService } from 'src/app/services/inventario.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-tipo-producto',
  templateUrl: './tipo-producto.component.html',
  styleUrls: ['./tipo-producto.component.css']
})
export class TipoProductoComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(private inventarioService: InventarioService
  ) {
    this.myForm = new FormGroup({
      _tipoProducto: new FormControl('', [Validators.required])
    })
  }

  tipoProductos: TipoProducto[] = [];
  filterTipoProducto = '';
  botonIngresar = 'ingresar';
  idTipoProducto = '0';

  consultarTipoProductos() {
    this.inventarioService.consultarTipoProductos(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoProductos = ok['respuesta'];
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
        this.crearTipoProducto();
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarTipoProducto();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }


  crearTipoProducto() {
    this.inventarioService.crearTipoProducto(
      this.myForm.get('_tipoProducto').value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          this.nuevoTipoProductoCreado.emit(true);
          this.myForm.reset();
          this.consultarTipoProductos();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarTipoProducto(tipoProducto) {
    this.idTipoProducto = tipoProducto.IdTipoProducto;
    this.myForm.setValue({
      _tipoProducto: tipoProducto.Descripcion 
    })
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarTipoProducto() {
    this.inventarioService.actualizarTipoProducto(
      this.idTipoProducto,
      this.myForm.get('_tipoProducto').value,
      localStorage.getItem('miCuenta.putToken')
    )
    .then(
      ok => {
        this.myForm.reset();
        this.testButton.nativeElement.value = 'ingresar';
        this.consultarTipoProductos();
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
  }

  eliminarTipoProducto(idTipoProducto) {
    this.inventarioService.eliminarTipoProducto(
      idTipoProducto, 
      localStorage.getItem('miCuenta.deleteToken')
    )
    .then(
      ok => {
        this.consultarTipoProductos();
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
  }

  get _tipoProducto() {
    return this.myForm.get('_tipoProducto');
  }

  ngOnInit() {
    this.consultarTipoProductos();
  }

  @Output() nuevoTipoProductoCreado = new EventEmitter();

  tablaTipoProductos = ['descripcion', 'acciones'];

}
