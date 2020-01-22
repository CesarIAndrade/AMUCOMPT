import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { UsuarioService } from 'src/app/services/usuario.service';
import { SeguridadService } from '../../services/seguridad.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { TipoUsuario } from 'src/app/interfaces/tipo-usuario/tipo-usuario';

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
    })
  }

  tipoUsuario = '0';
  selectTipoUsuario = true;
  credendialesIncorrectasInput = true;
  seleccionarTipoUsuario = true;
  ingresarCredenciales = false;

  onChangeSelectTipoUsuario(value) {
    if (value != '0') {
      this.selectTipoUsuario = true;
    }
  }

  usuarios: Usuario[] = [];
  tipoUsuarios: TipoUsuario[] = [];

  login() {
    if (this.myForm.valid) {
      this.usuarioService.login(
        this.myForm.get('_usuario').value,
        this.myForm.get('_contrasena').value,
        localStorage.getItem('miCuenta.getToken')
      )
        .then(
          ok => {
            if (ok['codigo'] == '200') {
              this.tipoUsuarios = ok['respuesta']['ListaTipoUsuario'];
              this.ingresarCredenciales = true;
              this.seleccionarTipoUsuario = false;
              this.consultarTokens();
            } else {
              this.credendialesIncorrectasInput = false;
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
    if (this.tipoUsuario == '0') {
      this.selectTipoUsuario = false;
    } else {
      localStorage.setItem('miCuenta.idAsignacionTipoUsuario', this.tipoUsuario);
      this.router.navigateByUrl('inicio');
    }
  }

  credendialesIncorrectas() {
    this.credendialesIncorrectasInput = true
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

  ngOnInit() {
  }

}
