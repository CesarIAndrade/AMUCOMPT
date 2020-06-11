import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { UsuarioService } from "src/app/services/usuario.service";

@Component({
  selector: "app-modal-reasignar-clientes",
  templateUrl: "./modal-reasignar-clientes.component.html",
  styleUrls: ["./modal-reasignar-clientes.component.css"],
})
export class ModalReasignarClientesComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usuarioService: UsuarioService,
    private modalReasignarClientesComponent: MatDialogRef<ModalReasignarClientesComponent>
  ) {}

  idAsignacionTu: string;
  idTecnico: string;
  tecnicos: any[] = [];

  async consultarTecnicos() {
    var respuesta = await this.usuarioService.consultarTecnicos("2");
    if (respuesta["codigo"] == "200") {
      for (let tecnico of respuesta["respuesta"]) {
        if (tecnico.IdPersona == this.data.usuario.IdPersona) {
          continue;
        } else {
          this.tecnicos.push({
            _id: tecnico.AsignacionTipoUsuario.IdAsignacionTUEncriptada,
            nombres:
              tecnico.PrimerNombre +
              " " +
              tecnico.SegundoNombre +
              " " +
              tecnico.ApellidoPaterno +
              " " +
              tecnico.ApellidoMaterno,
          });
        }
      }
    }
  } 

  async consultarTipoUsuariosAsignados() {
    var tipoUsuarios = await this.usuarioService.consultarTipoUsuariosAsignados(
      this.data.usuario.IdUsuario
    );
    if (tipoUsuarios["codigo"] == "200") {
      tipoUsuarios["respuesta"].map((tipoUsuario) => {
        if(tipoUsuario.TipoUsuario.Descripcion == "TECNICO"){
          this.idAsignacionTu = tipoUsuario.IdAsignacionTUEncriptada;
        }
      })
    }
  }

  seleccionarTecnico(idTecnico) {
    this.idTecnico = idTecnico;
  }

 async reasignarClientes() {
    var respuesta = await this.usuarioService.reasignarClientes(
      this.idAsignacionTu,
      this.idTecnico
    );
    if(respuesta["codigo"] == "200") {
      this.modalReasignarClientesComponent.close({
        flag: true,
        usuario: this.data.usuario
      });
    }
  }

  ngOnInit() {
    this.consultarTecnicos();
    this.consultarTipoUsuariosAsignados();
  }
}
