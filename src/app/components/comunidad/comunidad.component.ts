import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';

// Services
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';

// SweetAlert
import sweetalert from 'sweetalert';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { ModalLocalidadSuperiorComponent } from '../modal-localidad-superior/modal-localidad-superior.component';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html',
  styleUrls: ['./comunidad.component.css']
})
export class ComunidadComponent implements OnInit {

  myForm: FormGroup;

  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private modalLocalidadSuperior: MatDialog
  ) {
    this.myForm = new FormGroup({
      _idComunidad: new FormControl(''),
      _comunidad: new FormControl('', [Validators.required]),
      _idParroquia: new FormControl('', [Validators.required]),
      _parroquia: new FormControl('')
    })
  }

  botonIngresar = 'ingresar';
  filterComunidad = '';

  // Para la paginacion
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  comunidades = new MatTableDataSource<Element[]>();

  consultarComunidades() {
    this.panelAdministracionService.consultarComunidades(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.comunidades.data = [];
          this.comunidades.data = ok['respuesta'];
          this.comunidades.paginator = this.paginator;
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
        this.crearComunidad();
      } else if (this.botonIngresar == 'modificar') {
        this.actualizarComunidad();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearComunidad() {
    this.panelAdministracionService.crearComunidad(
      this._idParroquia.value,
      this._comunidad.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Comunidad ya existe!", {
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
            this.consultarComunidades();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  actualizarComunidad() {
    this.panelAdministracionService.actualizarComunidad(
      this._idParroquia.value,
      this._idComunidad.value,
      this._comunidad.value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Comunidad ya existe!", {
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
            this.consultarComunidades();
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

  eliminarComunidad(idComunidad: string) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.panelAdministracionService.eliminarComunidad(
            idComunidad,
            localStorage.getItem('miCuenta.deleteToken'))
            .then(
              ok => {
                if (ok['respuesta']) {
                  sweetAlert("Se ha eliminado correctamente!", {
                    icon: "success",
                  });
                  this.consultarComunidades();
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

  abrirModal() {
    let dialogRef = this.modalLocalidadSuperior.open(ModalLocalidadSuperiorComponent, {
      width: '400px',
      height: 'auto',
      data: {
        ruta: 'comunidades'
      }
    }); 
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this._idParroquia.setValue(result.idLocalidad);
        this._parroquia.setValue(result.descripcion);
      }
    });
  } 

  get _idComunidad() {
    return this.myForm.get('_idComunidad');
  }

  get _comunidad() {
    return this.myForm.get('_comunidad');
  }

  get _idParroquia() {
    return this.myForm.get('_idParroquia');
  }

  get _parroquia() {
    return this.myForm.get('_parroquia');
  }

  ngOnInit() {
    this.consultarComunidades();
  }

  tablaComunidades = ['comunidad', 'parroquia', 'acciones'];

}
