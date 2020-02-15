import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Services
import { InventarioService } from 'src/app/services/inventario.service';

// SweetAlert
import sweetalert from 'sweetalert';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css']
})
export class PresentacionComponent implements OnInit {

  myForm: FormGroup;

  constructor(private inventarioService: InventarioService) {
    this.myForm = new FormGroup({
      _presentacion: new FormControl('', [Validators.required]),
      _idPresentacion: new FormControl(''),
    })
  }

  botonIngresar = 'ingresar';
  filterPresentacion = '';

  presentaciones: any[] = [];

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

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.botonIngresar == 'ingresar') {
        this.crearPresentacion();
      } else if (this.botonIngresar == 'modificar') {
        this.actualizarPresentacion();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearPresentacion() {
    this.inventarioService.crearPresentacion(
      this._presentacion.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          console.log(ok['respuesta']);
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Presentación ya existe!", {
              icon: "warning",
            });
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.consultarPresentaciones();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarPresentacion(presentacion) {
    this._idPresentacion.setValue(presentacion.IdPresentacion);
    this._presentacion.setValue(presentacion.Descripcion);
    this.botonIngresar = 'modificar';
  }

  actualizarPresentacion() {
    this.inventarioService.actualizarPresentacion(
      this._idPresentacion.value,
      this._presentacion.value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Presentación ya existe!", {
              icon: "warning",
            });
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.botonIngresar = 'ingresar';
            this.consultarPresentaciones();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarPresentacion(idPresentacion) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.inventarioService.eliminarPresentacion(
            idPresentacion,
            localStorage.getItem('miCuenta.deleteToken')
          )
            .then(
              ok => {
                if (ok['respuesta']) {
                  sweetAlert("Se a eliminado correctamente!", {
                    icon: "success",
                  });
                  this.consultarPresentaciones();
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

  get _presentacion() {
    return this.myForm.get('_presentacion');
  }

  get _idPresentacion() {
    return this.myForm.get('_idPresentacion');
  }

  ngOnInit() {
    this.consultarPresentaciones();
  }

  tablaPresentaciones = ['descripcion', 'acciones'];

}
