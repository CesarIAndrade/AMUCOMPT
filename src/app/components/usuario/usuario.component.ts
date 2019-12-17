import { Component, OnInit } from '@angular/core';

// Services
import { UsuarioService } from 'src/app/services/usuario.service';
import { TipoDocumentoService } from "../../services/tipo-documento.service";
import { PrivilegiosService } from "../../services/privilegios.service";

// Interfaces
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { TipoDocumentos } from "../../interfaces/tipo-documento/tipo-documento";
import { Privilegios } from 'src/app/interfaces/privilegios/privilegios';

// Components
import { UsuarioModalComponent } from "../usuario-modal/usuario-modal.component";

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  constructor(private usuarioService: UsuarioService,
    private tipoDocumentoService: TipoDocumentoService,
    private privilegiosService: PrivilegiosService ) { }

  contrasena: string;
  inputType: string = "password";
  privilegios: Privilegios[] = [];
  privilegio: string = "0";
  tipoDocumento: string = "0";
  tipoDocumentos: TipoDocumentos[] = [];
  usuarios: Usuario[] = [];

  consultarUsuarios() {
    this.usuarioService.consultarUsuarios(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          console.log(ok);
          this.usuarios = ok['respuesta'];
          console.log(this.usuarios);
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarTipoDocumentos() {
    this.tipoDocumentoService.consultatTipoDocumentos(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          console.log(ok);
          this.tipoDocumentos = ok['respuesta'];
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarPrivilegios(){
    this.privilegiosService.consultarPrivilegios(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          console.log(ok);
          this.privilegios = ok['respuesta'];
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  mostrarContrasena(){
    if(this.inputType == "password"){
      this.inputType = "text";
    }
    else{
      this.inputType = "password";
    }
  }

  abrirModel(){
    
  }

  test() {
    console.log('worked');
  }

  ngOnInit() {
    this.consultarUsuarios();
    this.consultarTipoDocumentos();
    this.consultarPrivilegios();
  }

}
