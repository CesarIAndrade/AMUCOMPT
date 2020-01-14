import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TipoUsuario } from 'src/app/interfaces/tipo-usuario/tipo-usuario';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsignacionTipoUsuario } from 'src/app/interfaces/asignacion-tipo-usuario/asignacion-tipo-usuario';

@Component({
  selector: 'app-modal-asignacion-usuario-tipos-usuario',
  templateUrl: './modal-asignacion-usuario-tipos-usuario.component.html',
  styleUrls: ['./modal-asignacion-usuario-tipos-usuario.component.css']
})
export class ModalAsignacionUsuarioTiposUsuarioComponent implements OnInit {

  constructor(
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  @ViewChild('testSelect', { static: false }) testSelect: ElementRef;

  botonEliminar = false;
  idUsuario = this.data.idUsuario;
  tipoUsuario = '0';
  tipoUsuarios: TipoUsuario[] = [];
  listaTipoUsuario = this.data.listaTipoUsuario;
  idTipoUsuario: string;
  descripcion: string;

  agregarTipoUsuarioALista(tipoUsuario) {
    this.consultarTipoUsuario();
    this.idTipoUsuario = tipoUsuario.target.value;
    this.descripcion = tipoUsuario.target.selectedOptions[0].label;
    if (tipoUsuario.target.value != 0) {
      this.testSelect.nativeElement.disabled = true;
      this.botonEliminar = true;
    }
  }

  asignarTipoUsuario() {
    this.usuarioService.asignacionTipoUsuario(
      this.idUsuario,
      this.tipoUsuario,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          console.log(ok['respuesta']);
          if (ok['respuesta'] == true) {
            this.tipoUsuario = '0';
            this.listaTipoUsuario.push({
              IdTipoUsuario: this.idTipoUsuario,
              Descripcion: this.descripcion
            })
            this.testSelect.nativeElement.disabled = false;
            this.botonEliminar = false;
            this.consultarTipoUsuario();
          };
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarTipoUsuarioDeLista(tipoUsuario) {
    const index = this.listaTipoUsuario.indexOf(tipoUsuario);
    console.log(index);
    if (index >= 0) {
      this.listaTipoUsuario.splice(index, 1);
    }
    this.eliminarAsignacionTipoUsuario(tipoUsuario);
  }

  eliminarAsignacionTipoUsuario(tipoUsuario) {
    this.usuarioService.eliminarAsignacionTipoUsuario(
      tipoUsuario.IdAsignacionTu,
      localStorage.getItem('miCuenta.deleteToken'))
      .then(
        ok => {
          console.log(ok['respuesta']);
          this.consultarTipoUsuario();
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarTipoUsuario() {
    this.usuarioService.consultarTipoUsuario(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
            ok['respuesta'].map(
              item => {
                if (!this.arrayIndexesTipoUsuario.includes(item.IdTipoUsuario)) {
                  this.tipoUsuarios.push({
                    IdTipoUsuario: item.IdTipoUsuario,
                    Descripcion: item.Descripcion
                  });
                }
              }
            )
        }
      )
      .catch(
        error => {
          console.log(error)
        }
      )
  }

  arrayIndexesTipoUsuario = [];
  ngOnInit() {
    this.consultarTipoUsuario();
    this.listaTipoUsuario.map(
      item => {
        this.arrayIndexesTipoUsuario.push(item.IdTipoUsuario);
      }
    )
  }
}
