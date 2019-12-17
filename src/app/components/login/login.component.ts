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

  constructor(private usuarioService:UsuarioService,
    private router:Router,
    private seguridadService: SeguridadService) {
   }

  usuario: string;
  contrasena: string;
  ngOnInit() {
    setTimeout(() => {
      document.getElementById("loadingPage").hidden=true;
    }, 1000);
    this.consultarTokens();
  }

  login(){
    if (this.usuario != "" && this.contrasena != "" && localStorage.getItem('miCuenta.postToken') != null) {
      this.usuarioService.login(this.usuario, this.contrasena, localStorage.getItem('miCuenta.postToken'))
        .subscribe(
          item => {
            console.log(item.respuesta);
            if (item.respuesta.Estado==true) {
              this.router.navigateByUrl('inicio');
            }
          },
          error => { console.log(error) }
        );
    }
  }

  consultarTokens(){
    this.seguridadService.consultarTokens()
      .subscribe(
        data => {
          console.log(data);
          localStorage.setItem('miCuenta.getToken', data['respuesta']['ClaveGetEncrip']);
          localStorage.setItem('miCuenta.postToken', data['respuesta']['ClavePostEncrip']);
          localStorage.setItem('miCuenta.putToken', data['respuesta']['ClavePutEncrip']);
          localStorage.setItem('miCuenta.deleteToken', data['respuesta']['ClaveDeleteEncrip']);
        },
        err => console.log(err)
      )
  }

}
