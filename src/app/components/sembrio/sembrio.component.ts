import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Interfaces
import { Sembrio } from "src/app/interfaces/sembrio/sembrio";
import { Comunidad } from 'src/app/interfaces/comunidad/comunidad';

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
  @ViewChild('testButton', { static: false }) testButton: ElementRef;
  @Output() nuevoSembrioCreado = new EventEmitter();
  
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private personaService: PersonaService
  ) {
    this.myForm = new FormGroup({
      _sembrio: new FormControl('', [Validators.required])
    })
  }

  idComunidad = '0';
  idSembrio = '0';
  comunidad = 'Comunidad';
  inputIdComunidad = true;
  botonIngresar = 'ingresar';
  filterComunidad = '';
  filterSembrio = '';

  sembrios: Sembrio[] = [];
  comunidades: Comunidad[] = [];

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
      if (this.testButton.nativeElement.value == 'ingresar') {
        if (this.idComunidad == '0') {
          this.inputIdComunidad = false;
        }
        else {
          this.crearSembrio();
        }
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarSembrio();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearSembrio() {
    this.panelAdministracionService.crearSembrio(
      this.idComunidad,
      this.myForm.get('_sembrio').value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          this.nuevoSembrioCreado.emit(true);
          this.limpiarCampos();
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
    this.idComunidad = comunidad.IdComunidad;
    this.comunidad = comunidad.Descripcion;
    this.inputIdComunidad = true;
  }

  mostrarSembrio(sembrio) {
    this.idComunidad = sembrio.Comunidad.IdComunidad;
    this.comunidades.map(
      item => {
        if (this.idComunidad == item.IdComunidad) {
          this.comunidad = item.Descripcion;
        }
      }
    )
    this.idSembrio = sembrio.IdSembrio;
    this.myForm.setValue({
      _sembrio: sembrio.Descripcion
    })
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarSembrio() {
    this.panelAdministracionService.actualizarSembrio(
      this.idComunidad,
      this.idSembrio,
      this.myForm.get('_sembrio').value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          this.limpiarCampos();
          this.consultarSembrios();
          this.testButton.nativeElement.value = 'ingresar';
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

  limpiarCampos() {
    this.myForm.reset();
    this.comunidad = 'Comunidad';
  }

  get _sembrio() {
    return this.myForm.get('_sembrio');
  }

  ngOnInit() {
    this.consultarSembrios();
  }

  tablaSembrios = ['sembrio', 'comunidad', 'acciones'];
  tablaComunidades = ['comunidad', 'acciones'];

}
