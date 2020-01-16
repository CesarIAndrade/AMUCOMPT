import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Services
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';
import { PersonaService } from 'src/app/services/persona.service';

// Interfaces
import { Provincia } from 'src/app/interfaces/provincia/provincia';
import { Canton } from 'src/app/interfaces/canton/canton';
import sweetalert from 'sweetalert';

@Component({
  selector: 'app-canton',
  templateUrl: './canton.component.html',
  styleUrls: ['./canton.component.css']
})
export class CantonComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(private panelAdministracionService: PanelAdministracionService,
    private personaService: PersonaService
  ) {
    this.myForm = new FormGroup({
      _canton: new FormControl('', [Validators.required])
    })
  }

  botonIngresar = 'ingresar';
  idCanton = '0';
  idProvincia = '0';
  inputIdProvincia = true;
  provincia = 'Seleccione Provincia';

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
          this.cantones = ok['respuesta'];
          console.log(this.cantones);
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
        if (this.idProvincia == '0') {
          this.inputIdProvincia = false;
        }
        else {
          this.crearCanton();
        }
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarCanton();
        this.testButton.nativeElement.value = 'ingresar';
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearCanton() {
    this.panelAdministracionService.crearCanton(
      this.idProvincia,
      this.myForm.get('_canton').value,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          this.limpiarCampos();
          this.consultarCantones();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarCanton(canton) {
    this.idProvincia = canton.Provincia.IdProvincia;
    this.provincias.map(
      item => {
        if (this.idProvincia == item.IdProvincia) {
          this.provincia = item.Descripcion;
        }
      }
    )
    this.idCanton = canton.IdCanton;
    this.myForm.setValue({
      _canton: canton.Descripcion
    })
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarCanton() {
    this.panelAdministracionService.actualizarCanton(
      this.idProvincia,
      this.idCanton,
      this.myForm.get('_canton').value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          this.limpiarCampos();
          this.consultarCantones();
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
                  sweetAlert("Se a eliminado Correctamente!", {
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
    this.idProvincia = provincia.IdProvincia;
    this.provincia = provincia.Descripcion;
    this.inputIdProvincia = true;
  }

  limpiarCampos() {
    this.myForm.reset();
    this.provincia = 'Provincia';
  }

  get _canton() {
    return this.myForm.get('_canton');
  }

  ngOnInit() {
    this.consultarCantones();
  }
}
