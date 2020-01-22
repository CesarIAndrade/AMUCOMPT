import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';
import { PersonaService } from 'src/app/services/persona.service';
import { Parroquia } from 'src/app/interfaces/parroquia/parroquia';
import { Canton } from 'src/app/interfaces/canton/canton';
import sweetalert from 'sweetalert';


@Component({
  selector: 'app-parroquia',
  templateUrl: './parroquia.component.html',
  styleUrls: ['./parroquia.component.css']
})
export class ParroquiaComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

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

  parroquias: Parroquia[] = [];
  filterParroquia = '';
  filterCanton = '';
  cantones: Canton[] = [];

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
        this.testButton.nativeElement.value = 'ingresar';
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
          this.limpiarCampos();
          this.consultarParroquias();
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
          this.limpiarCampos();
          this.consultarParroquias();
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
                sweetAlert("Se a eliminado Correctamente!", {
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

}
