import { Component, OnInit, Inject } from "@angular/core";

// Material
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from "@angular/material/dialog";

// Services
import { UsuarioService } from "src/app/services/usuario.service";
import { ModalReasignarClientesComponent } from "../modal-reasignar-clientes/modal-reasignar-clientes.component";

@Component({
  selector: "app-modal-asignacion-usuario-tipos-usuario",
  templateUrl: "./modal-asignacion-usuario-tipos-usuario.component.html",
  styleUrls: ["./modal-asignacion-usuario-tipos-usuario.component.css"],
})
export class ModalAsignacionUsuarioTiposUsuarioComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modalAsignacionUsuarioTiposUsuarioComponent: MatDialogRef<
      ModalAsignacionUsuarioTiposUsuarioComponent
    >,
    private dialog: MatDialog
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
      this.data.usuario.IdUsuario,
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
      this.data.usuario.IdUsuario
    );
    if (tipoUsuarios["codigo"] == "200") {
      this.listaTipoUsuario = tipoUsuarios["respuesta"];
      if (this.listaTipoUsuario.length == 0) {
        this.modalAsignacionUsuarioTiposUsuarioComponent.disableClose = true;
      } else {
        this.modalAsignacionUsuarioTiposUsuarioComponent.disableClose = false;
      }
    }
  }

  async consultarTipoUsuariosSinAsignar() {
    var tipoUsuarios = await this.usuarioService.consultarTipoUsuariosSinAsignar(
      this.data.usuario.IdUsuario
    );
    if (tipoUsuarios["codigo"] == "200") {
      this.tipoUsuarios = tipoUsuarios["respuesta"];
    }
  }
 
  reasignarClientes() {
    const dialogRef = this.dialog.open(ModalReasignarClientesComponent, {
      width: "350px",
      height: "auto",
      data: {
        usuario: this.data.usuario, 
      }, 
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (result.flag) {
          this.consultarTipoUsuariosAsignados();
        }
      }
    });
  }

  async eliminarTipoUsuario(idTipoUsuario, flag?) {
    var respuesta = await this.usuarioService.eliminarTipoUsuario(
      idTipoUsuario
    );
    if (respuesta["codigo"] == "200") {
      this.consultarTipoUsuariosAsignados();
      this.consultarTipoUsuariosSinAsignar();
      if(flag) {
        this.modalAsignacionUsuarioTiposUsuarioComponent.close(
          respuesta["mensaje"]
        );
      }
    } else if (respuesta["codigo"] == "201") {
      this.modalAsignacionUsuarioTiposUsuarioComponent.close(
        respuesta["mensaje"]
      );
    } else if (respuesta["codigo"] == "409") {
      this.reasignarClientes();
    }
  }

  ngOnInit() {
    this.consultarTipoUsuariosAsignados();
    this.consultarTipoUsuariosSinAsignar();
  }

  tablaTipoUsuarios = ["tipoUsuario", "acciones"];
}
