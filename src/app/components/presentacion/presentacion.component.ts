import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Interfaces
import { Presentacion } from 'src/app/interfaces/presentacion/presentacion';

// Services
import { InventarioService } from 'src/app/services/inventario.service';
import { error } from 'protractor';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css']
})
export class PresentacionComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(private inventarioService: InventarioService) {
    this.myForm = new FormGroup({
      _presentacion: new FormControl('', [Validators.required])
    })
  }

  idPresentacion = '0';
  botonIngresar = 'ingresar';
  filterPresentacion = '';

  presentaciones: Presentacion[] = [];

  consultarPresentaciones() {
    this.inventarioService.consultarPresentaciones(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.presentaciones = [];
          this.presentaciones = ok['respuesta'];
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
        this.crearPresentacion();
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarPresentacion();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearPresentacion() {
    this.inventarioService.crearPresentacion(
      this.myForm.get('_presentacion').value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          this.myForm.reset();
          this.consultarPresentaciones();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarPresentacion(presentacion) {
    this.idPresentacion = presentacion.IdPresentacion;
    this.myForm.setValue({
      _presentacion: presentacion.Descripcion
    })
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarPresentacion() {
    this.inventarioService.actualizarPresentacion(
      this.idPresentacion,
      this.myForm.get('_presentacion').value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          this.myForm.reset();
          this.testButton.nativeElement.value = 'ingresar';
          this.consultarPresentaciones();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarPresentacion(idPresentacion) {
    this.inventarioService.eliminarPresentacion(
      idPresentacion,
      localStorage.getItem('miCuenta.deleteToken')
    )
      .then(
        ok => {
          this.consultarPresentaciones();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  get _presentacion() {
    return this.myForm.get('_presentacion');
  }

  ngOnInit() {
    this.consultarPresentaciones();
  }

  tablaPresentaciones = ['descripcion', 'acciones'];

}
