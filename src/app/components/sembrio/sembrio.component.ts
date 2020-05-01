import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Services
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';

// SweetAlert
import sweetalert from 'sweetalert';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { ModalLocalidadSuperiorComponent } from '../modal-localidad-superior/modal-localidad-superior.component';

@Component({
  selector: 'app-sembrio',
  templateUrl: './sembrio.component.html',
  styleUrls: ['./sembrio.component.css']
})
export class SembrioComponent implements OnInit {

  myForm: FormGroup;
  
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private modalLocalidadSuperior: MatDialog
  ) {
    this.myForm = new FormGroup({
      _idSembrio: new FormControl(''),
      _sembrio: new FormControl('', [Validators.required]),
      _idComunidad: new FormControl('', [Validators.required]),
      _comunidad: new FormControl('')
    })
  }

  botonIngresar = 'ingresar';
  filterSembrio = '';

  // Para la paginacion
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  sembrios = new MatTableDataSource<Element[]>();
  

  consultarSembrios() {
    this.panelAdministracionService.consultarSembrios(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.sembrios.data = [];
          this.sembrios.data = ok['respuesta'];
          this.sembrios.paginator = this.paginator;
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

  abrirModal() {
    let dialogRef = this.modalLocalidadSuperior.open(ModalLocalidadSuperiorComponent, {
      width: '400px',
      height: 'auto',
      data: {
        ruta: 'sembrios'
      }
    }); 
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this._idComunidad.setValue(result.idLocalidad);
        this._comunidad.setValue(result.descripcion);
      }
    });
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

}
