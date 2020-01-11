import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { UsuarioService } from 'src/app/services/usuario.service';
import { SeguridadService } from '../../services/seguridad.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from 'src/app/interfaces/usuario/usuario';

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

  usuarios: Usuario[] = [];
  credendialesIncorrectasInput = true;

  login() {
    if (this.myForm.valid) {
      this.consultarTokens();
      this.usuarioService.login(
        this.myForm.get('_usuario').value,
        this.myForm.get('_contrasena').value,
        localStorage.getItem('miCuenta.getToken')
      )
        .then(
          ok => {
            if(ok['codigo'] == '200'){
              this.router.navigateByUrl('inicio');
            } else {
              this.credendialesIncorrectasInput = false;
            }
          })
        .catch(
          err => console.log(err)
        )
    } else {
      console.log('Algo salio mal');
    }
  }

  credendialesIncorrectas() {
    this.credendialesIncorrectasInput = true
  }

  consultarTokens() {
    this.seguridadService.consultarTokens()
      .then(
        ok => {
          console.log(ok['respuesta']);
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
    this.usuarioService.consultarUsuarios(
      _token
    )
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
    // setTimeout(() => {
    //   document.getElementById('loadingPage').hidden = true;
    // }, 1000);
    this.consultarTokens();
  }

}
