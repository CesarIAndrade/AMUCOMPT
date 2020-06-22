import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { openDialog } from "../../functions/global";

// Material
import { MatDialog } from '@angular/material';

// Services
import { UsuarioService } from "src/app/services/usuario.service";
import { SeguridadService } from "../../services/seguridad.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private seguridadService: SeguridadService,
    private dialog: MatDialog,
  ) {
    this.myForm = new FormGroup({
      _usuario: new FormControl("", [Validators.required]),
      _contrasena: new FormControl("", [Validators.required]),
      _tipoUsuario: new FormControl("0", [Validators.required]),
    });
  }

  myForm: FormGroup;
  seleccionarTipoUsuario = true;
  ingresarCredenciales = false;
  tipoUsuarios: any[] = [];

  async login() {
    if (this.myForm.valid) {
      var login = await this.usuarioService.login(
        this.myForm.get("_usuario").value,
        this.myForm.get("_contrasena").value
      );
      console.log(login);
      if (login["codigo"] == "200") {
        this.seleccionarTipoUsuario = false;
        this.ingresarCredenciales = true;
        localStorage.setItem("usuario", JSON.stringify(login["respuesta"]));
        localStorage.setItem("token", login["Token"]);
        this.tipoUsuarios = login["respuesta"]["ListaTipoUsuario"];
      } else {
        this.myForm.reset();
        this.myForm.get("_tipoUsuario").setValue("0");
        openDialog("Credenciales Incorrectas!", "advertencia", this.dialog);
      }
    }
  }

  iniciarSesionSegunTipoUsuario() {
    if (this.myForm.get("_tipoUsuario").value == "0") {
      openDialog("Seleccione Tipo Usuario!", "advertencia", this.dialog);
    } else {
      localStorage.setItem(
        "miCuenta.idAsignacionTipoUsuario",
        this.myForm.get("_tipoUsuario").value
      );
      var tipoUsuario = this.tipoUsuarios.find(
        (item) => item.IdAsignacionTu == this.myForm.get("_tipoUsuario").value
      );
      localStorage.setItem(
        "miCuenta.descripcionTipoUsuario",
        tipoUsuario.Descripcion
      );
      localStorage.setItem("miCuenta.tipoUsuario", tipoUsuario.Identificacion);
      this.router.navigateByUrl("/");
    }
  }

  async consultarTokens() {
    var tokens = await this.seguridadService.consultarTokens();
    console.log(tokens);

    // .then((ok) => {
    //   this.ingresarCredenciales = true;
    //   this.seleccionarTipoUsuario = false;
    //   localStorage.setItem(
    //     "miCuenta.getToken",
    //     ok["respuesta"]["ClaveGetEncrip"]
    //   );
    //   localStorage.setItem(
    //     "miCuenta.postToken",
    //     ok["respuesta"]["ClavePostEncrip"]
    //   );
    //   localStorage.setItem(
    //     "miCuenta.putToken",
    //     ok["respuesta"]["ClavePutEncrip"]
    //   );
    //   localStorage.setItem(
    //     "miCuenta.deleteToken",
    //     ok["respuesta"]["ClaveDeleteEncrip"]
    //   );
    // })
    // .catch((error) => console.log(error));
  }

  ngOnInit() {}
}
