import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Services
import { UsuarioService } from 'src/app/services/usuario.service';

// Interfaces
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { Privilegios } from 'src/app/interfaces/privilegios/privilegios';

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Components
import { Modulo } from 'src/app/interfaces/modulo/modulo';
import { PersonaService } from 'src/app/services/persona.service';
import { Persona } from 'src/app/interfaces/persona/persona';


import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalAsignacionUsuarioPersonaComponent } from '../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component';
import { TipoDocumento } from 'src/app/interfaces/tipo-documento/tipo-documento';

export interface DialogData {
  cedula: string;
  idPersona: string;
}

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  myForm: FormGroup;
  constructor(
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private personaService: PersonaService,
  ) {
    this.myForm = new FormGroup({
      _valorUsuario: new FormControl('', [Validators.required]),
      _contrasena: new FormControl('', [Validators.required])
    })
  }

  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  botonInsertar = 'insertar';
  cedula: string;
  filterUsuario = '';
  idPersona: string;
  idUsuario: string;
  inputType = 'password';
  modulo = '0';
  privilegio = '0';
  tipoUsuario = '0';
  resultadoModal: DialogData;
  removableModulo = true;
  removablePrivilegio = true;
  selectableModulo = true;
  selectablePrivilegio = true;
  selectTipoUsuario = true;

  chipsPrivilegios: Privilegios[] = [];
  chipsModulos: Modulo[] = [];
  modulos: Modulo[] = [];
  personas: Persona[] = [];
  privilegios: Privilegios[] = [];
  tipoUsuarios: TipoDocumento[] = [];
  usuarios: Usuario[] = [];

  idAsignacionTipoUsuario:string;
  idTipoUsuario:string;

  consultarUsuarios() {
    this.usuarioService.consultarUsuarios(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          console.log(ok);
          this.usuarios = ok['respuesta'];
          console.log("datos tabla =");
          console.log(this.usuarios);
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarTipoUsuario(){
    this.usuarioService.consultarTipoUsuario(localStorage.getItem('miCuenta.getToken'))
    .then(
      ok => {
        console.log(ok);
        this.tipoUsuarios = ok['respuesta'];
        console.log(this.tipoUsuario);
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

  validacionFormulario() {
    if (this.myForm.valid) {
      if (this.testButton.nativeElement.value == "insertar") {
        this.crearUsuario();
      } else if (this.testButton.nativeElement.value == "modificar") {
        console.log("BD = "+this.idTipoUsuario)
        console.log("FORM = "+this.tipoUsuario)
        if(this.idTipoUsuario == this.tipoUsuario)
        {
          this.actualizarUsuario();
        }else {
          this.actualizarUsuario();
          this.eliminarAsignacionTipoUsuario();
          this.asignarTipoUsuario(this.idUsuario);
          this.consultarUsuarios();
        }
        this.myForm.reset();
        this.testButton.nativeElement.value = "insertar";
      }
    }
  }

  asignarTipoUsuario(idUsuario: string) {
    this.usuarioService.asignacionTipoUsuario(idUsuario,this.tipoUsuario,localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          this.consultarUsuarios();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  actualizarUsuario() {
    this.usuarioService.actualizarUsuario(
      this.idUsuario,
      this.idPersona,
      this.myForm.get('_valorUsuario').value,
      this.myForm.get('_contrasena').value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          this.cedula = "";
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

  validarSelects(
    tipoUsuario: string
  ) {
    if (tipoUsuario == "0") {
      this.selectTipoUsuario = false;
    }
  }

  onChangeSelectTipoUsuario(value) {
    if (value != "0") {
      this.selectTipoUsuario = true;
    }
  }

  crearUsuario() {
    this.validarSelects(this.tipoUsuario);
    var datosUsuario = {
      idPersona: this.idPersona,
      usuario: this.myForm.get('_valorUsuario').value,
      contrasena: this.myForm.get('_contrasena').value,
      token: localStorage.getItem('miCuenta.postToken')
    }
    this.usuarioService.crearUsuario(datosUsuario)
      .then(
        ok => {
          console.log("datos usuarios nuevo");
          console.log(ok['respuesta']);
          this.cedula = "";
          this.asignarTipoUsuario(ok['respuesta']);
        }
      )
      .catch(
        error => {
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

  eliminarAsignacionTipoUsuario()
  {
    this.usuarioService.eliminarAsignacionTipoUsuario(
      this.idAsignacionTipoUsuario,
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
  eliminarUsuario(idUsuario: string) {
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

  setUsuario(
    idUsuario: string,
    usuarioLogin: string,
    idPersona: string,
    contrasena: string,
    idTipoUsuario: string,
    asignacionTipoUsuarioEntidad:string
  ) {
    this.idAsignacionTipoUsuario=asignacionTipoUsuarioEntidad['IdAsignacionTU'];
    this.idUsuario = idUsuario;
    this.idPersona = idPersona;
    this.testButton.nativeElement.value = 'modificar';
    this.tipoUsuario=idTipoUsuario;
    this.idTipoUsuario=idTipoUsuario;
    this.myForm.setValue({
      _valorUsuario: usuarioLogin,
      _contrasena: ''
    })
  }

  ngOnInit() {
    this.cedula = "";
    this.consultarUsuarios();
    this.consultarTipoUsuario();
    this.consultarPrivilegios();
    this.consultarModulos();
  }

  addPrivilegio(event) {
    this.chipsPrivilegios.push({
      IdPrivilegios: event.target.selectedIndex,
      Descripcion: event.target.value
    });
  }

  removePrivilegio(privilegio) {
    const index = this.chipsPrivilegios.indexOf(privilegio);
    if (index >= 0) {
      this.chipsPrivilegios.splice(index, 1);
      this.privilegio = '0';
    }
  }

  addModulo(event) {
    this.chipsModulos.push({
      IdModulo: event.target.selectedIndex,
      Descripcion: event.target.value
    });
  }

  removeModulo(modulo) {
    const index = this.chipsModulos.indexOf(modulo);
    if (index >= 0) {
      this.chipsModulos.splice(index, 1);
      this.modulo = '0';
    }
  }
}
