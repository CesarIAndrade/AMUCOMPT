import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';
import { PersonaService } from 'src/app/services/persona.service';
import { Provincia } from 'src/app/interfaces/provincia/provincia';

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.css']
})
export class ProvinciaComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(private panelAdministracionService: PanelAdministracionService,
    private personaService: PersonaService
  ) {
    this.myForm = new FormGroup({
      _provincia: new FormControl('', [Validators.required])
    })
  }

  idProvincia = '0';
  botonIngresar = 'ingresar';

  provincias: Provincia[] = [
    {
      IdProvincia: '1',
      Descripcion: 'Manabi'
    },
    {
      IdProvincia: '2',
      Descripcion: 'Guayas'
    }
  ]

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.testButton.nativeElement.value == 'ingresar') {
        this.crearProvincia();
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarProvincia();
        this.testButton.nativeElement.value = 'ingresar';
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearProvincia() {
    this.panelAdministracionService.crearProvincia(
      this.myForm.get('_provincia').value,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          console.log(ok['respuesta']);
          this.limpiarCampos();
          // this.consultarCantones();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarProvincia(provincia) {
    this.idProvincia = provincia.IdProvincia;
    this.myForm.setValue({
      _provincia: provincia.Descripcion
    })
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarProvincia() {
    this.panelAdministracionService.actualizarProvincia(
      this.idProvincia,
      this.myForm.get('_provincia').value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          console.log(ok['respuesta']);
          this.limpiarCampos();
          // this.consultarCantones();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarProvincia(idProvincia: string) {
    this.panelAdministracionService.eliminarProvincia(
      idProvincia,
      localStorage.getItem('miCuenta.deleteToken'))
    .then(
      ok => {
        console.log(ok['respuesta']);
        // this.consultarCantones();
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
  }

  limpiarCampos() {
    this.myForm.reset();
  }

  get _provincia() {
    return this.myForm.get('_provincia');
  }

  ngOnInit() {
  }

}
