import { Component, OnInit, Inject } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  botonEliminar = false;
  idUsuario = this.data.idUsuario;
  tipoUsuario: string;
  tipoUsuarios: any[] = [];
  listaTipoUsuario = this.data.listaTipoUsuario;
  descripcion: string;
  tipoUsuarioSelecionado = true;

  agregarTipoUsuarioALista(tipoUsuario) {
    this.tipoUsuarioSelecionado = false;
    var descripcion = this.tipoUsuarios.find(item => item.IdTipoUsuario == tipoUsuario.value);
    this.tipoUsuario = tipoUsuario.value;
    this.descripcion = descripcion.Descripcion;
    if (tipoUsuario.value != 0) {
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
          if (ok['respuesta']) {
            this.listaTipoUsuario.push({
              IdTipoUsuario: this.tipoUsuario,
              Descripcion: this.descripcion
            })
            this.tipoUsuario = '0';
            this.botonEliminar = false;
            this.tipoUsuarioSelecionado = true;
          };
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      ).finally(() => {
        this.consultarAsignacionTipoUsuario();
      })
  }

  eliminarTipoUsuarioDeLista(tipoUsuario) {
    const index = this.listaTipoUsuario.indexOf(tipoUsuario);
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
          this.consultarAsignacionTipoUsuario();
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
          this.tipoUsuarios = [];
          ok['respuesta'].map(
            item => {
              if (!this.arrayIndexesTipoUsuario.includes(item.Identificacion)) {
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

  consultarAsignacionTipoUsuario() {
    this.usuarioService.consultarAsignacionTipoUsuario(
      this.idUsuario,
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.arrayIndexesTipoUsuario = [];
          this.listaTipoUsuario = [];
          this.listaTipoUsuario = ok['respuesta'];
          ok['respuesta'].map(
            item => {
              this.arrayIndexesTipoUsuario.push(item.Identificacion);
            }
          )
          this.consultarTipoUsuario();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  arrayIndexesTipoUsuario: string[] = [];
  ngOnInit() {
    this.consultarTipoUsuario();
    this.listaTipoUsuario.map(
      item => {
        this.arrayIndexesTipoUsuario.push(item.Identificacion);
      }
    )
  }

  tablaTipoUsuarios = ['tipoUsuario', 'acciones'];
}
