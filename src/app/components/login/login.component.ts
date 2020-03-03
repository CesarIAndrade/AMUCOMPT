import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Services
import { UsuarioService } from 'src/app/services/usuario.service';
import { SeguridadService } from '../../services/seguridad.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  myForm: FormGroup;
  
  constructor(private usuarioService: UsuarioService,
    private router: Router,
    private seguridadService: SeguridadService
  ) {
    this.myForm = new FormGroup({
      _usuario: new FormControl('', [Validators.required]),
      _contrasena: new FormControl('', [Validators.required]),
      _tipoUsuario: new FormControl('0', [Validators.required])
    })
  }

  seleccionarTipoUsuario = true;
  ingresarCredenciales = false;

  usuarios: any[] = [];
  tipoUsuarios: any[] = [];

  login() {
    if (this.myForm.valid) {
      this.usuarioService.login(
        this._usuario.value,
        this._contrasena.value,
        localStorage.getItem('miCuenta.getToken')
      )
        .then(
          ok => {
            console.log(ok['respuesta']);
            if (ok['codigo'] == '200') {
              this.ingresarCredenciales = true;
              this.tipoUsuarios = ok['respuesta']['ListaTipoUsuario'];
              this.seleccionarTipoUsuario = false;
              this.consultarTokens();
            } else {
              sweetAlert("Credenciales Incorrectas", {
                icon: "error",
              });
              this.myForm.reset();
            }
          })
        .catch(
          error => {
            console.log(error);
          }
        )
    } else {
      console.log('Algo salio mal');
    }
  }

  iniciarSesionSegunTipoUsuario() {
    if (this.myForm.get('_tipoUsuario').value == '0') {
      sweetAlert("Seleccione Tipo Usuario", {
        icon: "warning",
      });
    } else {
      localStorage.setItem('miCuenta.idAsignacionTipoUsuario', this._tipoUsuario.value);
      console.log(localStorage.getItem('miCuenta.idAsignacionTipoUsuario'));
      this.router.navigateByUrl('inicio');
    }
  }

  consultarTokens() {
    this.seguridadService.consultarTokens()
      .then(
        ok => {
          localStorage.setItem('miCuenta.getToken', ok['respuesta']['ClaveGetEncrip']);
          localStorage.setItem('miCuenta.postToken', ok['respuesta']['ClavePostEncrip']);
          localStorage.setItem('miCuenta.putToken', ok['respuesta']['ClavePutEncrip']);
          localStorage.setItem('miCuenta.deleteToken', ok['respuesta']['ClaveDeleteEncrip']);
        })
      .catch(
        err => console.log(err)
      )
  }

  consultarUsuarios(_token: string) {
    this.usuarioService.consultarUsuarios(_token)
      .then(
        ok => {
          console.log(ok['respuesta']);
          this.usuarios = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  get _usuario() {
    return this.myForm.get('_usuario')
  }

  get _contrasena() {
    return this.myForm.get('_contrasena')
  }

  get _tipoUsuario() {
    return this.myForm.get('_tipoUsuario');
  }

  ngOnInit() {
  }

}
