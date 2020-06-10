import { Component, OnInit, Inject } from "@angular/core";
import { UsuarioService } from "src/app/services/usuario.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-modal-asignacion-usuario-tipos-usuario",
  templateUrl: "./modal-asignacion-usuario-tipos-usuario.component.html",
  styleUrls: ["./modal-asignacion-usuario-tipos-usuario.component.css"],
})
export class ModalAsignacionUsuarioTiposUsuarioComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modalAsignacionUsuarioTiposUsuarioComponent: MatDialogRef<ModalAsignacionUsuarioTiposUsuarioComponent>,
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
      if(this.listaTipoUsuario.length == 0) {
        this.modalAsignacionUsuarioTiposUsuarioComponent.disableClose = true;
      } else {
        this.modalAsignacionUsuarioTiposUsuarioComponent.disableClose = false;
      }
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
    if (respuesta["codigo"] == "200") {
      this.consultarTipoUsuariosAsignados();
      this.consultarTipoUsuariosSinAsignar();
    } else if (respuesta["codigo"] == "201") {
      this.modalAsignacionUsuarioTiposUsuarioComponent.close(respuesta["mensaje"]);
    }
  }

  ngOnInit() {
    this.consultarTipoUsuariosAsignados();
    this.consultarTipoUsuariosSinAsignar();
  }

  tablaTipoUsuarios = ["tipoUsuario", "acciones"];
}
