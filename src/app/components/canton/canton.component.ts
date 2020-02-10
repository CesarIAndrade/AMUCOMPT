import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Services
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';
import { PersonaService } from 'src/app/services/persona.service';

// Interfaces
import { Provincia } from 'src/app/interfaces/provincia/provincia';
import { Canton } from 'src/app/interfaces/canton/canton';

// SweetAlert
import sweetalert from 'sweetalert';

@Component({
  selector: 'app-canton',
  templateUrl: './canton.component.html',
  styleUrls: ['./canton.component.css']
})
export class CantonComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;
  @Output() nuevoCantonCreado = new EventEmitter();

  constructor(private panelAdministracionService: PanelAdministracionService,
    private personaService: PersonaService
  ) {
    this.myForm = new FormGroup({
      _idCanton: new FormControl(''),
      _canton: new FormControl('', [Validators.required]),
      _idProvincia: new FormControl('', [Validators.required]),
      _provincia: new FormControl('')
    })
  }

  botonIngresar = 'ingresar';
  filterProvincia = '';
  filterCanton = '';

  provincias: Provincia[] = [];
  cantones: Canton[] = [];

  consultarProvincias() {
    this.personaService.consultarProvincias(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.provincias = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarCantones() {
    this.personaService.consultarCantones(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.cantones = [];
          this.cantones = ok['respuesta'];
          this.consultarProvincias();
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
        this.crearCanton();
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarCanton();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearCanton() {
    this.panelAdministracionService.crearCanton(
      this._idProvincia.value,
      this._canton.value,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {

          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
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
            this.myForm.reset();
            this.consultarCantones();
            this.nuevoCantonCreado.emit();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarCanton(canton) {
    this._idProvincia.setValue(canton.Provincia.IdProvincia);
    this.provincias.map(
      item => {
        if (this._idProvincia.value == item.IdProvincia) {
          this._provincia.setValue(item.Descripcion);
        }
      }
    )
    this._idCanton.setValue(canton.IdCanton);
    this._canton.setValue(canton.Descripcion);
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarCanton() {
    this.panelAdministracionService.actualizarCanton(
      this._idProvincia.value,
      this._idCanton.value,
      this._canton.value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
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
            this.testButton.nativeElement.value = 'ingresar';
            this.myForm.reset();
            this.consultarCantones();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }


  eliminarCanton(idCanton: string) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.panelAdministracionService.eliminarCanton(
            idCanton,
            localStorage.getItem('miCuenta.deleteToken'))
            .then(
              ok => {
                if (ok['respuesta']) {
                  sweetAlert("Se ha eliminado correctamente!", {
                    icon: "success",
                  });
                  this.consultarCantones();
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

  setProvincia(provincia) {
    this._provincia.setValue(provincia.Descripcion);
    this._idProvincia.setValue(provincia.IdProvincia);
  }

  get _idCanton() {
    return this.myForm.get('_idCanton');
  }

  get _canton() {
    return this.myForm.get('_canton');
  }

  get _provincia() {
    return this.myForm.get('_provincia');
  }

  get _idProvincia() {
    return this.myForm.get('_idProvincia');
  }

  ngOnInit() {
    this.consultarCantones();
  }

  tablaCantones = ['canton', 'provincia', 'acciones'];
  tablaProvincias = ['provincia', 'acciones'];

}