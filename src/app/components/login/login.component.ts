import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { UsuarioService } from 'src/app/services/usuario.service';
import { SeguridadService } from '../../services/seguridad.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private usuarioService: UsuarioService,
    private router: Router,
    private seguridadService: SeguridadService) {
  }

  usuario: string;
  contrasena: string;

  ngOnInit() {
    setTimeout(() => {
      document.getElementById('loadingPage').hidden = true;
    }, 1000);
    this.consultarTokens();
  }

  login() {
    if (this.usuario != "" && this.contrasena != "" && localStorage.getItem('miCuenta.postToken') != null) {
      this.usuarioService.login(
        this.usuario,
        this.contrasena,
        localStorage.getItem('miCuenta.postToken')
      )
        .then(
          ok => {
            console.log(ok);
            this.router.navigateByUrl('inicio');
          })
        .catch(
          err => console.log(err)
        )
    }
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

}
