import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';

// Components
import { ComfirmDialogComponent } from "../comfirm-dialog/comfirm-dialog.component";

// Material
import { MatDialog } from "@angular/material";

// Services
import { UsuarioService } from "src/app/services/usuario.service";

@Component({
  selector: "app-cuenta",
  templateUrl: "./cuenta.component.html",
  styleUrls: ["./cuenta.component.css"],
})
export class CuentaComponent implements OnInit {
  myForm: FormGroup;
  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.myForm = new FormGroup({
      _correo: new FormControl(""),
      _usuario: new FormControl(""),
      _contrasena: new FormControl(""),
    });
  }

  nombres: string;
  tipoUsuario: string;
  inputType = "password";

  async modificarDatos() {
    let dialogRef = this.dialog.open(ComfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "Se cerrará su sessión actual"
      }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
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
          // modificarContacto["codigo"] == "200" &&
          modificarContrasena["codigo"] == "200"
        ) {
          this.salir();
        }
      }
    });
  }

  salir() {
    localStorage.clear();
    this.router.navigateByUrl("/login");
  }

  mostrarContrasena() {
    if (this.inputType == "password") {
      this.inputType = "text";
    } else {
      this.inputType = "password";
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
