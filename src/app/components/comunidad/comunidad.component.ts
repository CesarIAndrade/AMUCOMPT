import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';

// Services
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';
import { PersonaService } from 'src/app/services/persona.service';

// SweetAlert
import sweetalert from 'sweetalert';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html',
  styleUrls: ['./comunidad.component.css']
})
export class ComunidadComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;
  @Output() nuevaCaomunidadCreada = new EventEmitter();

  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private personaService: PersonaService
  ) {
    this.myForm = new FormGroup({
      _idComunidad: new FormControl(''),
      _comunidad: new FormControl('', [Validators.required]),
      _idParroquia: new FormControl('', [Validators.required]),
      _parroquia: new FormControl('')
    })
  }

  botonIngresar = 'ingresar';
  filterParroquia = '';
  filterComunidad = '';

  parroquias: any[] = [];
  comunidades: any[] = [];

  consultarParroquias() {
    this.personaService.consultarParroquias(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.parroquias = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarComunidades() {
    this.personaService.consultarComunidades(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.comunidades = ok['respuesta'];
          this.consultarParroquias();
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
        this.crearComunidad();
      } else if (this.testButton.nativeElement.value == 'modificar') {
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
            this.nuevaCaomunidadCreada.emit(true);
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarComunidad(comunidad) {
    this._idParroquia.setValue(comunidad.Parroquia.IdParroquia);
    var parroquia = this.parroquias.find(parroquia => parroquia.IdParroquia == this._idParroquia)
    this._parroquia.setValue(parroquia.Descripcion);
    this._idComunidad.setValue(comunidad.IdComunidad);
    this.myForm.setValue(comunidad.Descripcion)
    this.testButton.nativeElement.value = 'modificar';
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
            this.testButton.nativeElement.value = 'ingresar';
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

  setParroquia(parroquia) {
    this._idParroquia.setValue(parroquia.IdParroquia);
    this._parroquia.setValue(parroquia.Descripcion);
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
  tablaParroquias = ['parroquia', 'acciones'];

}
