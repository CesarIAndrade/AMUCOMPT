import { Component, OnInit, Inject } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TipoUsuario } from 'src/app/interfaces/tipo-usuario/tipo-usuario';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TiposUsuario } from '../usuario/usuario.component';

@Component({
  selector: 'app-modal-asignacion-usuario-tipos-usuario',
  templateUrl: './modal-asignacion-usuario-tipos-usuario.component.html',
  styleUrls: ['./modal-asignacion-usuario-tipos-usuario.component.css']
})
export class ModalAsignacionUsuarioTiposUsuarioComponent implements OnInit {

  constructor(
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: TiposUsuario
  ) { }

  idUsuario: string;
  tiposUsuario: TipoUsuario[] = [];
  tipoUsuario = '0';
  tipoUsuarios: TipoUsuario[] = [];

  agregarTipoUsuarioALista(tipoUsuario){
    this.tiposUsuario.push({
      IdTipoUsuario: tipoUsuario.target.value,
      Descripcion: tipoUsuario.target.selectedOptions[0].label
    })
  }

  eliminarTipoUsuarioDeLista(tipoUsuario){
    const index = this.tiposUsuario.indexOf(tipoUsuario);
    if (index >= 0) {
      this.tiposUsuario.splice(index, 1);
      this.tipoUsuario = '0';
    }
  }

  consultarTipoUsuario() {
    this.usuarioService.consultarTipoUsuario(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoUsuarios = ok['respuesta']
        }
      )
      .catch(error => console.log(error))
  }

  ngOnInit() {
    this.consultarTipoUsuario();
  }

}
