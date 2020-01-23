import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

// Interfaces
import { TipoProducto } from 'src/app/interfaces/tipo-producto/tipo-producto';

// Services
import { InventarioService } from 'src/app/services/inventario.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// SweetAlert
import sweetalert from 'sweetalert';

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
  inputTipoProducto = true;

  onChangeInputTipoUsuario() {
    this.inputTipoProducto = true;
  }

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
          if(ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if(ok['respuesta'] == '400') {
            this.inputTipoProducto = false;
          } else if(ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.consultarTipoProductos();
          }
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
        if(ok['respuesta'] == null) {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "warning",
          });
        } else if(ok['respuesta'] == '400') {
          this.inputTipoProducto = false;
        } else if(ok['respuesta'] == 'false') {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        } else {
          sweetAlert("Se ingresó correctamente!", {
            icon: "success",
          });
          this.myForm.reset();
          this.testButton.nativeElement.value = 'ingresar';
          this.consultarTipoProductos();
        }
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
  }

  eliminarTipoProducto(idTipoProducto) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        this.inventarioService.eliminarTipoProducto(
          idTipoProducto, 
          localStorage.getItem('miCuenta.deleteToken')
        )
        .then(
          ok => {
            if(ok['respuesta']){
              sweetAlert("Se a eliminado correctamente!", {
                icon: "success",
              });
              this.consultarTipoProductos();
            } else {
              sweetAlert("No se ha podido elminiar!", {
                icon: "error",
              });
            }
          }
        )
        .catch(
          error => {
            console.log(error);
          }
        )
      }
    });
  }

  get _tipoProducto() {
    return this.myForm.get('_tipoProducto');
  }

  ngOnInit() {
    this.consultarTipoProductos();
  }

  tablaTipoProductos = ['descripcion', 'acciones'];

}
