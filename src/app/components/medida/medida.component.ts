import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Interfaces
import { Medida } from 'src/app/interfaces/medida/medida';

// Services
import { InventarioService } from 'src/app/services/inventario.service';

@Component({
  selector: 'app-medida',
  templateUrl: './medida.component.html',
  styleUrls: ['./medida.component.css']
})
export class MedidaComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(private inventarioService: InventarioService) { 
    this.myForm = new FormGroup({
      _medida: new FormControl('', [Validators.required])
    })
  }

  filterMedida = '';
  idMedida = '0';
  botonIngresar = 'ingresar';

  medidas: Medida[] = [];

  consultarMedidas(){
    this.inventarioService.consultarMedidas(
      localStorage.getItem('miCuenta.getToken')
    )
    .then(
      ok => {
        this.medidas = [];
        this.medidas = ok['respuesta'];
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
        this.crearMedida();
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarMedida();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearMedida() {
    this.inventarioService.crearMedida(
      this.myForm.get('_medida').value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          this.myForm.reset();
          this.consultarMedidas();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarMedida(medida) {
    this.idMedida = medida.IdMedida;
    this.myForm.setValue({
      _medida: medida.Descripcion
    })
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarMedida() {
    this.inventarioService.actualizarMedida(
      this.idMedida,
      this.myForm.get('_medida').value,
      localStorage.getItem('miCuenta.putToken')
    )
    .then(
      ok => {
        this.myForm.reset();
        this.testButton.nativeElement.value = 'ingresar';
        this.consultarMedidas();
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
  }

  eliminarMedida(idMedida) {
    this.inventarioService.eliminarMedida(
      idMedida,
      localStorage.getItem('miCuenta.deleteToken')
    )
    .then(
      ok => {
        this.consultarMedidas();
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
  }
  
  get _medida() {
    return this.myForm.get('_medida');
  }

  ngOnInit() {
    this.consultarMedidas();
  }

  tablaMedidas = ['descripcion', 'acciones'];

}
