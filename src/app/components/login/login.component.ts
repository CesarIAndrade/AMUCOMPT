import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

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
    private seguridadService: SeguridadService
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

  usuarios: any[] = [];
  tipoUsuarios: any[] = [];

  login() {
    if (this.myForm.valid) {
      this.usuarioService
        .login(
          this.myForm.get("_usuario").value,
          this.myForm.get("_contrasena").value,
          localStorage.getItem("miCuenta.getToken")
        )
        .then((ok) => {
          console.log(ok["respuesta"]);
          
          if (ok["codigo"] == "200") {
            this.tipoUsuarios = ok["respuesta"]["ListaTipoUsuario"];
          } else {
            sweetAlert("Credenciales Incorrectas", {
              icon: "error",
            });
            this.myForm.reset();
          }
        })
        .catch((error) => console.log(error))
        .finally(() => this.consultarTokens());
    } else {
      sweetAlert("Algo salio mal!", {
        icon: "error",
      });
    }
  }

  iniciarSesionSegunTipoUsuario() {
    if (this.myForm.get("_tipoUsuario").value == "0") {
      sweetAlert("Seleccione Tipo Usuario", {
        icon: "warning",
      });
    } else {
      localStorage.setItem(
        "miCuenta.idAsignacionTipoUsuario",
        this.myForm.get("_tipoUsuario").value
      );
      var tipoUsuario = this.tipoUsuarios.filter(
        (item) => item.IdAsignacionTu == this.myForm.get("_tipoUsuario").value
      );
      localStorage.setItem(
        "miCuenta.tipoUsuario",
        tipoUsuario[0].Identificacion
      );
      this.router.navigateByUrl("/");
    }
  }

  consultarTokens() {
    this.seguridadService
      .consultarTokens()
      .then((ok) => {
        this.ingresarCredenciales = true;
        this.seleccionarTipoUsuario = false;
        localStorage.setItem(
          "miCuenta.getToken",
          ok["respuesta"]["ClaveGetEncrip"]
        );
        localStorage.setItem(
          "miCuenta.postToken",
          ok["respuesta"]["ClavePostEncrip"]
        );
        localStorage.setItem(
          "miCuenta.putToken",
          ok["respuesta"]["ClavePutEncrip"]
        );
        localStorage.setItem(
          "miCuenta.deleteToken",
          ok["respuesta"]["ClaveDeleteEncrip"]
        );
      })
      .catch((error) => console.log(error));
  }

  consultarUsuarios(_token: string) {
    this.usuarioService
      .consultarUsuarios(_token)
      .then((ok) => {
        this.usuarios = [];
        this.usuarios = ok["respuesta"];
      })
      .catch((error) => console.log(error));
  }

  ngOnInit() {}
}
