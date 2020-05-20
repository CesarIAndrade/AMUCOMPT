import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Services
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';

// SweetAlert
import sweetalert from 'sweetalert';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.css']
})
export class ProvinciaComponent implements OnInit {

  myForm: FormGroup;

  constructor(
    private panelAdministracionService: PanelAdministracionService
  ) {
    this.myForm = new FormGroup({
      _idProvincia: new FormControl(''),
      _provincia: new FormControl('', [Validators.required])
    })
  }

  botonIngresar = 'ingresar';
  filterProvincia = '';

  // Para la paginacion
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  provincias = new MatTableDataSource<Element[]>();

  consultarProvincias() {
    this.panelAdministracionService.consultarProvincias(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.provincias.data = [];
          this.provincias.data = ok['respuesta'];
          this.provincias.paginator = this.paginator;
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.botonIngresar == 'ingresar') {
        this.crearProvincia();
      } else if (this.botonIngresar == 'modificar') {
        this.actualizarProvincia();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearProvincia() {
    this.panelAdministracionService.crearProvincia(
      this._provincia.value,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Provincia ya existe!", {
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
            this.consultarProvincias();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  actualizarProvincia() {
    this.panelAdministracionService.actualizarProvincia(
      this._idProvincia.value,
      this._provincia.value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {       
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Provincia ya existe!", {
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
            this.consultarProvincias();
            this.botonIngresar = 'ingresar';
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarProvincia(idProvincia: string) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.panelAdministracionService.eliminarProvincia(
            idProvincia,
            localStorage.getItem('miCuenta.deleteToken'))
            .then(
              ok => {
                if (ok['respuesta']) {
                  sweetAlert("Se a eliminado Correctamente!", {
                    icon: "success",
                  });
                  this.consultarProvincias();
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

  get _idProvincia() {
    return this.myForm.get('_idProvincia');
  }

  get _provincia() {
    return this.myForm.get('_provincia');
  }

  ngOnInit() {
    this.consultarProvincias();
  }

  tablaProvincias = ['provincia', 'acciones'];

}