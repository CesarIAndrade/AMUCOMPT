import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private usuarioService:UsuarioService) {
   }

   usuario: string;
   contrasena: string;

   test(){
     console.log(this.contrasena);
   }

  ngOnInit() {
  }

  login(){
    if (this.usuario != "" && this.contrasena != "") {
      this.usuarioService.login(this.usuario,this.contrasena).subscribe(item=>{
        console.log(item.respuesta);
      },error=>{});
    }
  }

}
