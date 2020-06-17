import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UsuarioService } from "src/app/services/usuario.service";
import { MatDialog } from "@angular/material";
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";

@Component({
  selector: "app-cuenta",
  templateUrl: "./cuenta.component.html",
  styleUrls: ["./cuenta.component.css"],
})
export class CuentaComponent implements OnInit {
  myForm: FormGroup;
  constructor(
    private usuarioService: UsuarioService,
    public dialog: MatDialog
  ) {
    this.myForm = new FormGroup({
      _correo: new FormControl(""),
      _usuario: new FormControl(""),
      _contrasena: new FormControl(""),
    });
  }

  nombres: string;
  tipoUsuario: string;

  openDialog(mensaje): void {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: "250px",
      data: { mensaje: mensaje },
    });
  }

  async modificarDatos() {
    var modificarContacto = await this.usuarioService.actualizarTelefonoCorreo(
      localStorage.getItem("miCuenta.idPersona"),
      this.myForm.get("_correo").value
    );
    var modificarContrasena = await this.usuarioService.actualizarUsuario(
      this.usuario.IdUsuario,
      this.usuario.PersonaEntidad.IdPersona,
      this.myForm.get("_usuario").value,
      this.myForm.get("_contrasena").value
    );
    console.log(modificarContacto);
    if (
      modificarContacto["codigo"] == "200" &&
      modificarContrasena["codigo"] == "200"
    ) {
      this.openDialog("Datos actualizados");
    }
  }

  usuario: any = [];
  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.nombres =
      this.usuario.PersonaEntidad.PrimerNombre +
      " " +
      this.usuario.PersonaEntidad.ApellidoPaterno;
    this.tipoUsuario = localStorage.getItem("miCuenta.descripcionTipoUsuario");
    this.myForm
      .get("_correo")
      .setValue(this.usuario.PersonaEntidad.ListaCorreo[0].CorreoValor);
    this.myForm.get("_usuario").setValue(this.usuario.UsuarioLogin);
    this.myForm.get("_usuario").disable();
  }
}
