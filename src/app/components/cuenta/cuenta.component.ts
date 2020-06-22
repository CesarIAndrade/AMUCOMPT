import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { salir, openDialog} from '../../functions/global';

// Components
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

// Material
import { MatDialog } from "@angular/material";

// Services
import { UsuarioService } from "src/app/services/usuario.service";
import { SeguridadService } from "src/app/services/seguridad.service";

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
    private router: Router,
    private seguridadService: SeguridadService
  ) {
    this.myForm = new FormGroup({
      _correo: new FormControl(""),
      _usuario: new FormControl(""),
      _contrasena: new FormControl("", [Validators.minLength(8)]),
    });
  }

  nombres: string;
  tipoUsuario: string;
  inputType = "password";

  async modificarDatos() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "Se cerrará su sessión actual",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var modificarCorreo = await this.usuarioService.actualizarCorreo(
          this.usuario.PersonaEntidad.IdPersona,
          this.myForm.get("_correo").value
        );
        var modificarContrasena = await this.usuarioService.actualizarUsuario(
          this.usuario.IdUsuario,
          this.usuario.PersonaEntidad.IdPersona,
          this.myForm.get("_usuario").value,
          this.myForm.get("_contrasena").value,
          "1"
        );
        if (
          modificarCorreo["codigo"] == "200" &&
          modificarContrasena["codigo"] == "200"
        ) {
          this.salir();
        }
      }
    });
  }

  salir() {
    this.seguridadService.refresh$.emit();
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
    if (localStorage.getItem("token")) {
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
      this.nombres =
        this.usuario.PersonaEntidad.PrimerNombre +
        " " +
        this.usuario.PersonaEntidad.ApellidoPaterno;
      this.tipoUsuario = localStorage.getItem(
        "miCuenta.descripcionTipoUsuario"
      );
      try {
        this.myForm
          .get("_correo")
          .setValue(this.usuario.PersonaEntidad.ListaCorreo[0].CorreoValor);
      } catch (error) {
        this.myForm.get("_correo").setValue("Sin correo");
      }
      this.myForm.get("_usuario").setValue(this.usuario.UsuarioLogin);
      this.myForm.get("_usuario").disable();
    } else {
      openDialog("Sesión Caducada", "advertencia", this.dialog);
      this.router.navigateByUrl(salir())
    }
  } 
}
