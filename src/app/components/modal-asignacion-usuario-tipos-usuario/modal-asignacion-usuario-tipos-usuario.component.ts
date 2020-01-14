import { Component, OnInit, Inject } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TipoUsuario } from 'src/app/interfaces/tipo-usuario/tipo-usuario';
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
  ) { 
    console.log(data);
  }

  idUsuario = this.data.idUsuario;
  tablaTiposUsuario: TipoUsuario[] = [];
  tipoUsuario = '0';
  tipoUsuarios: TipoUsuario[] = [];

  agregarTipoUsuarioALista(tipoUsuario){
    this.tablaTiposUsuario.push({
      IdTipoUsuario: tipoUsuario.target.value,
      Descripcion: tipoUsuario.target.selectedOptions[0].label
    })
    const index = this.tipoUsuarios.indexOf(tipoUsuario);
    if (index >= 0) {
      this.tipoUsuarios.splice(index, 1);
      this.tipoUsuario = '0';
    }
  }

  eliminarTipoUsuarioDeLista(tipoUsuario){
    const index = this.tablaTiposUsuario.indexOf(tipoUsuario);
    if (index >= 0) {
      this.tablaTiposUsuario.splice(index, 1);
      this.tipoUsuario = '0';
    }
    this.tipoUsuarios.push({
      IdTipoUsuario: tipoUsuario.target.value,
      Descripcion: tipoUsuario.target.selectedOptions[0].label
    })
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
