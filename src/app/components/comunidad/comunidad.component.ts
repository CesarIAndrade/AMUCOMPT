import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';

// Interfaces
import { Parroquia } from 'src/app/interfaces/parroquia/parroquia';
import { Comunidad } from 'src/app/interfaces/comunidad/comunidad';

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
      _comunidad: new FormControl('', [Validators.required])
    })
  }

  botonIngresar = 'ingresar';
  idParroquia = '0';
  parroquia = 'Parroquia';
  inputIdParroquia = true;
  idComunidad = '0';
  inputComunidad = true;

  filterParroquia='';
  filterComunidad='';
  parroquias: Parroquia[] = [];
  comunidades: Comunidad[] = [];

  onChangeInptComunidad() {
    this.inputComunidad = true;
  }

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
          console.log(this.comunidades);
          this.consultarParroquias();
          console.log(ok['respuesta']);

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
        if (this.idParroquia == '0') {
          this.inputIdParroquia = false;
        }
        else {
          this.crearComunidad();
        }
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarComunidad();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearComunidad() {
    this.panelAdministracionService.crearComunidad(
      this.idParroquia,
      this.myForm.get('_comunidad').value,
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
            this.inputComunidad = false;
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.limpiarCampos();
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
    this.idParroquia = comunidad.Parroquia.IdParroquia;
    this.parroquias.map(
      item => {
        if (this.idParroquia == item.IdParroquia) {
          this.parroquia = item.Descripcion;
        }
      }
    )
    this.idComunidad = comunidad.IdComunidad;
    this.myForm.setValue({
      _comunidad: comunidad.Descripcion
    })
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarComunidad() {
    this.panelAdministracionService.actualizarComunidad(
      this.idParroquia,
      this.idComunidad,
      this.myForm.get('_comunidad').value,
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
            this.inputComunidad = false;
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.limpiarCampos();
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
              this.consultarComunidades();
            }
          )
          .catch(
            error => {
              console.log(error);
            }
          )
        sweetAlert("Se ha eliminado correctamente!", {
          icon: "success",
        });
      }
    });
  }

  setParroquia(parroquia) {
    this.idParroquia = parroquia.IdParroquia;
    this.parroquia = parroquia.Descripcion;
    this.inputIdParroquia = true;
  }

  limpiarCampos() {
    this.myForm.reset();
    this.parroquia = 'Parroquia';
  }

  get _comunidad() {
    return this.myForm.get('_comunidad')
  }

  ngOnInit() {
    this.consultarComunidades();
  }

  tablaComunidades = ['comunidad', 'parroquia', 'acciones'];
  tablaParroquias = ['parroquia', 'acciones'];

}
