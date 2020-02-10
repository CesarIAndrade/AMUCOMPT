import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Interfaces
import { Parroquia } from 'src/app/interfaces/parroquia/parroquia';
import { Canton } from 'src/app/interfaces/canton/canton';

// Services
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';
import { PersonaService } from 'src/app/services/persona.service';

// SweetAlert
import sweetalert from 'sweetalert';

@Component({
  selector: 'app-parroquia',
  templateUrl: './parroquia.component.html',
  styleUrls: ['./parroquia.component.css']
})
export class ParroquiaComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;
  @Output() nuevaParroquiaCreada = new EventEmitter();

  constructor(private panelAdministracionService: PanelAdministracionService,
    private personaService: PersonaService
  ) {
    this.myForm = new FormGroup({
      _idParroquia: new FormControl(''),
      _parroquia: new FormControl('', [Validators.required]),
      _idCanton: new FormControl('', [Validators.required]),
      _canton: new FormControl('')
    })
  }

  botonIngresar = 'ingresar';
  filterParroquia = '';
  filterCanton = '';

  cantones: Canton[] = [];
  parroquias: Parroquia[] = [];

  consultarCantones() {
    this.personaService.consultarCantones(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.cantones = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarParroquias() {
    this.personaService.consultarParroquias(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.parroquias = [];
          this.parroquias = ok['respuesta'];
          this.consultarCantones();
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
      if (this.testButton.nativeElement.value == 'ingresar') {
        this.crearParroquia();
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarParroquia();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearParroquia() {
    this.panelAdministracionService.crearParroquia(
      this._idCanton.value,
      this._parroquia.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.limpiarCampos();
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Cantón ya existe!", {
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
            this.limpiarCampos();
            this.consultarParroquias();
            this.nuevaParroquiaCreada.emit(true);
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarParroquia(parroquia) {
    this._idCanton.setValue(parroquia.Canton.IdCanton);
    this.cantones.map(
      item => {
        if (this._idCanton.value == item.IdCanton) {
          this._canton.setValue(item.Descripcion);
        }
      }
    )
    this._idParroquia.setValue(parroquia.IdParroquia);
    this.myForm.setValue(parroquia.Descripcion)
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarParroquia() {
    this.panelAdministracionService.actualizarParroquia(
      this._idCanton.value,
      this._idParroquia.value,
      this._parroquia.value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.limpiarCampos();
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Cantón ya existe!", {
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
            this.limpiarCampos();
            this.consultarParroquias();
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

  eliminarParroquia(idParroquia: string) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.panelAdministracionService.eliminarParroquia(
            idParroquia,
            localStorage.getItem('miCuenta.deleteToken'))
            .then(
              ok => {
                if (ok['respuesta']) {
                  sweetAlert("Se ha eliminado correctamente!", {
                    icon: "success",
                  });
                  this.consultarParroquias();
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

  setCanton(canton) {
    this._idCanton.setValue(canton.IdCanton);
    this._canton.setValue(canton.Descripcion);
  }

  limpiarCampos() {
    this.myForm.reset();
    this._canton.setValue('Cantón');
  }

  get _idParroquia() {
    return this.myForm.get('_idParroquia');
  }

  get _parroquia() {
    return this.myForm.get('_parroquia')
  }

  get _idCanton() {
    return this.myForm.get('_idCanton');
  }

  get _canton() {
    return this.myForm.get('_canton');
  }

  ngOnInit() {
    this.consultarParroquias();
  }

  tablaParroquias = ['parroquia', 'canton', 'acciones'];
  tablaCantones = ['canton', 'acciones'];

}
