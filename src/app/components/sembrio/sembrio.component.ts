import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Services
import { PersonaService } from 'src/app/services/persona.service';
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';

// SweetAlert
import sweetalert from 'sweetalert';

@Component({
  selector: 'app-sembrio',
  templateUrl: './sembrio.component.html',
  styleUrls: ['./sembrio.component.css']
})
export class SembrioComponent implements OnInit {

  myForm: FormGroup;
  @Output() nuevoSembrioCreado = new EventEmitter();
  
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private personaService: PersonaService
  ) {
    this.myForm = new FormGroup({
      _idSembrio: new FormControl(''),
      _sembrio: new FormControl('', [Validators.required]),
      _idComunidad: new FormControl('', [Validators.required]),
      _comunidad: new FormControl('')
    })
  }

  botonIngresar = 'ingresar';
  filterComunidad = '';
  filterSembrio = '';

  sembrios: any[] = [];
  comunidades: any[] = [];

  consultarComunidades() {
    this.personaService.consultarComunidades(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.comunidades = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarSembrios() {
    this.personaService.consultarSembrios(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.sembrios = ok['respuesta'];
          this.consultarComunidades();
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
          this.crearSembrio();
      } else if (this.botonIngresar == 'modificar') {
        this.actualizarSembrio();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearSembrio() {
    this.panelAdministracionService.crearSembrio(
      this._idComunidad.value,
      this._sembrio.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          this.nuevoSembrioCreado.emit(true);
          this.myForm.reset();
          this.consultarSembrios();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  setComunidad(comunidad) {
    this._idComunidad.setValue(comunidad.IdComunidad);
    this._comunidad.setValue(comunidad.Descripcion);
  }

  mostrarSembrio(sembrio) {
    this._idComunidad.setValue(sembrio.Comunidad.IdComunidad);
    this._comunidad.setValue(sembrio.Comunidad.Descripcion);
    this._idSembrio.setValue(sembrio.IdSembrio);
    this._sembrio.setValue(sembrio.Descripcion)
    this.botonIngresar = 'modificar';
  }

  actualizarSembrio() {
    this.panelAdministracionService.actualizarSembrio(
      this._idComunidad.value,
      this._idSembrio.value,
      this._sembrio.value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          this.myForm.reset();
          this.consultarSembrios();
          this.botonIngresar = 'ingresar';
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarSembrio(idComunidad: string) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.panelAdministracionService.eliminarSembrio(
            idComunidad,
            localStorage.getItem('miCuenta.deleteToken'))
            .then(
              ok => {
                this.consultarSembrios();
              }
            )
            .catch(
              error => {
                console.log(error);
              }
            )
          sweetAlert("Se a eliminado Correctamente!", {
            icon: "success",
          });
        }
      });
  }

get _idSembrio() {
  return this.myForm.get('_idSembrio');
}

  get _sembrio() {
    return this.myForm.get('_sembrio');
  }

  get _idComunidad() {
    return this.myForm.get('_idComunidad');
  }

  get _comunidad() {
    return this.myForm.get('_comunidad');
  }

  ngOnInit() {
    this.consultarSembrios();
  }

  tablaSembrios = ['sembrio', 'comunidad', 'acciones'];
  tablaComunidades = ['comunidad', 'acciones'];

}
