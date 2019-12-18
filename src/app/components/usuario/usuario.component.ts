import { Component, OnInit } from '@angular/core';

// Services
import { UsuarioService } from 'src/app/services/usuario.service';
import { PrivilegiosService } from "../../services/privilegios.service";

// Interfaces
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { Privilegios } from 'src/app/interfaces/privilegios/privilegios';

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Components
import { ModalUsuarioComponent } from "../modal-usuario/modal-usuario.component";
import { Modulo } from 'src/app/interfaces/modulo/modulo';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  constructor(private usuarioService: UsuarioService,
    private privilegiosService: PrivilegiosService,
    private dialog: MatDialog ) { }

  contrasena: string;
  inputType: string = "password";
  modulos: Modulo[] = [];
  modulo: string = "0";
  privilegios: Privilegios[] = [];
  privilegio: string = "0";  
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
    let dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: '550px',
      height: '430px',
      data: {
        name: "cesar",
      }
    });
    dialogRef.afterClosed().subscribe(
      ok => {
        console.log(`Result: ${ok}`);
        if(ok == "true"){
          console.log('true');
        }
      }
    )
  }

  test() {
    console.log('worked');
  }

  ngOnInit() {
    this.consultarUsuarios();
    this.consultarPrivilegios();
  }

}
