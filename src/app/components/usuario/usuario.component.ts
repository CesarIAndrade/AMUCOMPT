import { Component, OnInit } from '@angular/core';

// Services
import { UsuarioService } from 'src/app/services/usuario.service';
import { TipoDocumentoService } from "../../services/tipo-documento.service";

// Interfaces
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { TipoDocumentos } from "../../interfaces/tipo-documento/tipo-documento";

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  constructor(private usuarioService: UsuarioService,
    private tipoDocumentoService: TipoDocumentoService) { }

  usuarios: Usuario[] = [];
  consultarUsuarios(){
    this.usuarioService.consultarUsuarios(localStorage.getItem('miCuenta.getToken'))
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

  tipoDocumentos: TipoDocumentos[] = [];
  consultarTipoDocumentos(){
    this.tipoDocumentoService.consultatTipoDocumentos(localStorage.getItem('miCuenta.getToken'))
      .subscribe(
        data => {
          this.tipoDocumentos = data.respuesta;
          console.log(data.respuesta);
        },
        error => console.log(error)
      )
  }

  tipoDocumento: string;
  test(){
    console.log(this.tipoDocumento);
  }
  ngOnInit() {
    this.consultarUsuarios();
    this.consultarTipoDocumentos();
  }

}
