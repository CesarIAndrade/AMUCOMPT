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
import { Modulo } from 'src/app/interfaces/modulo/modulo';
import { PersonaService } from 'src/app/services/persona.service';
import { PersonaComponent } from '../persona/persona.component';
import { Persona } from 'src/app/interfaces/persona/persona';


import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  constructor(
    private usuarioService: UsuarioService,
    private personaService: PersonaService,
  ) { }

  contrasena: string;
  inputType = 'password';
  modulo = '0';
  privilegio = '0';

  personas : Persona[] = [];
  modulos: Modulo[] = [];
  privilegios: Privilegios[] = [];
  usuarios: Usuario[] = [];
  Cedula : string;
  idPersona : string;
  valorUsuario : string;

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
          this.consultarUsuarios();

        },
        err => console.log(err)
      )
  }

  asignarUsuarioaPersona(idPersona: string,numeroDocumento: string)
  {
    this.Cedula = numeroDocumento;
    this.idPersona = idPersona;
  }

  validacionFormulario()
  {
    if(this.Cedula.length>0 && this.valorUsuario.length>0 && this.contrasena.length>0)
    {
      this.guardarUsuario();
    }else
    {
      alert("falta algun campo");
    }
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
        console.log(ok['respuesta']);
        alert("Ingresado Correctamente");
      }
    )
    .catch(
      error =>{
        console.log(error);
      }
    )
    
  }

  modal()
  {
    console.log("wds")
  }
  ngOnInit() {
    this.Cedula="";
    this.valorUsuario="";
    this.consultarPersonas();
    this.consultarPrivilegios();
    this.consultarModulos();
    
  }

}
