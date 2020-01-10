import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Services
import { UsuarioService } from 'src/app/services/usuario.service';

// Interfaces
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { Privilegios } from 'src/app/interfaces/privilegios/privilegios';
import { PersonaModal } from "../../interfaces/persona/persona-modal";

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Components
import { Modulo } from 'src/app/interfaces/modulo/modulo';
import { PersonaService } from 'src/app/services/persona.service';
import { PersonaComponent } from '../persona/persona.component';
import { Persona } from 'src/app/interfaces/persona/persona';


import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalAsignacionUsuarioPersonaComponent } from '../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component';

import { FilterPipe } from "../../pipes/filter.pipe";

export interface DialogData {
  cedula: string;
  idPersona: string;
}

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {


  constructor(
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private personaService: PersonaService,
  ) { }

  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  contrasena: string;
  inputType = 'password';
  modulo = '0';
  privilegio = '0';

  personas : Persona[] = [];
  modulos: Modulo[] = [];
  privilegios: Privilegios[] = [];
  usuarios: Usuario[] = [];
  cedula : string;
  idPersona : string;
  valorUsuario : string;
  resultadoModal: DialogData;
  idUsuario: string;

  botonInsertar = 'insertar';

  filterUsuario : string = '';

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

  consultarPrivilegios() {
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

  consultarModulos() {
    this.usuarioService.consultarModulos(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          console.log(ok);
          this.modulos = ok['respuesta'];
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  mostrarContrasena() {
    if (this.inputType == 'password') {
      this.inputType = 'text';
    }
    else {
      this.inputType = 'password';
    }
  }

  consultarPersonas() {
    this.personaService.consultarPersonas(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.personas = ok['respuesta'];
          console.log(this.personas);
        },
        err => console.log(err)
      )
  }

  asignarUsuarioaPersona(idPersona: string,numeroDocumento: string)
  {
    this.cedula = numeroDocumento;
    this.idPersona = idPersona;
  }

  validacionFormulario()
  {
    if(this.testButton.nativeElement.value == "insertar")
    {
      if(this.cedula.length>0 && this.valorUsuario.length>0 && this.contrasena.length>0)
      {
        this.guardarUsuario();
      }else
      {
        console.log("falta algun campo");
      }
    }else if(this.testButton.nativeElement.value == "modificar"){
      console.log(this.valorUsuario+' '+this.contrasena)
      if(this.contrasena==null){
        console.log("falta algun campo");
      }else{
        if(this.valorUsuario.length>0 && this.contrasena.length>0)
        {
          this.modificarUsuario();
        }else
        {
         console.log("falta algun campo");
        }
      }
    }
  }

  modificarUsuario()
  {
    this.usuarioService.actualizarUsuario(
      this.idUsuario,
      this.idPersona,
      this.valorUsuario,
      this.contrasena,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          this.limpiarFormulario();
          this.consultarUsuarios();
          this.testButton.nativeElement.value = 'insertar';
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  guardarUsuario()
  {
    var datosUsuario={
      idPersona: this.idPersona,
      usuario : this.valorUsuario,
      contrasena : this.contrasena,
      token : localStorage.getItem('miCuenta.postToken')
    }
    this.usuarioService.crearUsuario(datosUsuario)
    .then(
      ok => {
        this.consultarUsuarios();
        this.limpiarFormulario();
      }
    )
    .catch(
      error =>{
        console.log(error);
      }
    )
  }

  abrirModal() {
    let dialogRef = this.dialog.open(ModalAsignacionUsuarioPersonaComponent, {
      width: '900px',
      height: '500px',
      data: {
        cedula: this.cedula,
        idPersona: this.idPersona
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.resultadoModal = result;
      console.log(this.resultadoModal);
      this.cedula = this.resultadoModal.cedula;
      this.idPersona = this.resultadoModal.idPersona;
    });
  }

  limpiarFormulario()
  {
    this.cedula="";
    this.valorUsuario="";
    this.contrasena="";
  }

  eliminarUsuario(idUsuario: string)
  {
    this.usuarioService.eliminarUsuario(
      idUsuario,
      localStorage.getItem('miCuenta.deleteToken'))
      .then(
        ok => {
          this.consultarUsuarios();
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  setUsuario(IdUsuario: string,UsuarioLogin: string,IdPersona: string)
  {
    this.idUsuario=IdUsuario;
    this.idPersona = IdPersona;
    this.testButton.nativeElement.value = 'modificar';
    this.valorUsuario = UsuarioLogin;
  }

  ngOnInit() {
    this.cedula="";
    this.valorUsuario="";
    this.consultarUsuarios();
    this.consultarPrivilegios();
    this.consultarModulos();
  }

}
