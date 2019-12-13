import { Component, OnInit } from '@angular/core';

// Services
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/interfaces/usuario/usuario';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  constructor(private usuarioService: UsuarioService) { }

  usuarios: Usuario[] = [];
  consultarUsuarios(){
    this.usuarioService.consultarUsuarios()
      .subscribe(
        data => {
          this.usuarios = data.respuesta;
          console.log(data.respuesta);
        },
        error => {
          console.log(error);
        }
      )

  }

  ngOnInit() {
    this.consultarUsuarios();
  }

}
