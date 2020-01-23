import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';
import { PersonaService } from 'src/app/services/persona.service';
import { Provincia } from 'src/app/interfaces/provincia/provincia';
import sweetalert from 'sweetalert';

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.css']
})
export class ProvinciaComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;
  @Output() nuevaProvinciaCreada = new EventEmitter();

  constructor(private panelAdministracionService: PanelAdministracionService,
    private personaService: PersonaService
  ) {
    this.myForm = new FormGroup({
      _provincia: new FormControl('', [Validators.required])
    })
  }

  idProvincia = '0';
  botonIngresar = 'ingresar';

  provincias: Provincia[] = [];
  filterProvincia = '';
  valorIdProvincia: string;
  
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
          this.nuevaProvinciaCreada.emit(true);
          this.limpiarCampos();
          this.consultarProvincias();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarProvincias() {
    this.personaService.consultarProvincias(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.provincias = [];
          this.provincias = ok['respuesta'];
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  setProvincia(value) {
    this.valorIdProvincia = value.IdProvincia;
    this.myForm.setValue({
      _provincia: value.Descripcion
    })
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarProvincia() {
    this.panelAdministracionService.actualizarProvincia(
      this.valorIdProvincia,
      this.myForm.get('_provincia').value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          this.limpiarCampos();
          this.consultarProvincias();
          //console.log(ok['respuesta']);
          console.log(this.valorIdProvincia);
          console.log(this.myForm.get('_provincia').value);
          console.log(localStorage.getItem('miCuenta.putToken'));
          
          
          
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarProvincia(idProvincia: string) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.panelAdministracionService.eliminarProvincia(
            idProvincia,
            localStorage.getItem('miCuenta.deleteToken'))
          .then(
            ok => {
              if(ok['respuesta']){
                sweetAlert("Se a eliminado Correctamente!", {
                  icon: "success",
                });
                this.consultarProvincias();
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

  limpiarCampos() {
    this.myForm.reset();
  }

  get _provincia() {
    return this.myForm.get('_provincia');
  }

  ngOnInit() {
    this.provincias = [];
    this.consultarProvincias();
  }

  tablaProvincias = ['provincia', 'acciones'];

}