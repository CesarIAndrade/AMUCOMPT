import { Component, OnInit, Inject } from '@angular/core';

// Services
import { UsuarioService } from 'src/app/services/usuario.service';

// Interfaces
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { Privilegios } from 'src/app/interfaces/privilegios/privilegios';
import { PersonaModal } from "../../interfaces/persona/persona-modal";

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Components
import { ModalUsuarioComponent } from "../modal-usuario/modal-usuario.component";
import { Modulo } from 'src/app/interfaces/modulo/modulo';
import { TabsUsuarioComponent } from '../tabs-usuario/tabs-usuario.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    @Inject(TabsUsuarioComponent) private tabsUsuarioComponent: TabsUsuarioComponent 
    ) { }

  contrasena: string;
  inputType = 'password';
  modulos: Modulo[] = [];
  modulo = '0';
  persona: PersonaModal;
  privilegios: Privilegios[] = [];
  privilegio = '0';  
  usuarios: Usuario[] = [];

  // Por si se usa modal
  apellidos: string;
  correoModal: string;
  nombres: string;
  numeroDocumento: string;
  numeroExtra = true;
  telefonoModal1: string;
  telefonoModal2: string;
  telefonoModal3: string;
  tipoDocumento = '0';

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
    this.usuarioService.consultarPrivilegios(localStorage.getItem('miCuenta.getToken'))
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
    if(this.inputType == 'password'){
      this.inputType = 'text';
    }
    else{
      this.inputType = 'password';
    }
  }

  // Por si se usa modal
  abrirModel(){
    let dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: '550px',
      height: '400px',
      data: {
        nombres: this.nombres,
        apellidos: this.apellidos,
        tipoDocumento: this.tipoDocumento,
        telefono1: this.telefonoModal1,
        telefono2: this.telefonoModal2,
        telefono3: this.telefonoModal3,
        correo: this.correoModal
      }
    });
    dialogRef.afterClosed().subscribe(
      ok => {
        console.log(`Result: ${ok}`);
        this.persona = ok;
        console.log(this.persona);
      }
    )
  }

  changeTabIndex(){
    this.tabsUsuarioComponent.changeTabIndex(-1);
  }

  ngOnInit() {
    // this.consultarUsuarios();
    // this.consultarPrivilegios();
  }

}
