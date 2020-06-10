import { Component, OnInit, Inject } from "@angular/core";
import { UsuarioService } from "src/app/services/usuario.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-modal-asignacion-usuario-tipos-usuario",
  templateUrl: "./modal-asignacion-usuario-tipos-usuario.component.html",
  styleUrls: ["./modal-asignacion-usuario-tipos-usuario.component.css"],
})
export class ModalAsignacionUsuarioTiposUsuarioComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  botonEliminar = false;
  tipoUsuarios: any[] = [];
  listaTipoUsuario: any[] = [];
  tipoUsuario: string;
  tipoUsuarioSelecionado = true;

  seleccionarTipoUsuario(event) {    
    this.tipoUsuario = event.value;
    this.tipoUsuarioSelecionado = false;
  }

  async asignarTipoUsuario() {
    var respuesta = await this.usuarioService.asignacionTipoUsuario(
      this.data.idUsuario,
      this.tipoUsuario
    );
    console.log(respuesta);
    if (respuesta["codigo"] == "200") {
      this.tipoUsuario = "0";
      this.botonEliminar = false;
      this.tipoUsuarioSelecionado = true;
      this.consultarTipoUsuariosAsignados();
      this.consultarTipoUsuariosSinAsignar();
    }
  }

  async consultarTipoUsuariosAsignados() {
    var tipoUsuarios = await this.usuarioService.consultarTipoUsuariosAsignados(
      this.data.idUsuario
    );
    if (tipoUsuarios["codigo"] == "200") {
      this.listaTipoUsuario = tipoUsuarios["respuesta"];
    }
  }

  async consultarTipoUsuariosSinAsignar() {
    var tipoUsuarios = await this.usuarioService.consultarTipoUsuariosSinAsignar(
      this.data.idUsuario
    );
    if (tipoUsuarios["codigo"] == "200") {
      this.tipoUsuarios = tipoUsuarios["respuesta"];
    }
  }

  async eliminarTipoUsuario(idTipoUsuario) {
    var respuesta = await this.usuarioService.eliminarTipoUsuario(
      idTipoUsuario
    );
    console.log(respuesta);
    if (respuesta["codigo"] == "200") {
      this.consultarTipoUsuariosAsignados();
      this.consultarTipoUsuariosSinAsignar();
    }
  }

  ngOnInit() {
    this.consultarTipoUsuariosAsignados();
    this.consultarTipoUsuariosSinAsignar();
  }

  tablaTipoUsuarios = ["tipoUsuario", "acciones"];
}
