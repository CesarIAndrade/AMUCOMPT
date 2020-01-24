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
      _parroquia: new FormControl('', [Validators.required])
    })
  }

  botonIngresar = 'ingresar';
  idParroquia = '0';
  canton = 'Canton';
  inputIdCanton = true;
  idCanton = '0';
  inptParroquia = true;

  parroquias: Parroquia[] = [];
  filterParroquia = '';
  filterCanton = '';
  cantones: Canton[] = [];

  onChangeInptParroquia() {
    this.inptParroquia = true;
  }

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
        if (this.idCanton == '0') {
          this.inputIdCanton = false;
        }
        else {
          this.crearParroquia();
        }
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarParroquia();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearParroquia(){
    this.panelAdministracionService.crearParroquia(
      this.idCanton,
      this.myForm.get('_parroquia').value,
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
            this.inptParroquia = false;
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
    this.idCanton = parroquia.Canton.IdCanton;
    this.cantones.map(
      item => {
        if (this.idCanton == item.IdCanton) {
          this.canton = item.Descripcion;
        }
      }
    )
    this.idParroquia = parroquia.IdParroquia;
    this.myForm.setValue({
      _parroquia: parroquia.Descripcion
    })
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarParroquia(){
    this.panelAdministracionService.actualizarParroquia(
      this.idCanton,
      this.idParroquia,
      this.myForm.get('_parroquia').value,
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
            this.inptParroquia = false;
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
  
  eliminarParroquia(idParroquia: string){
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
              if(ok['respuesta']){
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
    this.idCanton = canton.IdCanton;
    this.canton = canton.Descripcion;
    this.inputIdCanton = true;
  }

  limpiarCampos() {
    this.myForm.reset();
    this.canton = 'Parroquia';
  }

  get _parroquia(){
    return this.myForm.get('_parroquia')
  }

  ngOnInit() {
    this.consultarParroquias();
  }

  tablaParroquias = ['parroquia', 'canton', 'acciones'];
  tablaCantones = ['canton', 'acciones'];

}
